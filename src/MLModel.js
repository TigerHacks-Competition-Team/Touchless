import * as tf from "@tensorflow/tfjs";

const viewPort = [416, 416];

export default class MLModel {
  constructor(props) {
    this.model = props;
  }

  load = async () => {
    return new Promise(async (resolve) => {
      this.model = await tf.loadGraphModel(this.model);
      resolve();
    });
  };

  infer = async (img, maxNumBoxes, minScore) => {
    tf.setBackend("webgl")
    img = tf.browser.fromPixels(img);
    img = tf.image.resizeBilinear(img, [416, 416]);
    img = img.expandDims(0);
    img = await this.rgbToGrayScale(img)
    const height = img.shape[1] * (viewPort[1] / 416);
    const width = img.shape[2] * (viewPort[0] / 416);

    // model returns two tensors:
    // 1. box classification score with shape of [1, 1917, 90]
    // 2. box location with shape of [1, 1917, 1, 4]
    // where 1917 is the number of box detectors, 90 is the number of classes.
    // and 4 is the four coordinates of the box.
    console.log("this.model: " + this.model);
    const result = await this.model.executeAsync(img, [
      "detection_scores",
      "detection_classes",
      "detection_boxes",
    ]);

    if (result != null) {
      const scores = result[0].dataSync();
      const boxes = result[2].dataSync();
      var clss = result[1].arraySync();
      clss = clss[0];

      // clean the webgl tensors
      //batched.dispose();
      //tf.dispose(result);

      const [maxScores, classes] = this.calculateMaxScores(
        scores,
        boxes.length,
        clss.length
      );

      const prevBackend = tf.getBackend();
      // run post process in cpu
      if (tf.getBackend() === "webgl") {
        tf.setBackend("cpu");
      }
      var boxes2 = tf.tensor2d(boxes, [result[2].shape[1], result[2].shape[2]]);
      const indexTensor = tf.tidy(() => {
        return tf.image.nonMaxSuppression(boxes2, maxScores, maxNumBoxes, minScore);
      });
      const indexes = indexTensor.arraySync();
      indexTensor.dispose();

      // restore previous backend
      if (prevBackend !== tf.getBackend()) {
        tf.setBackend(prevBackend);
      }

      return this.buildDetectedObjects(
        width,
        height,
        boxes2.arraySync(),
        scores,
        indexes,
        clss
      );
    } else {
      tf.dispose(result);
      return [];
    }
  };

  rgbToGrayScale = (img) => {
    return new Promise((resolve, reject) => {
      console.log("shape: "+img.shape)
      let it1 = img.shape[1]
      let it2 = img.shape[2]
      img = img.arraySync()
      
      for (let i = 0; i<it1; i++) {
        for (let j = 0; j<it2; j++) {
          let tot = img[0][i][j][0] + img[0][i][j][1] + img[0][i][j][2]
          tot = tot/3
          img[0][i][j][0] = tot
          img[0][i][j][1] = tot
          img[0][i][j][2] = tot
        }
      }
      console.log("img: "+JSON.stringify(img))
      resolve(tf.tensor(img, [1,416,416,3], "int32"))
    })
    
  }

  buildDetectedObjects = (width, height, boxes, scores, indexes, classes) => {
    const count = indexes.length;
    const objects = [];
    for (let i = 0; i < count; i++) {
      const bbox = boxes[indexes[i]];
      const minY = bbox[0] * height;
      const minX = bbox[1] * width;
      const maxY = bbox[2] * height;
      const maxX = bbox[3] * width;
      bbox[0] = minX;
      bbox[1] = minY;
      bbox[2] = maxX - minX;
      bbox[3] = maxY - minY;
      objects.push({
        bbox: bbox,
        class: classes[indexes[i]],
        score: scores[indexes[i]],
      });
    }
    return objects;
  };

  calculateMaxScores = (scores, numBoxes, numClasses) => {
    const maxes = [];
    const classes = [];
    for (let i = 0; i < numBoxes; i++) {
      let max = Number.MIN_VALUE;
      let index = -1;
      for (let j = 0; j < numClasses; j++) {
        if (scores[i * numClasses + j] > max) {
          max = scores[i * numClasses + j];
          index = j;
        }
      }
      maxes[i] = max;
      classes[i] = index;
    }
    return [maxes.slice(0, 100), classes];
  };
}
