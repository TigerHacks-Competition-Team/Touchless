import React from 'react';


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
    }
  }
  render(){
  return (
    <div className="App">
      <p style={styles.header}>Touchless</p>
      <video
        className="size"
        autoPlay
        playsInline
        muted
        ref={this.videoRef}
        width="600"
        height="500"
      />
      <canvas
        className="size"
        ref={this.canvasRef}
        width="600"
        height="500"
        alignContent="center"
      />
    </div>
  );
  }
}

const styles = {
  header: {
    textAlign: "center",
    color: '#3DC4BB',
  },
}

export default App;
