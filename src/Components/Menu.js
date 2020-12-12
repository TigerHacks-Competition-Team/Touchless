import React, { Component } from 'react';

class Subcategory extends React.Component{
    render(){
        return (
                <div>
                  <h2>{this.props.data.name}</h2>
                    {this.props.data.menuItems.map(element => (
                      <div key={element.description}>
                        <p>
                        {element.description}
                        </p>
                      </div>
                    ))}
                </div>
        );
    }
}

class Menu extends React.Component {
    constructor(props) {
      super(props);
        this.state = {
            data:
            [
                {
                name: "Breakfast",
                menuItems: []
                },
                {
                name: "Lunch",
                menuItems: []
                }
            ]  
        }
    }
  
    render() {
    
          
      return (
       <div>
           <Subcategory data={this.state.data[0]} />
       </div>
      );
    }
  }


export default Menu;