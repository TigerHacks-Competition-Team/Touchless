import React, { Component } from 'react';

class Subcategory extends React.Component{
    render(){
        return (
                <div style={styles.subCategoryDiv}>
                  <button style={styles.menu}
                          onClick={this.props.onClick}>
                  {this.props.data.name}</button>
                    {this.props.toRender && this.props.data.menuItems.map(element => (
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
            renderedSubmenu: 0,
            data:
            [
                {
                name: "Breakfast",
                menuItems: ["Pancake", "Cheese"],
                },
                {
                name: "Lunch",
                menuItems: ["Sandwich", "Soup"],
                },
                {
                name: "Dinner",
                menuItems:["Pasta", "Chicken"],
                }

            ]  
        }
    }

    openCategory = (nthCategory) => {
      let numCategories = this.state.data.length
      if (nthCategory > numCategories) {
        console.log("Invalid Category")
        return
      }
      this.setState({
        renderedSubmenu: nthCategory,
      })
      console.log(this.state.renderedSubmenu)
    }
    
    listener

    render() {
      let num = this.props.currentNum - 1
      return (
       <div>
           <Subcategory data={this.state.data[0]} 
                        toRender={num === 0}
                        onClick={() => this.openCategory(0)}/>
           <Subcategory data={this.state.data[1]} toRender={num === 1}
                        onClick={() => this.openCategory(1)}/>
           <Subcategory data={this.state.data[2]} toRender={num === 2}
                        onClick={() => this.openCategory(2)}/>
       </div>
      );
    }
  }


export default Menu;

const styles = {
    subCategoryDiv: {
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
    },
    menu: {
      textAlign: "center",
      color: '#3DC4BB',
      fontSize: "1.5em",
    },
    menuItems: {
        margin: "2px",
        padding: "1px",
        textAlign: "center"
    }
  }