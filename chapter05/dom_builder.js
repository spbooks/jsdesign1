// DOMBuilder for prototype adapted from Low Pro http://svn.danwebb.net/external/lowpro/
// as discussed in 'Better APIs through Dynamic Functions'
DOMBuilder = {
  IE_TRANSLATIONS : {
    'class' : 'className',
    'for' : 'htmlFor'
  },
  cache: {},
  ieAttrSet : function(attrs, attr, el) {
    var trans;
    if (trans = this.IE_TRANSLATIONS[attr]) el[trans] = attrs[attr];
    else if (attr == 'style') el.style.cssText = attrs[attr];
    else if (attr.match(/^on/)) el[attr] = new Function(attrs[attr]);
    else el.setAttribute(attr, attrs[attr]);
  },
  getElement : function(tag) {
    var element = DOMBuilder.cache[tag];
    if (element == null) 
      element = DOMBuilder.cache[tag] = document.createElement(tag);
    return element.cloneNode(false);
  },
	tagFunc : function(tag) {
	  return function() {
	    var attrs, children; 
	    if (arguments.length>0) { 
	      if (arguments[0].nodeName || 
	        typeof arguments[0] == "string") 
	        children = arguments; 
	      else { 
	        attrs = arguments[0]; 
	        children = Array.prototype.slice.call(arguments, 1); 
	      };
	    }
	    return DOMBuilder.create(tag, attrs, children);
	  };
  },
	create : function(tag, attrs, children) {
		attrs = attrs || {}; children = children || []; tag = tag.toLowerCase();
		var isIE = navigator.userAgent.match(/MSIE/);
		var el = (isIE && attrs.name) ? 
		  document.createElement("<" + tag + " name=" + attrs.name + ">") : 
		  DOMBuilder.getElement(tag);
		
		for (var attr in attrs) {
		  if (attrs[attr] === true) attrs[attr] = attr;
		  if (typeof attrs[attr] != 'function') {
		    if (isIE) this.ieAttrSet(attrs, attr, el);
		    else el.setAttribute(attr, attrs[attr].toString());
		  } else if (attr.match(/^on(.+)$/)) {
		    Event.observe(el, RegExp.$1, attrs[attr]);
		  };
	  }
	  
		for (var i=0; i<children.length; i++) {
			if (typeof children[i] == 'string') 
			  children[i] = document.createTextNode(children[i]);
			el.appendChild(children[i]);
		}
		return $(el);
	}
};

// Automatically create node builders as $tagName.
(function() { 
	var els = ("p|div|span|strong|em|img|table|tr|td|th|thead|tbody|tfoot|pre|code|" + 
				     "h1|h2|h3|h4|h5|h6|ul|ol|li|form|input|textarea|legend|fieldset|" + 
				     "select|option|blockquote|cite|br|hr|dd|dl|dt|address|a|button|abbr|acronym|" +
				     "script|link|style|bdo|ins|del|object|param|col|colgroup|optgroup|caption|" + 
				     "label|dfn|kbd|samp|var").split("|");
  var el, i=0;
	while (el = els[i++]) 
	  window['$' + el] = DOMBuilder.tagFunc(el);
})();
