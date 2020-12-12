import React, { Component } from 'react';

class Subcategory extends React.Component{
    render(){
        return (
                <div>
                  <h2 style={styles.menu}>{this.props.data.name}</h2>
                    {this.props.data.menuItems.map(element => (
                      <div>
                        <p style={styles.menuItems}>
                        {element}
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
                menuItems: ["Pancake", "Cheese"]
                },
                {
                name: "Lunch",
                menuItems: []
                },
                {
                name: "Dinner",
                menuItems:[]
                }

            ]  
        }
    }
  
    render() {
    
          
      return (
       <div>
           <Subcategory data={this.state.data[0]} />
           <Subcategory data={this.state.data[1]} />
           <Subcategory data={this.state.data[2]} />
       </div>
      );
    }
  }


export default Menu;

const styles = {
    menu: {
      textAlign: "center",
      color: '#3DC4BB',
    },
    menuItems: {
        textAlign: "center"
    }
  }