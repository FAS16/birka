
function getPrayertimesCookies() { 
  var lang = getCookie('language');
  var adr = getCookie('address');
  var met = getCookie('method');
  var tiz = getCookie('timezone');
/*
  var lng = getCookie('longitude');
  var lat = getCookie('latitude');
*/
  var lng;
  var lat;
//alert(Array('getting cookies: ',adr,lat,lng,met,tiz,lang));
try {
  var qmeth = getQueryVariable('meth');
  var qlang = getQueryVariable('lang');
  var qcity = getQueryVariable('city');
  var qlat = getQueryVariable('lat');
  var qlng = getQueryVariable('lng');
  var qtz = getQueryVariable('tz');
  if(qmeth)met = qmeth;
  if(qlang)lang = qlang;
  if(qcity)adr = qcity;
  if(qtz)tiz = qtz;
} catch(err) {
  alert('Unable to process query - ' + err);
}
  if(lang)if( lang != '')document.getElementById('language').value = lang;
  if(adr)if( adr != '')document.getElementById('address').value = adr;
  if(met)if( met != '')document.getElementById('method1').value = met;
  if(tiz)if( tiz != '')document.getElementById('tz').value = tiz;
  document.getElementById('lng').value = lng;
  document.getElementById('lat').value = lat;

//alert(Array('got cookies: ',adr,lat,lng,met,tiz,lang,document.getElementById('method1').value));

return;
}

function setPrayertimesCookies() { 
  var lang = window.document.getElementById('language').value;
  var adr = window.document.getElementById('address').value;
  var lat = window.document.getElementById('lat').value;
  var lng = window.document.getElementById('lng').value;
  var met = window.document.getElementById('method1').value
  var tiz = window.document.getElementById('tz').value
//alert(Array('setting cookies: ',adr,lat,lng,met,tiz,lang));
  setCookie('language',lang,365);
  setCookie('address',adr,365);
  setCookie('longitude',lng,365);
  setCookie('latitude',lat,365);
  setCookie('method',met,365);
  setCookie('timezone',tiz,365);
/**/
return;
}

//==========================================


function setCookie(c_name,value,expiredays)
{
var exdate=new Date();
exdate.setDate(exdate.getDate()+expiredays);
document.cookie=c_name+ "=" +escape(value)+
((expiredays==null) ? "" : ";expires="+exdate.toUTCString());
}

function getCookie(c_name)
{
if (document.cookie.length>0)
  {
  c_start=document.cookie.indexOf(c_name + "=");
  if (c_start!=-1)
    {
    c_start=c_start + c_name.length+1;
    c_end=document.cookie.indexOf(";",c_start);
    if (c_end==-1) c_end=document.cookie.length;
    return unescape(document.cookie.substring(c_start,c_end));
    }
  }
return "";
}


