// A new method for function that allow you to wrap any function in another function
// as described in 'Aspect-oriented Programming on a Shoestring'
Function.prototype.wrap = function(wrapper) {
  var __method = this;

  return function() {
    var args = [];

    // we need to copy arguments to a new array so concat works below
    for (var i=0; i<arguments.length; i++) args.push(arguments[i]);

    return wrapper.apply(this, [__method.bind(this)].concat(args)); 
  }
};
