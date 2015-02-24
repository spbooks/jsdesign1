// JavaScript 1.6 array methods reimplemented for browsers that don't support them
// as discussed in 'Working with Built-ins'
if (!Array.prototype.push)
  Array.prototype.push = function(item) { return this[this.length] = item; }

if (!Array.prototype.forEach) {
  Array.prototype.forEach = function(func, scope) {
    scope = scope || this;
    for (var i = 0, l = this.length; i < l; i++)
      func.call(scope, this[i], i, this); 
  }
}
if (!Array.prototype.map) {
  Array.prototype.map = function(func, scope) {
    scope = scope || this;
    var list = [];
    for (var i = 0, l = this.length; i < l; i++)
        list.push(func.call(scope, this[i], i, this)); 
    return list;
  }
}
if (!Array.prototype.filter) {
  Array.prototype.filter = function(func, scope) {
    scope = scope || this;
    var list = [];
    for (var i = 0, l = this.length; i < l; i++)
        if (func.call(scope, this[i], i, this)) list.push(this[i]); 
    return list;
  }
}

// produce mozilla style generic versions of several array methods
// eg.  Array.forEach(), Array.slice()
['forEach', 'map', 'filter', 'slice', 'concat'].forEach(function(func) {
    // test if it exists already and only create if it doesn't
    if (!Array[func]) Array[func] = function(object) {
      // use the call trick to slice() the first argument off the argument list
      // as that is going to be the object we operate on
      var newArgs = Array.prototype.slice.call(arguments, 1);
      // call the array function with object as this with the arguments we just created
      return this.prototype[func].apply(object, newArgs);
    }
});
