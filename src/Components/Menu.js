import React, { Component } from 'react';

class Subcategory extends React.Component{
    render(){
        return (
                <div style={styles.subCategoryDiv}>
                  <button style={this.props.hovered ? styles.hoveredMenu : styles.menu}
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
            hoveredSubmenu: -1,
            renderedSubmenu: -1,
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
    
    handleGestures() {
      if (this.props.currentNum !== 0) {
        this.state.hoveredSubmenu = this.props.currentNum - 1
      }
      this.props.classNums.forEach((num) => {
        if (num === 3) {
          this.state.renderedSubmenu = this.state.hoveredSubmenu
        }
      })
    }

    render() {
      this.handleGestures()
      return (
       <div>
           <Subcategory data={this.state.data[0]} 
                        toRender={this.state.renderedSubmenu === 0}
                        hovered = {this.state.hoveredSubmenu === 0}
                        onClick={() => this.openCategory(0)}/>
           <Subcategory data={this.state.data[1]}
                        toRender={this.state.renderedSubmenu === 1}
                        hovered = {this.state.hoveredSubmenu === 1}
                        onClick={() => this.openCategory(1)}/>
           <Subcategory data={this.state.data[2]} 
                        toRender={this.state.renderedSubmenu === 2}
                        hovered = {this.state.hoveredSubmenu === 2}
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
    hoveredMenu: {
      textAlign: "center",
      backgroundColor: '#3DC4BB',
      color: '#ffffff',
      fontSize: "1.5em",
    },
    menuItems: {
        margin: "2px",
        padding: "1px",
        textAlign: "center"
    }
  }