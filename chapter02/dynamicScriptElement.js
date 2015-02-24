/*
	Retrieving JSON information with a dynamically created SCRIPT element
	written by Christian Heilmann for "The Art and Science of JavaScript"
*/
deliciousCall = {
	init:function(){
		var url = 'http://del.icio.us/feeds/json/codepo8/' + 
		'?callback=deliciousCall.show';
		var s = document.createElement('script');
		s.setAttribute('src',url);
		document.getElementsByTagName('head')[0].appendChild(s);
	},
	show:function(o){
		var out = '<ul>';
		for(var i=0;o[i];i++){
			out += '<li><a href="' + o[i].u + '">' + 
			o[i].d + '</a></li>';
		}
		out += '</ul>';
		document.getElementById('bookmarks').innerHTML = out;
	}
}
deliciousCall.init();
