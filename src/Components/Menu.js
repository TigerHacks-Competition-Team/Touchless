import React, { Component } from 'react';


const Subcategory = ({ data = { menuItems: [] }, ...props }) => (
    <div className="subcategory" {...props}>
      <h2>{data.name}</h2>
      <ul>
        {data.menuItems.map(element => (
          <li key={element.description}>
            {element.description}
          </li>
        ))}
      </ul>
    </div>
  );


class Menu extends React.Component {
    constructor(props) {
      super(props);
        this.state = {
            data:
            [
                {
                name: Breakfast,
                menuItems: []
                },
                {
                name: Lunch,
                menuItems: []
                }
            ]  
        }
    }
  
    render() {
    
          
      return (
        <ul>

        </ul>
      );
    }
  }


export default Menu;