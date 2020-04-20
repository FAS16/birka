function loadcss(cssfilename, title, ps){
  var fileref = document.createElement("link");
  fileref.setAttribute("rel", "stylesheet");
  fileref.setAttribute("type", "text/css");
  fileref.setAttribute("href", cssfilename);
  fileref.setAttribute("title", title);
  if(ps) {
     ps.document.getElementsByTagName('head')[0].appendChild(fileref);
  } else {
     document.getElementsByTagName('head')[0].appendChild(fileref);
  }
return fileref;
}

function loadjs(jsfilename, ps){
  var fileref = document.createElement("script");
  fileref.setAttribute("type","text/javascript");
  fileref.setAttribute("src", jsfilename);
  if(ps) {
     ps.document.getElementsByTagName('head')[0].appendChild(fileref);
  } else {
     document.getElementsByTagName('head')[0].appendChild(fileref);
  }
// <script type="text/javascript" src="../../js/styleswitcher.js"></script>
// alert(jsfilename);
return fileref;
}


function setActiveStyleSheet0(title,ps) {
  var i, a, main;
  var pss = document;
  if(ps) pss = ps.document;
  for(i=0; (a = pss.getElementsByTagName("link")[i]); i++) {
    if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
      a.disabled = true;
      if(a.getAttribute("title") == title) { a.disabled = false; }
    }
  }
}

function setActiveStyleSheet(title,ps) {
  var i, a, main;
  var pss = document;
  if(ps) pss = ps.document;
  for(i=0; (a = pss.getElementsByTagName("link")[i]); i++) {
    if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
      if(a.getAttribute("title") == title) {
        a.disabled = false;
      } else {  
        a.disabled = true;
      }
    }
  }
}

function getActiveStyleSheet(ps) {
  var i, a;
  var pss = document;
  if(ps) pss = ps.document;
  for(i=0; (a = pss.getElementsByTagName("link")[i]); i++) {
    if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title") && !a.disabled) return a.getAttribute("title");
  }
  return null;
}


function getPreferredStyleSheet(ps) {
  var i, a;
  var pss = document;
  if(ps) pss = ps.document;
  for(i=0; (a = pss.getElementsByTagName("link")[i]); i++) {
    if(a.getAttribute("rel").indexOf("style") != -1
       && a.getAttribute("rel").indexOf("alt") == -1
       && a.getAttribute("title")
       ) return a.getAttribute("title");
  }
  return null;
}


// Opacity animantion:
// http://www.akxl.net/labs/articles/use-javascript-to-change-or-fade-opacity-or-transparency-of-html-entities/

function FadeOpacity(elemId, fromOpacity, toOpacity, time, fps) {
  var steps = Math.ceil(fps * (time / 1000));
  var delta = (toOpacity - fromOpacity) / steps;
     
  FadeOpacityStep(elemId, 0, steps, fromOpacity, delta, (time / steps));
}
 
function FadeOpacityStep(elemId, stepNum, steps, fromOpacity, delta, timePerStep) {
  SetOpacity(document.getElementById(elemId), Math.round(parseInt(fromOpacity) + (delta * stepNum))); 
  if (stepNum < steps)
    setTimeout("FadeOpacityStep('" + elemId + "', " + (stepNum+1) + ", " + steps + ", " + fromOpacity + ", " + delta + ", " + timePerStep + ");", timePerStep);
 }

function SetOpacity(elem, opacityAsInt) {
  var opacityAsDecimal = opacityAsInt;
  if (opacityAsInt > 100)
    opacityAsInt = opacityAsDecimal = 100; 
  else if (opacityAsInt < 0)
    opacityAsInt = opacityAsDecimal = 0; 
  opacityAsDecimal /= 100;
  if (opacityAsInt < 1)
    opacityAsInt = 1; // IE7 bug, text smoothing cuts out if 0
  elem.style.filter  = "alpha(opacity=" + opacityAsInt + ")";
  elem.style.opacity = (opacityAsDecimal);
}


function createCookie(name,value,days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  }
  else expires = "";
  document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

window.onload = function(e) {
  var cookie = readCookie("style");
  var title = cookie ? cookie : getPreferredStyleSheet();
  setActiveStyleSheet(title);
}

window.onunload = function(e) {
  var title = getActiveStyleSheet();
  createCookie("style", title, 365);
}

var cookie = readCookie("style");
var title = cookie ? cookie : getPreferredStyleSheet();
setActiveStyleSheet(title);
