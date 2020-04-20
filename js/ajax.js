

function appendLink(divid,url,targeting,linktext) {
var mydiv = document.getElementById(divid);
var mylink = document.createElement('a');
mylink.setAttribute('href', url);
mylink.setAttribute('target', targeting);
mylink.innerHTML = linktext;
mydiv.appendChild(mylink);
return mydiv;
}

function addIHTML(divid,text) {
var mydiv = document.getElementById(divid);
mydiv.innerHTML += text;
}

/*
// IE has problems with this function
alert('hej');
function appendText(divid,text,class,style) {
var mydiv = document.getElementById(divid);
var mypara = document.createTextnode('p');
var mytext = document.createTextnode(text);
mypara.setAttribute('class', class);
mypara.setAttribute('style', style);
mypara.appendChild(mytext);
mydiv.appendChild(mypara);
return mydiv;
}
*/

function writeText(divid,text) {
var mydiv = document.getElementById(divid);
mydiv.document.write(mytext);
}

function removeLink(divid,objectref) {
var mydiv = document.getElementById(divid);
var myobj = objectref;
mydiv.removeChild(myobj);
}


//Ref: http://www.dynamicdrive.com/dynamicindex17/ajaxcontent.htm
/***********************************************
* Dynamic Ajax Content- © Dynamic Drive DHTML code library (www.dynamicdrive.com)
* This notice MUST stay intact for legal use
* Visit Dynamic Drive at http://www.dynamicdrive.com/ for full source code
***********************************************/

var bustcachevar = 1; 
//bust potential caching of external pages after initial request? (1=yes, 0=no)
var loadedobjects="";
var rootdomain="http://" + window.location.hostname;
var bustcacheparameter="";

function ajaxpage(url, containerid){
  var page_request = false;
  if(window.XMLHttpRequest) { 
//  Mozilla, Safari etc
    page_request = new XMLHttpRequest()
  } else if (window.ActiveXObject){ 
//  IE
    try {
      page_request = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e){
      try{
        page_request = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e){
      }
    }
  } else {
    return false;
  }
  page_request.onreadystatechange = function(){
    loadpage(page_request, containerid);
  }
  if(bustcachevar) { 
//  bust caching of external page
    bustcacheparameter = (url.indexOf("?") != -1)? "&"+new Date().getTime() : "?"+new Date().getTime();
  }
  page_request.open('GET', url + bustcacheparameter, true);
  page_request.send(null);
  return false;
}


function loadpage(page_request, containerid){
  if (page_request.readyState == 4 && (page_request.status == 200 || window.location.href.indexOf("http") == -1));
  document.getElementById(containerid).innerHTML = page_request.responseText;
}

function loadobjs(){
  if (!document.getElementById) return;
  for (i=0; i<arguments.length; i++){
    var file = arguments[i]
    var fileref=""
    if (loadedobjects.indexOf(file) == -1){ 
//  Check to see if this object has not already been added to page before proceeding
      if (file.indexOf(".js") != -1){ 
//      object is a js file
        fileref=document.createElement('script');
        fileref.setAttribute("type","text/javascript");
        fileref.setAttribute("src", file);
      } else if (file.indexOf(".css") != -1){ 
//      object is a css file
        fileref=document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", file);
      }
    }
    if (fileref!=""){
      document.getElementsByTagName("head").item(0).appendChild(fileref);
      loadedobjects += file + " ";
//    Remember this object as being already added to page
    }
  }
}
