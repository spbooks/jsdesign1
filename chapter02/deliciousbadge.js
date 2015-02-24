/*
	A fully client-side dynamic del.icio.us badge
	written by Christian Heilmann for "The Art and Science of JavaScript"
*/
deliciousbadge = function(){
	
	/* configuration */
	
	// link and output list IDs
	var badgeid = 'delicious';
	var outputid = 'deliciouslist';
	// message to add to the link whilst loading
	var loadingMessage = ' (loading...)';
	// amount of links
	var	amount = 15;
	// timeout in milliseconds
	var timeoutdelay = 1000;

	// stores the link that was clicked
	var o = null;

	/* public methods */

	return {

		// addEvent by Scott Andrew LePera 
		// http://www.scottandrew.com/weblog/articles/cbs-events 
		addEvent:function(elm,evType,fn,useCapture){
			if(elm.addEventListener){
				elm.addEventListener(evType, fn, useCapture);
				return true;
			} else if (elm.attachEvent) {
				var r = elm.attachEvent('on' + evType, fn);
				return r;
			} else {
				elm['on' + evType] = fn;
			}
		},

		// init - checks for DOM and element support
		init:function(){
			if(document.getElementById && document.createTextNode){
				o = document.getElementById(badgeid);
				if(o && o.href){
					deliciousbadge.addEvent(o, 'click', callData, false);
				}
			}
		},

		// retrieveData - stops timeout and sends the JSON dataset 
		retrieveData:function(dataset){
			window.clearTimeout(deliciousbadge.to);
			displayData(dataset);	
		},

		// failure - follows the link if there was a 404
		failure:function(){
			window.clearTimeout(deliciousbadge.to);
			window.location = o.getAttribute('href');
		}
	};

	/* private methods */

	// callData - assembles the JSON call and initiates the timeout
	function callData(e){
  	if(!document.getElementById(outputid)){
			deliciousbadge.to = window.setTimeout('deliciousbadge.failure()',timeoutdelay)
			var user = o.href.replace(/.*\//g,'');
			var msg = document.createElement('span');
			msg.appendChild(document.createTextNode(loadingMessage));
			o.appendChild(msg);
	   	var seeder = document.createElement('script');
	   	var srcurl = 'http://del.icio.us/feeds/json/' + 
	   	             user + '?count=' + amount + 
	   	             '&callback=deliciousbadge.retrieveData';
	   	seeder.setAttribute('src', srcurl);
			document.getElementsByTagName('head')[0].appendChild(seeder);
			cancelClick(e);
 		} 
 	};

	// displayData - assembles the list of links from the JSON dataset
	function displayData(dataset){
		var output = document.createElement('ul');
		output.id = outputid;
		for(var i=0;dataset[i];i++){
			var entry = document.createElement('li');
			var entryLink = document.createElement('a');
			entryLink.appendChild(document.createTextNode(dataset[i].d));				
			entryLink.setAttribute('href',dataset[i].u);				
			entry.appendChild(entryLink);
			output.appendChild(entry);
		}
		o.parentNode.insertBefore(output,o.nextSibling);
		o.removeChild(o.lastChild);
		output.getElementsByTagName('a')[0].focus();
	};

	// cancelClick - prevents the link from being followed
	function cancelClick(e){
		if (window.event){
			window.event.cancelBubble = true;
			window.event.returnValue = false;
			return;
		}
		if (e){
			e.stopPropagation();
			e.preventDefault();
		}
	};
}();

/* initiate when the window has finished loading */
deliciousbadge.addEvent(window, 'load', deliciousbadge.init, false);