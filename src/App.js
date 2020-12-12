import React from 'react';

class App extends React.Component {
  render(){
  return (
    <div className="App">
      <p style={styles.header}>Touchless</p>
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
