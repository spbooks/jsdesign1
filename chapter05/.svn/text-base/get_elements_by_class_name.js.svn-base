// A self optimising getElementsByClassName function as described in 'Self-optimizing functions'
document.getElementsByClassName = function(className, context) {
  var getEls;  
  if (typeof document.evaluate == 'function') {
    getEls = function(className, context) {
      var els = [];
      var xpath = document.evaluate(".//*[contains(concat(' ', @class, ' '), ' " + className + " ')]", 
                                  context, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);    
      for (var i = 0, l = xpath.snapshotLength; i < l; i++)
      els.push(xpath.snapshotItem(i));     
      return els;
    }
  } else {
    getEls = function(className, content) {
      var nodeList = context.getElementsByTagName('*');
      var re = new RegExp('(^|\\s)' + className + '(\\s|$)');    
      return Array.filter(nodeList, function(node) {  return node.className.match(re) });
    }
  }  
  
  document.getElementsByClassName = function(className, context) {
    context = context || document;
    return getEls(className, context);
  }  
  
  return document.getElementsByClassName(className, context);
}
