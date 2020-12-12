import React from 'react';
import Menu from './Components/Menu';
import * as tf from "@tensorflow/tfjs";
import "./MLModel";
import MLModel from "./MLModel";


class App extends React.Component {
  videoRef = React.createRef()
  canvasRef = React.createRef()

  async componentDidMount() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const webCamPromise = navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            facingMode: "user",
            width: { exact: 416 },
            height: {exact: 416}, 
          }
        })
        .then((stream) => {
          window.stream = stream
          this.videoRef.current.srcObject = stream
          return new Promise((resolve, reject) => {
            this.videoRef.current.onloadedmetadata = () => {
              resolve()
            }
          })
        })
      
      const model = new MLModel("web_model/model.json");
      const modelPromise = model.load();
      console.log("getting model");
      Promise.all([modelPromise, webCamPromise])
        .then((values) => {
          console.log("got model: ");
          this.model = model;
          this.detectFrame(this.videoRef.current);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }



detectFrame = (video) => {
    this.model.infer(video, 2, 0.04).then((predictions) => {
      //console.log("adding to frame: " + JSON.stringify(predictions[0].bbox));
      this.renderPredictions(predictions);
      requestAnimationFrame(() => {
        this.detectFrame(video);
      });
    });
  };

renderPredictions = (predictions) => {
    const classes = ["Not Detecting", "Closed Hand", "Thumbs Down", "Thumbs Up", "Five", "Four", "One", "Three", "Two"];
    const ctx = this.canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Font options.
    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";
    console.log("predictions: " + predictions.length);
    predictions.forEach((prediction) => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];
      console.log(
        "x: " + x + "; y: " + y + "; width: " + width + "; height: " + height
      );
      // Draw the bounding box.
      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, width, height);
      // Draw the label background.
      ctx.fillStyle = "#00FFFF";
      const textWidth = ctx.measureText(
        classes[prediction.class] + " %" + prediction.score
      ).width;
      const textHeight = parseInt(font, 10); // base 10
      ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
    });

    predictions.forEach((prediction) => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      // Draw the text last to ensure it's on top.
      ctx.fillStyle = "#000000";
      ctx.fillText(classes[prediction.class] + " %" + prediction.score * 100, x, y);
    });
  };
  render(){
  return (
    <div className="App">
      
      <video
        className="size"
        autoPlay
        playsInline
        muted
        ref={this.videoRef}
        width="416"
        height="416"
      />
      <canvas
        className="size"
        ref={this.canvasRef}
        width="416"
        height="416"
      />
      <div style={styles.box}>
      <p style={{alignText: "center"}}>MENU</p>
        <Menu />
      </div>
    </div>
  );
  }
}

const styles = {
  box: {
    alignContent: "center",
    width: '30%',
    border: '1px solid #A9A9A9',
    marginTop: '2%',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '10px',
    paddingRight: 50,
  },
}

export default App;
