import { conv2dTranspose } from "@tensorflow/tfjs";
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
        <div style={styles.categoryContainer}>
          <button
            style={
              this.props.hovered
                ? { ...styles.hoveredMenu, ...styles.category }
                : { ...styles.menu, ...styles.category }
            }
            onClick={this.props.onClick}
          >
            {this.props.data.name}
          </button>
          <button
            onClick={() => this.props.removeCategory(this.props.data.name)}
            style={styles.removeBtn}
          >
            Remove
          </button>
        </div>

        {this.props.toRender && (
          <div>
            {this.props.data.menuItems.map((element, index) => (
              <div style={styles.itemContainer}>
                <p
                  style={
                    this.props.hoveredItemMenu === index
                      ? { ...styles.hoveredMenu, ...styles.item }
                      : { ...styles.menu, ...styles.item }
                  }
                >
                  {element}
                </p>
                <button
                  onClick={() =>
                    this.props.removeMenuItem(this.props.data.name, element)
                  }
                  style={{ ...styles.removeBtn, height: "30px" }}
                >
                  Remove
                </button>
              </div>
            ))}
            {this.props.allowItemChanges && (
              <div style={styles.inputCont}>
                <input
                  placeholder="Item Name"
                  onChange={(e) => this.setState({ newItem: e.target.value })}
                  value={this.state.newItem}
                  style={styles.input}
                />
                <button
                  onClick={() => {
                    this.props.addMenuItem(
                      this.props.data.name,
                      this.state.newItem
                    );
                  }}
                  style={styles.submitBtn}
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
      hoveredSidesSubmenu: -1,
      renderedSidesSubmenu: -1,
      hoveredItemMenu: -1,
      renderedItemMenu: -1,
      hoveredSubmenu: -1,
      menuLevel: 0,
      data: null,
      newCatName: "",
      newSideName: "",
      currentIdx: this.props.currentNum - 1,
      receipt: [{category: "Breakfast", menuItem: "pancakes", side: "hash browns"}],
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

  resetMenu() {
    this.setState({
      hoveredSidesSubmenu: -1,
      renderedSidesSubmenu: -1,
      hoveredItemMenu: -1,
      renderedItemMenu: -1,
      hoveredSubmenu: -1,
      menuLevel: 0,
    });
  }

  handleGestures() {
    console.log("Menu Level: " + this.state.menuLevel);
    if (this.props.currentNum !== 0) {
      console.log("hovering a menu");
      switch (this.state.menuLevel) {
        case 0:
          this.state.hoveredSubmenu = this.props.currentNum - 1;
          break;
        case 1:
          this.state.hoveredItemMenu = this.props.currentNum - 1;
          break;
        case 2:
          this.state.hoveredSidesSubmenu = this.props.currentNum - 1;
          break;
      }
    }
    let doubleClosed = (this.props.classNums.length == 2 && this.props.classNums[0] == 1 && this.props.classNums[1] == 1)
    this.props.classNums.forEach((num) => {
      if (num === 3 || doubleClosed) {
        switch (this.state.menuLevel) {
          case 0:
            if (this.state.hoveredSubmenu != -1) {
              this.state.renderedItemMenu = this.state.hoveredSubmenu;
              this.state.menuLevel = 1;
            }
            return;
          case 1:
            if (this.state.hoveredItemMenu != -1) {
              this.state.renderedSidesSubmenu = this.state.hoveredItemMenu;
              this.state.menuLevel = 2;
            }
            return;
          case 2:
            if (this.state.hoveredSidesSubmenu != -1) {
              //this.resetMenu();
            }
            return;
        }
      }
      if (num === 2) {
          // this.resetMenu()
      }
    });
  }

  render() {
    this.handleGestures();
    return (
      <div>
        {this.state.data != null && (
          <div>
            <h2 style={styles.menuHeaders}>Entrees</h2>
            {this.state.data.options.map((object, index) => {
              return (
                <Subcategory
                  data={object}
                  toRender={this.state.renderedItemMenu === index}
                  onClick={() => {
                    this.setState({ renderedItemMenu: index });
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
        <div style={styles.inputCont}>
          <input
            placeholder="Category Name"
            onChange={(e) => this.setState({ newCatName: e.target.value })}
            value={this.state.newCatName}
            style={styles.input}
          />
          <button
            onClick={() => {
              this.menuObj.addCategory(this.state.newCatName);
              this.setState({ data: this.menuObj.menu });
            }}
            style={styles.submitBtn}
          >
            Add Category
          </button>
        </div>
        {this.state.sides != null && this.state.renderedItemMenu != -1 && (
          <div style={{ borderTop: "solid 1px #DDD" }}>
            <h2 style={styles.menuHeaders}>Sides</h2>
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
                  removeCategory={(cat) =>
                    this.sidesMenuObj.removeCategory(cat)
                  }
                  hovered={this.state.hoveredSidesSubmenu === index}
                />
              );
            })}
            <div style={styles.inputCont}>
              <input
                placeholder="Side Name"
                onChange={(e) => this.setState({ newSideName: e.target.value })}
                value={this.state.newSideName}
                style={styles.input}
              />
              <button
                onClick={() => {
                  this.sidesMenuObj.addCategory(this.state.newSideName);
                  this.setState({ sides: this.sidesMenuObj.menu });
                }}
                style={styles.submitBtn}
              >
                Add Side
              </button>
            </div>
          </div>
        )}
        {this.state.receipt.length > 0 && (
          <div>
            {this.state.receipt.map((item) => {
              return (
                <div>
                  <p>
                    {item.menuItem}, {item.side},
                  </p>
                </div>
              );
            })}
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
    marginLeft: "8px",
    marginRight: "8px",
    //flexDirection: "column",
    borderBottom: "#DDD 1px solid",
  },
  category: {
    width: "100%",
    border: "none",

    padding: 8,
    outline: "none",
    minHeight: "50px",
  },
  item: {
    width: "100%",
    border: "none",
    outline: "none",
    minHeight: "10px",
    fontSize: "1em",
  },
  menu: {
    textAlign: "center",
    color: "#3DC4BB",
    fontSize: "1.5em",
    backgroundColor: "#ffffff",
  },
  categoryContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    marginTop: "8px",
    marginBottom: "8px",
  },
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    width: "calc(100%-16px)",
    marginLeft: "8px",
    marginRight: "8px",
    marginTop: "4px",
    marginBottom: "4px",
    justifyContent: "center",
    alignItems: "center",
  },
  removeBtn: {
    border: "none",
    backgroundColor: "#ff6961",
    color: "#fff",
  },
  input: {
    width: "100%",
    border: "none",
    outline: "none",
    borderBottom: "solid 1px #808080",
    marginRight: "8px",
    marginBottom: "2px",
  },
  inputCont: {
    width: "calc(100% - 16px)",
    display: "flex",
    flexDirection: "row",
    margin: "8px",
  },
  submitBtn: {
    border: "none",
    outline: "none",
    backgroundColor: "#3DC4BB",
    padding: "4px",
    color: "#fff",
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
  menuHeaders: {
    textAlign: "center",
    color: "#3DC4BB",
    borderBottom: "dashed 2px #3dc4bb",
    fontSize: "2.5em",
  },
};
