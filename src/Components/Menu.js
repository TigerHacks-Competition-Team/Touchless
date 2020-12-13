import React, { Component } from "react";
import MenuObj from "../MenuObj";


class Subcategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newItem: "",
    };
  }
  render() {
    return (
      <div style={styles.subCategoryDiv}>
        <button
          style={this.props.hovered ? styles.hoveredMenu : styles.menu, styles.category}
          onClick={this.props.onClick}
        >
          {this.props.data.name}
          <button
            onClick={() => this.props.removeCategory(this.props.data.name)}
            style={{backgroundColor:'rgba(200, 0, 0, 1)', display:'flex'}}
          >
            Remove
        </button>
        </button>


        {this.props.toRender && (
          <div>
            {this.props.data.menuItems.map((element, index) => (
              <div
                style={
                  index === this.props.hoveredItemMenu
                    ? styles.hoveredMenu
                    : styles.menu
                }
              >
                <p style={styles.menuItems}>{element}</p>
                <button
                  onClick={() =>
                    this.props.removeMenuItem(this.props.data.name, element)
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            {this.props.allowItemChanges && (
              <div>
                <input
                  placeholder="Item Name"
                  onChange={(e) => this.setState({ newItem: e.target.value })}
                  value={this.state.newItem}
                />
                <button
                  onClick={() => {
                    this.props.addMenuItem(
                      this.props.data.name,
                      this.state.newItem
                    );
                  }}
                >
                  Add Item
                </button>
              </div>
            )}
          </div>
        )}
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
      hoveredSidesSubmenu: -1,
      renderedSidesSubmenu: -1,
      hoveredItemMenu: -1,
      data: null,
      newCatName: "",
      newSideName: "",
      currentIdx: this.props.currentNum - 1,
    };
  }

  async componentDidMount() {
    this.menuObj = new MenuObj({ menu: null });
    this.menuObj.setKey("Menu");
    await this.menuObj.load();
    console.log("menu is: " + this.menuObj.toString());
    if (!this.menuObj.menu) {
      console.log("making a menu");
      this.menuObj.setMenu({
        menu: {
          options: [
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
              menuItems: ["Pasta", "Chicken"],
            },
          ],
        },
      });
      this.menuObj.setKey("Menu");
      await this.menuObj.save();
      await this.menuObj.load();
      console.log("menu is: " + this.menuObj.toString());
    }
    this.sidesMenuObj = new MenuObj({ menu: null });
    this.sidesMenuObj.setKey("SidesMenu");
    await this.sidesMenuObj.load();
    console.log("menu is: " + this.sidesMenuObj.toString());
    if (!this.sidesMenuObj.menu) {
      console.log("making a menu");
      this.sidesMenuObj.setMenu({
        menu: {
          options: [
            {
              name: "French Fries",
              menuItems: [],
            },
            {
              name: "Pancakes",
              menuItems: [],
            },
            {
              name: "Two Eggs",
              menuItems: [],
            },
          ],
        },
      });
      this.sidesMenuObj.setKey("SidesMenu");
      await this.sidesMenuObj.save();
      await this.sidesMenuObj.load();
      console.log("sidesMenu is: " + this.sidesMenuObj.toString());
    }
    this.setState({
      data: this.menuObj.menu,
      sides: this.sidesMenuObj.menu,
    });
  }

  addMenuItem = (cat, item) => {
    this.menuObj.addMenuItem(cat, item);
    this.setState({ data: this.menuObj.menu });
  };

  removeMenuItem = (cat, item) => {
    this.menuObj.removeMenuItem(cat, item);
    this.setState({ data: this.menuObj.menu });
  };

  openCategory = (nthCategory) => {
    let numCategories = this.state.data.length;
    if (nthCategory > numCategories) {
      console.log("Invalid Category");
      return;
    }
    this.setState({
      renderedSubmenu: nthCategory,
    });
    console.log(this.state.renderedSubmenu);
  };

  handleGestures() {
    if (this.props.currentNum !== 0) {
      if (this.state.hoveredSubmenu != -1) {
        if (this.state.hoveredItemMenu != -1) {
          this.state.hoveredSidesSubmenu = this.props.currentNum - 1;
        } else {
          this.state.hoveredItemMenu = this.props.currentNum - 1;
        }
      } else {
        this.state.hoveredSubmenu = this.props.currentNum - 1;
        this.state.renderedSubmenu = this.state.hoveredSubmenu;
      }
    }
    this.props.classNums.forEach((num) => {
      if (num === 3) {
        this.state.renderedSubmenu = this.state.hoveredSubmenu;
      }
    });
  }

  render() {
    this.handleGestures();
    return (
      <div>
        {this.state.data != null && (
          <div>
            {this.state.data.options.map((object, index) => {
              return (
                <Subcategory
                  data={object}
                  toRender={this.state.renderedSubmenu === index}
                  onClick={() => {
                    this.setState({ renderedSubmenu: index });
                  }}
                  menuObj={this.menuObj}
                  addMenuItem={this.addMenuItem}
                  removeMenuItem={this.removeMenuItem}
                  removeCategory={(cat) => this.menuObj.removeCategory(cat)}
                  hovered={this.state.hoveredSubmenu === index}
                  hoveredItemMenu={this.state.hoveredItemMenu}
                  allowItemChanges
                />
              );
            })}
          </div>
        )}
        <div>
          <input
            placeholder="Category Name"
            onChange={(e) => this.setState({ newCatName: e.target.value })}
            value={this.state.newCatName}
          />
          <button
            onClick={() => {
              this.menuObj.addCategory(this.state.newCatName);
              this.setState({ data: this.menuObj.menu });
            }}
          >
            Add Category
          </button>
        </div>
        {this.state.sides != null && (
          <div>
            {this.state.sides.options.map((object, index) => {
              return (
                <Subcategory
                  data={object}
                  toRender={this.state.renderedSidesSubmenu === index}
                  onClick={() => {
                    this.setState({ renderedSidesSubmenu: index });
                  }}
                  menuObj={this.menuObj}
                  addMenuItem={this.addMenuItem}
                  removeMenuItem={this.removeMenuItem}
                  removeCategory={(cat) => this.sidesMenuObj.removeCategory(cat)}
                  hovered={this.state.hoveredSidesSubmenu === index}
                />
              );
            })}
            <div>
              <input
                placeholder="Side Name"
                onChange={(e) => this.setState({ newSideName: e.target.value })}
                value={this.state.newSideName}
              />
              <button
                onClick={() => {
                  this.sidesMenuObj.addCategory(this.state.newSideName);
                  this.setState({ sides: this.sidesMenuObj.menu });
                }}
              >
                Add Side
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Menu;

const styles = {
  subCategoryDiv: {
    direction: "flex",
    flex: 1,
    flexDirection: "column",
  },
  category: {
    width: '100%',
    height: 40,
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingLeft: 15
  },
  menu: {
    textAlign: "center",
    color: "#3DC4BB",
    fontSize: "1.5em",
  },
  hoveredMenu: {
    textAlign: "center",
    backgroundColor: "#3DC4BB",
    color: "#ffffff",
    fontSize: "1.5em",
  },
  menuItems: {
    margin: "2px",
    padding: "1px",
    textAlign: "center",
  },
};
