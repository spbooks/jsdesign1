/*
	Retrieving JSON information with a dynamically created SCRIPT element
	and providing a timeout as a fallback measure
	written by Christian Heilmann for "The Art and Science of JavaScript"
*/
deliciousCall = {
  failed:false,
  init:function(){
    var url = 'http://del.icio.us/feeds/json/codepo8/' + 
              '?callback=deliciousCall.show';
    var s = document.createElement('script');
    s.setAttribute('src',url);
    document.getElementsByTagName('head')[0].appendChild(s);
    this.to = window.setTimeout('deliciousCall.failure()',1000);
  },
  show:function(o){
    if(this.failed === false){
      window.clearTimeout(this.to);
      var out = '<ul>';
      for(var i=0;o[i];i++){
        out += '<li><a href="' + o[i].u + '">' + 
               o[i].d + '</a></li>';
      }
      out += '</ul>';
      document.getElementById('bookmarks').innerHTML = out;
    }
  },
  failure:function(){
    window.clearTimeout(this.to);
    this.failed = true;
    document.getElementById('bookmarks').innerHTML = 'Connection Error';
  }
}
deliciousCall.init();
