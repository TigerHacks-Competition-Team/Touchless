import React, { Component } from 'react';

class TodoItem extends React.Component {
    constructor(props) {
      super(props);
  
      this.handleUpdate = this.handleUpdate.bind(this);
    }
  
    handleUpdate(todo) {
      this.props.handleUpdate(todo);
    }
  
    render() {
            return (
                <li>{this.props.todo}</li>
            );
    }
  }

export default MenuItem;