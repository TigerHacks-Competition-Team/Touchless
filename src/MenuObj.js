export default class MenuObj {
  constructor(props) {
    this.menu = props.menu
  }

  save(key) {
    return new Promise((resolve, reject) => {
      try {
        let data = toString()
        window.localStorage.setItem(this.key!=null?this.key:key!=null?key:"Menu", this.toString()); // Saves data to local storage
        resolve();
      } catch (error) {
        console.warn("error saving data: " + error);
        reject();
      }
    });
  }

  setKey(key) {
    this.key = key
  }

  load(key) {
    console.log("getting data")
    return new Promise((resolve, reject) => {
      try {
        var menuData = window.localStorage.getItem(this.key!=null?this.key:key!=null?key:"Menu"); // Saves data to local storage
        console.log("data: "+menuData)
        if (menuData == null) {menuData = "null"}
        menuData = JSON.parse(menuData)
        this.menu = menuData
        resolve();
      } catch (error) {
        console.warn("error loading data: " + error);
        reject();
      }
    });
  }

  setMenu(props) {
    this.menu = props.menu
  }

  addCategory(categoryName) {
    console.log("category: "+categoryName)
    this.menu.options.push({name: categoryName, menuItems: []})
    this.save()
    console.log("added a category: "+JSON.stringify({name: categoryName, menuItems: []}))
    return this.menu
  }

  addMenuItem(categoryName, menuItem) {
    let categoryIdx = this.menu.options.findIndex(x => x.name === categoryName)
    this.menu.options[categoryIdx].menuItems.push(menuItem)
    this.save()
    return this.menu
  }

  removeCategory(categoryName) {
    let categoryIdx = this.menu.options.findIndex(x => x.name === categoryName)
    this.menu.options.splice(categoryIdx, 1)
    return this.menu
  }

  removeMenuItem(categoryName, menuItem) {
    let categoryIdx = this.menu.options.findIndex(x => x.name === categoryName)
    let menuItemIdx = this.menu.options[categoryIdx].menuItems.findIndex(x => x === menuItem)
    this.menu.options[categoryIdx].menuItems.splice(menuItemIdx, 1)
    this.save()
    return this.menu
  }

  toString() {
    return JSON.stringify(this.menu)
  }
}
