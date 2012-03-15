"use strict";

// ### Menu class
function Menu(items) {
  this.items = items || [];
}

// Add an element to the menu
Menu.prototype.add = function(url, name, count) {
  if (url instanceof Array) {
    for (var i = 0; i < url.length; ++i) {
      this.add(url[i].url, url[i].name, url[i].count);
    }
  } else {
    if (count) {
      name = name + " (" + count + ")";
    }
    this.items.push({
      url: url,
      name: name
    });
  }
};

// Empty the menu
Menu.prototype.clear = function() {
  this.items = [];
};

// Get the array
Menu.prototype.getItems = function() {
  return this.items;
};

module.exports = Menu;
