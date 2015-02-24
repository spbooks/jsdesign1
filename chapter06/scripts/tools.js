


//utilities object constructor
function Tools()
{

}



//create element and attributes method -- http://www.codingforums.com/showthread.php?s=&postid=151108
Tools.prototype.createElement = function(tag, attrs)
{
	//detect support for namespaced element creation, in case we're in the XML DOM
	var ele = (typeof document.createElementNS != 'undefined') ? document.createElementNS('http://www.w3.org/1999/xhtml',tag) : document.createElement(tag);

	//run through attributes argument
	if(typeof attrs != 'undefined')
	{
		for(var i in attrs)
		{
			switch(i)
			{
				//create a text node
				case 'text' :
					ele.appendChild(document.createTextNode(attrs[i]));
					break;

				//create a class name
				case 'class' :
					ele.className = attrs[i];
					break;

				//create a generic attribute using IE-safe attribute creation
				default :
					ele.setAttribute(i,'');
					ele[i] = attrs[i];
					break;
			}
		}
	}
	return ele;
};


