loadcss('CSS/allcssfiles.css');

function settheme1() {
  var theme   = document.getElementById('bgr').value;
//alert(theme);
  document.getElementById('t1').className = theme + '-t1';
  document.getElementById('i1').className = theme + '-i1';
//alert(document.getElementById('t0'));
  document.getElementById('t0').className = theme + '-t0';
  document.getElementById('timetable1').className += ' ' + theme + '-t1';
  document.getElementById('table-info').className += ' ' + theme + '-i1';
  document.getElementById('ps').className += ' ' + theme + '-ps';
  document.getElementById('pt').className += ' ' + theme + '-pt';
  document.getElementById('pm').className += ' ' + theme + '-pm';
  document.getElementById('pb').className += ' ' + theme + '-pb';
  document.getElementById('pf').className += ' ' + theme + '-pf';
  document.getElementById('pi').className += ' ' + theme + '-pi';
  document.getElementById('footer').className += ' ' + theme + '-footer';
}

function saction(){
  var method = document.setmethod.method1.value;
  var lang = document.showcity.language.value;
  langToggle(lang);
//alert(method);

  if(method == 'lsw') {
      langToggle();
	document.setmethod.method1.value = document.defaults.methodbck.value;
  } else if(method == 'map'){
	initCity(5); // will call mapcity to timezone and draw a map
	document.setmethod.method1.value = document.defaults.methodbck.value;
  } else if(method == 3) {
      window.location.href = '#3'; // Note: this may not work
  } else {
	document.defaults.methodbck.value = document.setmethod.method1.value;
	initCity(); // will call mapcity, timezone and compute in geo-block
  }
  return false;

/* n/a
//--------------------------------
// n/a
  } else if(method == 'reset' || method == '---' ) {
 	document.showcity.language.value 	= defaults[0];	
 	document.showcity.address.value 	= defaults[2];	
 	document.setmethod.method1.value 	= defaults[1];
// n/a
  } else if(method == 'info') {
//      pt.location.href = 'info.html';
//--------------------------------
*/	
}

function compute(){
// Function called from geo-block
    var ps = this;
    var method = document.setmethod.method1.value;
    setPrayertimesCookies();
    setmethod(method, ps);

var language = document.showcity.language.value;
    if (language == 'sve') str = 'Hent tabel';
else if(language == 'eng') str = 'Hent tabel';
document.getElementById('mbutton').value = str;

document.getElementById('map_canvas').innerHTML = 
'<img alt="" src="star0.png" style="border: 0px solid ; width: 100px; height: 100px; margin-top: 10px;">';
document.getElementById('map_canvas').style.height = '1px';


document.getElementById('prayertimetable').style.height = '140px';
    viewDay(this.window,this.window);
    return false;
}

function hilatspecial(pss) {
  var ps = this;
  if(pss)ps = pss;
  var hilats = ps.document.getElementById('hilat1').value; 
// Ignore previously stored value of hilat0
  var hilat0; // taqdir for fajr
  var hilat1; // taqdir for isha
         if(hilats == 0){ hilat0 = 0; hilat1 = 0; // No taqdir
  } else if(hilats == 1){ hilat0 = 2; hilat1 = 0; // midnight for Fajr
  } else if(hilats == 2){ hilat0 = 2; hilat1 = 2; // midnight for Fajr and Isha 
  } else if(hilats <  0){ hilat0 = 2; hilat1 = hilats; // Isha = add minutes or different angle
  } else { 
	hilat0 = hilats; 
	hilat1 = hilats; // same taqdir algorithm for fajr and isha
  } 
  ps.document.getElementById('hilat0').value = hilat0;
  ps.document.getElementById('hilat1').value = hilat1;
  ps.document.getElementById('hilat2').value = 0;
  ps.document.getElementById('hilat3').value = 0;

// alert(new Array(ps.document.getElementById('hilat0').value, ps.document.getElementById('hilat1').value));

return;
}

function langToggle(langin){
var lang; // Language to set
// Determine which language to switch to
   if(langin) {
   	lang = langin;
   } else {
	var langval = document.showcity.language.value;
	if(langval == 'sve')lang = 'eng';
	if(langval == 'eng')lang = 'sve';
   }
   if(lang == 'eng') {
// Set to English
  	document.setmethod.method1.options[5].text = 'Svenska';
  	document.setmethod.method1.options[6].text = 'Display map';
  	document.showcity.language.value = 'eng';
       document.getElementById('mbutton').value = 'Hent tabel';
   } else { 
// Set to Swedish
  	document.setmethod.method1.options[5].text = 'English';
  	document.setmethod.method1.options[6].text = 'Visa karta';
  	document.showcity.language.value = 'sve';
       document.getElementById('mbutton').value = 'Hent tabel';
  }
return false;
}

function computemonth(){
//var cm = 'classic/classic_monthly.html';
  var cm = document.getElementById('containerm').value;
//  alert(cm);
  var a_window = window.open(cm, 'awindow', 'width=620, scrollbars=1,resizable=1,location=1');
  a_window.focus();
return false;
}

