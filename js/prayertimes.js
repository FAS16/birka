
// alert('hej');

// Ref: http://tanzil.info/praytime/doc/manual/
// GLOBAL VARIABLES
var currentDate = new Date();
var timeFormat = 0;
switchFormat(0);

//============================================================================

function settz(pss) {
  var ps = this.window;
  var tz = 'auto';
  var tzid = 'n/a';
  if(pss)ps = pss;
  if(ps.document.showcity.tz) {
    if(ps.document.showcity.tz.value){ 
      tzid = ps.document.showcity.tzid.value;
      tz   = ps.document.showcity.tz.value.replace('GMT','');
	if(isNaN(tz)){
	  tz = 'auto';
	  tzid = '';
   	  ps.document.showcity.tz.value = 'Timezone';
   	  ps.document.showcity.tzid.value = '';
	} 
    }  
  }
  return new Array(tz,tzid);
}

function setmethod(method,selectformlocation) {
var ps = this.window;
if(selectformlocation)ps = selectformlocation;

// Defaults
var method_name = 'none';
var angles = Array(18, -1, -1, 18, null);
var adjusts = Array(0,  0, 5, 0,  0, 0);
var asr1 = 1;
var asr2 = null;
var cut0 = 0.05; // default critical values
var cut1 = 0.5; 
var hilat = new Array (0,1,cut0,cut1,null,null);
// Hilat: 
// 0,1 = method of taqdir
// 2,3 = when to start taqdir
// 4,5 = smoothing paraemter 
//	>0 = noodays, 
//	<0 = combine, 
//	0 or null = no smoothing

// Birka settings
if(method == 11){
  method_name = 'Birka - Shafi`i/Maliki';
  angles = Array(18, -1, -1, 18, null);
  adjusts = Array(0,  0, 5, 0,  0, 0);
  asr1 = 1;
  asr2 = null;
  hilat = Array(2,2,0,0,null,null);  
} 
else if(method == 14){
  method_name = 'Birka - Maliki';
// not in use
} 
else if(method == 13){
  method_name = 'Birka - Hanbali';
  angles = Array(18, -1, -1, 18, null);
  adjusts = Array(0,  0, 5, 0,  0, 0);
  asr1 = 1;
  asr2 = null;
  hilat = Array(2,-90,cut0,cut1,null,null);  
} 
else if(method == 12){
  method_name = 'Hanafi';
  angles = Array(18, -1, -1, 18, 15);
  adjusts = Array(0, 0, 5, 0,  0, 0);
  asr1 = 2;
  asr2 = 1;
  hilat = Array(2,0,0,0,null,6);  
} 
else if(method == 15){
  method_name = 'Masjid - 90min';
  angles = Array(18, -1, -1, 18, null);
  adjusts = Array(0,  0, 5, 0,  0, 0);
  asr1 = 2;
  asr2 = null;
  hilat = Array(2,-90,cut0,cut1,null,null);  
} 
else if(method == 16){
  method_name = 'Masjid-test';
  angles = Array(18, -1, -1, 15, 18);
  adjusts = Array(0,  0, 10, 0,  8, 0);
  asr1 = 2;
  asr2 = null;
  hilat = Array(2,7,cut0,1,null,-6);  
} 
else if(method == 30){
  method_name = 'Birka - Shafi`i/Maliki-A';
  angles = Array(18, -1, -1, 18, null);
  adjusts = Array(0,  0, 5, 0,  0, 0);
  asr1 = 1;
  asr2 = null;
  hilat = Array(10,10,cut0,cut0,null,null);  
} 
else if(method == 31){
  method_name = 'Birka - Shafi`i/Maliki-B';
  angles = Array(18, -1, -1, 18, null);
  adjusts = Array(0,  0, 5, 0,  0, 0);
  asr1 = 1;
  asr2 = null;
  hilat = Array(12,12,0,0,null,null);  
} 
else if(method == 34){
  method_name = 'Birka - Shafi`i/Maliki';
  angles = Array(18, -1, -1, 18, null);
  adjusts = Array(0,  0, 5, 0,  0, 0);
  asr1 = 1;
  asr2 = null;
  hilat = Array(2,2,0,0,null,null);  
} 
else if(method == 32){
  method_name = 'Hanafi-A';
  angles = Array(18, -1, -1, 18, 15);
  adjusts = Array(0, 0, 5, 0,  0, 0);
  asr1 = 2;
  asr2 = 1;
  hilat = Array(10,10,0,cut0,null,null);  
} 
else if(method == 33){
  method_name = 'Birka - Hanafi-1/7';
  angles = Array(18, -1, -1, 18, 15);
  adjusts = Array(0, 0, 5, 0,  0, 0);
  asr1 = 2;
  asr2 = 1;
  hilat = Array(2,7,0,cut0,null,null);  
} 
else if(method == 36){
  method_name = 'Masjid-1/7';
  angles = Array(18, -1, -1, 18, null);
  adjusts = Array(0,  0, 5, 0,  5, 0);
  asr1 = 2;
  asr2 = null;
  hilat = Array(2,7,0,cut0,0,0);  
} 
else if(method == 35){
  method_name = 'Masjid-A';
  angles = Array(18, -1, -1, 15, 18);
  adjusts = Array(0,  0, 5, 0,  5, 0);
  asr1 = 2;
  asr2 = null;
  hilat = Array(10,10,cut0,cut1,null,null);  
} 
// Alghazali settings
if(method == 21){
  method_name = 'Al-Ghazali - Shafi`i/Maliki';
  angles = Array(18, -1, -1, 18, null);
  adjusts = Array(0,  0, 5, 5,  7, 0);
  asr1 = 1;
  asr2 = null;
  hilat = Array(2,2,0,0,null,null);  
} 
else if(method == 22){
  method_name = 'Al-Ghazali - Hanafi';
  angles = Array(18, -1, -1, 18);
  adjusts = Array(0, 0, 5, 5,  7, 0);
  asr1 = 2;
  asr2 = null;
  hilat = Array(2,-15,0,0,null,null);  
} 

// Other methods
else if(method == 1){
  method_name = 'Cairo - Uthmani';
  angles = Array(19.5, 0.833, 0.833, 17.5, null);
  adjusts = Array(0,  0, 0, 0,  0, 0);
  asr1 = 1;
  asr2 = null;
  hilat = Array(2,0,0,cut0,null,null);  
}
else if(method == 2){
// Mekka true, None
  method_name = 'Makka - Umm al-Qura University';
  angles = Array(19, 0.833, 0.833, 0, null);
  adjusts = Array(0,  0, 0, 0,  0, 90);
  asr1 = 1;
  asr2 = null;
  hilat = Array(2,0,cut0,cut1,null,null);  
}
else if(method == 3){
  method_name = 'Special';
  angles = Array(
ps.document.special.angle1.value, 
ps.document.special.sunadj1.value, 
ps.document.special.sunadj2.value, 
ps.document.special.angle2.value,
null);

  adjusts = Array(
ps.document.special.add0.value, 
ps.document.special.add1.value,
ps.document.special.add2.value,
ps.document.special.add3.value,
ps.document.special.add4.value,
ps.document.special.add5.value);

  hilat  = Array(
ps.document.special.hilat0.value, 
ps.document.special.hilat1.value,
ps.document.special.hilat2.value,
ps.document.special.hilat3.value,
ps.document.special.hilat4.value,
ps.document.special.hilat5.value);

asr1   = ps.document.special.asr1.value;
asr2   = null;

}
else if(method == 4){
  method_name = 'Karachi - Hanafi';
  angles = Array(18, 0.833, 0.833, 18, null);
  adjusts = Array(0,  -5, 5, 5,  5,  0);
  asr1 = 2;
  asr2 = null;
  hilat = Array(2,0,cut0,cut0,null,null);  
}
else if(method == 5){
  method_name = 'Istanbul - Uthmani';
  angles = Array(20, 1.733, 1.733, 18, null);
  adjusts = Array(0, -2, 5, 5,  7,  0);
  asr1 = 1;
  asr2 = null;
  hilat = Array(2,0,cut0,0,null,null);  
}
else if(method == 6){
  method_name = 'MWL (Muslim World League-Rabita)/ICOP 2009';
  angles = Array(18, 0.833, 0.833, 18, null);
  adjusts = Array(0, -5, 0, 0,  5,  0);
  asr1 = 1;
  asr2 = null;
  hilat = Array(5.5,5.5,0.75,0.75,9,9);  
}
else if(method == 17){
  method_name = 'MWL (Muslim World League-Rabita) 2003/2007';
  angles = Array(18, 0.833, 0.833, 17, null);
  adjusts = Array(-2, -2, 2, 2,  2,  2);
  asr1 = 1;
  asr2 = null;
  hilat = Array(13,13,0.75,0.75,null,null);  
}
else if(method == 7){
  method_name = 'true ISNA';
// ISNA
  angles = Array(18, 0.833, 0.833, 18, null);
  adjusts = Array(0,  0, 1, 0,  1,  0);
  asr1 = 1;
  asr2 = null;
  hilat = Array(12,12,cut0,cut0,null,null);  
}
else if(method == 8){
  method_name = 'MWL - emulating IslamicFinder'; 
  angles = Array(18, 0.833, 0.833, 17, null);
  adjusts = Array(0,  0, 1, 0,  1,  0);
  asr1 = 1;
  asr2 = null;
  hilat = Array(9,9,0,0,null,null);  
}
else if(method == 9){
  method_name = 'ISNA - emulating IslamicFinder';
  angles = Array(15, 0.833, 0.833, 15, null);
  adjusts = Array(0,  0, 1, 0,  1,  0);
  asr1 = 1;
  asr2 = null;
  hilat = Array(9,9,0,0,null,null);  
}
else if(method == 10){
// Blackburn
  method_name = 'Blackburn - experimental';
  angles = Array(14.5, -1, -1, 13.5, null);
  adjusts = Array(0, 0, 5, 0,  0, 0);
  asr1 = 1;
  asr2 = null;
  hilat = Array(9,9,0,0,null,null);  
}

// Compute Refraction(latitude) for shuruq and maghrib, insert into to angles
var lat = ps.document.showcity.lat.value;
var sun = 0.267-0.59*Math.log(1-lat/78);
if(angles[1] == -1) angles[1] = Math.floor(sun*100)/100;
if(angles[2] == -1) angles[2] = Math.floor(sun*100)/100;

// Store data in prayertime-select
ps.document.special.angle1.value = angles[0];  // fajr
ps.document.special.sunadj1.value = angles[1]; // shuruq
ps.document.special.sunadj2.value = angles[2]; // maghrib
ps.document.special.angle2.value = angles[3];  // isha1 
ps.document.special.angle3.value = angles[4];  // isha2
ps.document.special.asr1.value = asr1;
ps.document.special.asr2.value = asr2;

ps.document.special.hilat0.value = hilat[0];
ps.document.special.hilat1.value = hilat[1];
ps.document.special.hilat2.value  = 0;
ps.document.special.hilat3.value  = 0;

ps.document.special.hilat2.value  = hilat[2];
ps.document.special.hilat3.value  = hilat[3];

// Smoothing disabled
ps.document.special.hilat4.value  = null;
ps.document.special.hilat5.value  = null;
/*
ps.document.special.hilat4.value  = hilat[4];
ps.document.special.hilat5.value  = hilat[5];
*/

ps.document.special.add0.value = adjusts[0];
ps.document.special.add1.value = adjusts[1];
ps.document.special.add2.value = adjusts[2];
ps.document.special.add3.value = adjusts[3];
ps.document.special.add4.value = adjusts[4];
ps.document.special.add5.value = adjusts[5];

// Pass on data to prayTime
prayTime.setAddMinutes(adjusts); // MÅSKE er det her det går galt
prayTime.setAngles(angles);
prayTime.setAsrMethod(asr1,asr2);
prayTime.setHighLatsMethod(hilat);

//alert('method set');

  return method_name;
}

function iftoday(ifmet) {
  var thisform = parent.prayerselect.document.showcity;
  var address = thisform.address.value;
  var shortaddress = address.substring(0,12);
  var lat = thisform.lat.value;
  var lng = thisform.lng.value;

 //   if(method == 8) ifmet = 1; //IslamicFinder-MWL
 //   if(method == 9) ifmet = 5; //IslamicFinder-ISNA

islamicfinder  = 'http://www.islamicfinder.org/prayer_service.php?';
islamicfinder += 'country=sweden&city=' + shortaddress + '&state=&zipcode=';
islamicfinder += '&latitude=' + lat + '&longitude='  + lng + '&timezone=2';
islamicfinder += '&HanfiShafi=1&pmethod=' + ifmet;
islamicfinder += '&fajrTwilight1=0.0&fajrTwilight2=0.0&ishaTwilight=0.0';
islamicfinder += '&dhuhrInterval=1&maghribInterval=1&ishaInterval=0';
islamicfinder += 'dayLight=1';
islamicfinder += '&page_background=B8C7CE&table_background=EAEFF2';
islamicfinder += '&table_lines=AFC2CC&text_color=003366&link_color=003366';
islamicfinder += '&prayerFajr=&prayerSunrise=&prayerDhuhr=&prayerAsr=&prayerMaghrib=&prayerIsha=&lang=';

/*
islamicfinder='http://www.islamicfinder.org/prayer_service.php?country=sweden&city=stockholm&state=26&zipcode=&latitude=59.3333&longitude=18.0500&timezone=1&HanfiShafi=1&pmethod=1&fajrTwilight1=10&fajrTwilight2=10&ishaTwilight=10&ishaInterval=30&dhuhrInterval=1&maghribInterval=1&dayLight=1&page_background=&table_background=&table_lines=&text_color=&link_color=&prayerFajr=&prayerSunrise=&prayerDhuhr=&prayerAsr=&prayerMaghrib=&prayerIsha=&lang=';
*/

    var str = '';
//  str += '<html><head></head>';
//  str += '<body style="background-color: transparent;">';
str += '<iframe style="width: 175px; height: 225px;" src="';
str += islamicfinder;
str += '" marginwidth="0" marginheight="0" allowtransparency="true"';
str += 'frameborder="0" scrolling="no"> </iframe><br>';
//  str += '</body></html>';
return str;
}

//============================================================================

function viewDay(pss,ptt) {
// Called from html in window top.main.menu.prayertimetable
// Note: program change
//var ps     = parent.prayerselect;
var ps     = this.window;
if(pss)ps  = pss;
var pt     = this.window;
if(ptt)pt  = ptt;
//alert('hej');
//alert(ps.document.getElementById('method1'));
var method = ps.document.setmethod.method1.value;
var lat    = ps.document.showcity.lat.value;
var lng    = ps.document.showcity.lng.value;
var city   = ps.document.showcity.address.value;  
var lang   = ps.document.showcity.language.value;
var asr1   = ps.document.special.asr1.value;
var asr2   = ps.document.special.asr2.value;
var isha1  = ps.document.special.angle2.value;
var isha2  = ps.document.special.angle3.value;
var tz     = settz(ps)[0];
//alert(tz);

  var timeTags = timeTagsDayly(lang); 
  var method_name = setmethod(method, ps);

// Compose infostring
  var shortcity = city.substring(0,20);
  var shortlat = Math.floor(lat*10)/10;
  var shortlng = Math.floor(lng*10)/10;
  var shortmeth = '';
  shortmeth += method_name;
  shortmeth = shortmeth.substring(0,24);

  infostr = '';
  infostr +=  shortcity + '<br>';
  if (lang == 'eng') {
    infostr +=  'Coord: (' + shortlat + ', ' + shortlng + ')' + '<br>';
    infostr +=  datumIdag('eng') + '<br>';
  } else {
    infostr +=  'Koord: (' + shortlat + ', ' + shortlng + ')' + '<br>';
    infostr +=  datumIdag(lang) + '<br>';
  }
  infostr +=  shortmeth;

// Display infostring
  document.getElementById('table-info').innerHTML = infostr;

// Compute times
  var date = new Date(); // today
  var times = prayTime.getPrayerTimes(date, lat, lng, tz);

// Set display of times
  times = presentTimes(times,asr1,null,isha1,null);

// Display table for 1 day
  var table = document.getElementById('timetable1');
  var tbody = document.createElement('tbody');
  tbody.appendChild(makeTableRow(Array(timeTags[0], times[0] ), 'normal'));
  tbody.appendChild(makeTableRow(Array(timeTags[1], times[2] ), 'normal'));
  tbody.appendChild(makeTableRow(Array(timeTags[2], times[3] ), 'normal'));
  tbody.appendChild(makeTableRow(Array(timeTags[3], times[4] ), 'normal'));
  tbody.appendChild(makeTableRow(Array(timeTags[4], times[6] ), 'normal'));
  tbody.appendChild(makeTableRow(Array(timeTags[5], times[7] ), 'normal'));
  removeChildrenOfNode(table);
  table.appendChild(tbody);
}

function viewMonth(offset,pss) {
// Get vareiables from ps
  var ps = window.opener;
  if(pss)ps = pss;
  var lang   = ps.document.showcity.language.value;

// Set head row prayer time tags
  var timetags = timeTagsMonthly(lang);
  timetags = timeTagsMonthlyInfo(timetags,ps);
  
// Compose infostring
  var infos = getInfo(ps);

// Compose table
  makeTable(offset,infos,timetags,ps);
}

//=========================================================================

function getInfo(ps) {
  var infopath = 
 'http://privat.bahnhof.se/wb042294/Birka//prayertimes/prayertimes-references/'
  var pinfo = ps.document.paths;
  if(pinfo)infopath = pinfo.infopath.value;

// Get variables from ps
  var method = ps.document.setmethod.method1.value;
  var lat    = ps.document.showcity.lat.value;
  var lng    = ps.document.showcity.lng.value;
  var city   = ps.document.showcity.address.value;  
  var tz     = settz(ps)[0];
  var tzid   = settz(ps)[1];
  var fajr   = ps.document.special.angle1.value;
  var isha1  = ps.document.special.angle2.value;
  var adj1   = ps.document.special.sunadj1.value;
  var adj2   = ps.document.special.sunadj2.value;
  var hilat  = new Array(
	ps.document.special.hilat0.value,
	ps.document.special.hilat1.value,
	ps.document.special.hilat2.value,
	ps.document.special.hilat3.value);
  var lang   = ps.document.showcity.language.value;

  var method_name = setmethod(method, ps);

// Compose header info
   infospecial = '  ';


   if(hilat[0] != 0 || hilat[1] != 0 ){

     	var tlink = '<br><a href="prayertimes-references/prayertimes_method-info';
//   	if(lang != 'sve')
	tlink += '-eng';  // Link to English document
     	tlink += '.html#midnatt">';
     	if(lang == 'sve')    
          tlink += '<i>Taqdir</i> vid st�ndig skymning:</a><br>';
     	else tlink += '<i>Taqdir</i> at persistent twilight:</a><br>'

	var hlpfajr = 'Fajr: 1/' + hilat[0];
     	var hlpisha = ', Isha: 1/' + hilat[1];
     	var hlp     = ' of night from sunset to sunrise';
     	if(lang == 'sve')
          hlp     = ' av natt fr�n soluppg�ng till solnedg�ng';

/*
	var aqrablat = new Array;
	aqrablat[15] = '51th latitude';
	aqrablat[16] = '50th latitude';
	aqrablat[17] = '49th latitude';
	aqrablat[18] = '48th latitude';
	aqrablat[21] = '45th latitude';
	for(var iangle=15; iangle<=18; iangle++) {
	   if(fajr<=iangle)hlalatfajr = aqrablat[iangle];
	   if(isha1<=iangle)hlalatfajr = aqrablat[iangle];
	   if(isha2<=iangle)hlalatfajr = aqrablat[iangle];
	}
	if(hilat[0] == 13)hlalatfajr = aqrablat[21];
	if(hilat[1] == 13) { hlalatisha1 = aqrablat[21]; hlalatisha2 = aqrablat[21]; }
*/
     	var hla10   = ' Aqrab al-Bilad A';
     	var hla12   = ' Aqrab al-Bilad B'; 
     	var hla13   = ' Aqrab al-Bilad B based on 45th latitude'; 
     	var h9      = ' AngleBased - ';
     	var h9fajr  = 'Fajr: ' + fajr + '/60 '
     	var h9isha  = ', Isha: ' + isha1 + '/60';
     	var hadd    = ', Isha = Maghrib + ' + (-hilat[1]) + 'min';

	infospecial = tlink;


      if(hilat[0] >=1 && hilat[0] <=8) infospecial += hlpfajr;
      if(hilat[1] >=1 && hilat[1] <=8) infospecial += hlpisha;
	if(hilat[0] >=1 && hilat[0] <=8 || hilat[1] >=1 && hilat[1] <=8) infospecial += hlp;

      if(hilat[0] == 9 || hilat[1] == 9 ) infospecial += h9;
      if(hilat[0] == 9) infospecial += h9fajr;
      if(hilat[1] == 9) infospecial += h9isha;

	if(hilat[0] == hilat[1]) {
	if(hilat[0] == 10) infospecial += 'Fajr and Isha: ' + hla10;
	if(hilat[0] == 12) infospecial += 'Fajr and Isha: ' + hla12;
	if(hilat[0] == 13) infospecial += 'Fajr and Isha: ' + hla13;
	} else {
	if(hilat[0] == 10) infospecial += 'Fajr: ' + hla10 + ' ';
	if(hilat[0] == 12) infospecial += 'Fajr: ' + hla12 + ' ';
	if(hilat[0] == 13) infospecial += 'Fajr: ' + hla13 + ' ';
	if(hilat[1] == 10) infospecial += ',  Isha: ' + hla10 + ' ';
	if(hilat[1] == 12) infospecial += ',  Isha: ' + hla12 + ' ';
	if(hilat[1] == 13) infospecial += ',  Isha: ' + hla13 + ' ';
	}
	if(hilat[1] < -20) infospecial += hadd;

  }

  var infos = new Array('','','','','');
  if(lang == 'sve') {
    infos[0] += '<a href="' + infopath + 'prayertimes_program-info.html#parametrar">' + infospecial + '</a>';
    infos[1] += 'Ort: ' + city.replace('Municipality','') + '<br>';
    infos[1] += 'L�ge: (' + Math.floor(lat*1000)/1000 + ', ' + Math.floor(lng*1000)/1000 + ')';
    infos[1] += ' Tidszon: ' + tzid + ' ' + tz + '<br>';
    infos[2] += '<a href="' + infopath + 'prayertimes_program-info.html#tabellerade-tider">Tabellerade tider</a>';  
    infos[2] += ' * '+'<a href="' + infopath + 'prayertimes_program-info.html#contents">Ber�kningsmetod</a>';
    infos[2] += ' * '+'<a href="' + infopath + 'prayertimes_program-info.html#parametrar">Inst�llningar</a><br>';
    infos[3] += '<a href="' + infopath + 'prayertimes_program-info.html#modeller">Fiqh Method: </a>' + method_name;
    infos[4]  = '';
  } else { 
    infos[0] += '<a href="' + infopath + 'prayertimes_program-info-eng.html#parametrar">' + infospecial + '</a>';
    infos[1] += 'Lokation: ' + city + ',  ';
      infos[1] += 'koordination: (' + Math.floor(lat*1000)/1000 + ', ' + Math.floor(lng*1000)/1000 + ')<br>';
    infos[1] += ' Tidszone: ' + tzid + ' ' + tz + '<br>';
    infos[2] += '';  
    infos[2] += '  '+'';
    infos[2] += '  '+'';
    infos[3] += '';
    infos[4]  = '';
  }
  return infos;
}

function makeTable(offset,infos,timeTags,ps) {
// make monthly timetable

  var timeZone = settz(ps)[0];
  var lat    = ps.document.showcity.lat.value;
  var lng    = ps.document.showcity.lng.value;
  var lang   = ps.document.showcity.language.value;
  var asr1   = ps.document.special.asr1.value;
  var asr2   = ps.document.special.asr2.value;
  var isha1  = ps.document.special.angle2.value;
  var isha2  = ps.document.special.angle3.value;
  var taqdir = 0;

// From when to when
  var date;
  var enddate;
  var month;
  var year;

  var ramadan;
  if(offset == 'ramadan') {
	ramadan = true;
  	month = 12;
  	year = 1431;
  	date = new Date(2010, 7, 11); 	// Ramadan begins August 11
  	endDate = new Date(2010, 8, 10); 	// Ramadan ends Sept 9
  } else {
  	currentDate.setMonth(currentDate.getMonth()+ 1* offset);
  	month = currentDate.getMonth();
  	year = currentDate.getFullYear();
  	date = new Date(year, month, 1);
  	endDate = new Date(year, month+ 1, 1);
  } 
  
  var title = manadsNamn(month,lang)+ ' '+ year;
  var table = document.getElementById('timetable');
  var tbody = document.createElement('tbody');

//    timeTags.unshift('<b>Date</b>');

  if(ramadan) {
	timeTags.unshift('<b>Aug/<br>Sept<br>2010</b>');
//	timeTags.unshift('<b>Rama<br>dan</b>');
  } else {
      timeTags.unshift('<b>Date</b>');
  }


  tbody.appendChild(makeTableRow(timeTags, 'head-row'));
  var daycount = 0;
  while (date < endDate)
  {
//	daycount += 1;
	var times1 = prayTime.getPrayerTimes(date, lat, lng, timeZone);
      times1 = presentTimes(times1,asr1,asr2,isha1,isha2);
    	taqdir += times1[11];
    	var times = new Array(times1[0],times1[2],times1[3],times1[4],times1[6],times1[7])
   	times.unshift(date.getDate()); 	// add day number
//   	if(ramadan)times.unshift(daycount); // add day count
    	var today = new Date();
    	var isToday = (date.getMonth() == today.getMonth()) && (date.getDate() == today.getDate());
    	tbody.appendChild(makeTableRow(times, isToday ? 'today-row' : 'normal-row'));
    	date.setDate(date.getDate()+ 1); // next day
  }
  removeChildrenOfNode(table);
  table.appendChild(tbody);


// Join infos into string
  if(taqdir != 0)infos[4] = infos[0];
  infos.shift();
  infostr = infos.join('') + '<br>';

// Output header
  document.getElementById('table-title').innerHTML = title;
  document.getElementById('table-info').innerHTML = infostr;

}

//=================================================================================
//
// Times display

function presentTimes(times,asr1,asr2,isha1,isha2) {
// asr1 etc. are the angle values stored in ps
  times1 = times;

//Paint taqdir values
  for (var i=0; i<= times1.length; i++) {
    if( String(times[i]).substr(0) == '(' )
    times1[i]  = '<span id="taqdir">' +  times[i] + '</span>';
  }

//Paint alternate asr & isha times
  if(asr2)
  if(!isNaN(asr2) && times1[4] != times1[5])
  times1[4] = altenateTimesDisplay(asr1,asr2,times1[4],times1[5],'faint');

  if(isha2) {
    if(!isNaN(isha2)) { // secondary isha time exists
	if(!( times1[7].match("a") && times1[9].match("a") )) { // they do not both have taqdir
    	  if(times1[7] != times1[9]) { // they are not equal
    	     if(times1[8] != times1[10]) { // taqdir is not equal
    	        times1[7] = altenateTimesDisplay(isha1,isha2,times1[7],times1[9],'faint');
  	     }
	  }
  	}
    }
  }
//alert(new Array(isha2,times1[7],times1[9]));

//alert(times1);
  return times1;
}

function altenateTimesDisplay(a1,a2,t1,t2,id) {
//Combine t1 and t2 into one string in time order, and paint t2: 
  var newtime;
  if(a1 < a2) { 
	  //display t1, then t2 faint
	  newtime  = t1;
	  newtime += '<span id="' + id + '">' + ' ~ ' + t2 + '</span>';
  } else if(a2 < a1) { 
	  //display t2 faint, then t1
 	  newtime  = '<span id="' + id + '">' + t2 + ' ~ ' + '</span>';
	  newtime += t1;
  } else {
	  newtime = t1;
  }
  return newtime;
}

//=================================================================================
//
// Time tags

function timeTagsDayly(lang) { 
  var timeTags = new Array(
	'<div style="margin-left: 1px;">Fajr</div>',
	'<div style="margin-left: 1px;">Shuruq</div>',
	'<div style="margin-left: 1px;">Dhuhr</div>',
	'<div style="margin-left: 1px;">Asr</div>',
	'<div style="margin-left: 1px;">Maghrib</div>',
	'<div style="margin-left: 1px;">Isha</div>'
  );
  if(lang == 'eng') {
  timeTags[1] = '<div style="margin-left: 1px;">Sunrise</div>';
  }
  if(lang == 'dan') {
    timeTags[1] = '<div style="margin-left: 1px;">Solopgang</div>';
    timeTags[2] = '<div style="margin-left: 1px;">Dhuhr</div>';
  }
return timeTags;
}

function timeTagsMonthly(lang) {
  if(lang == 'sve') {
    var timeTags = new Array(
		'<b>Fajr</b><br>gryning',
		'<b>Shuruq</b><br>soluppg�ng',
		'<b>Dhuhr</b><br>middag',
		'<b>Asr</b><br>eftermiddag',
		'<b>Maghrib</b><br>solnedg�ng',
		'<b>Isha</b><br>natt'
    );
  } else if(lang == 'dan') {
    var timeTags = new Array(
		'<b>Fajr</b><br>gryning',
		'<b>Shuruq</b><br>soluppg�ng',
		'<b>Dhuhr</b><br>middag',
		'<b>Asr</b><br>eftermiddag',
		'<b>Maghrib</b><br>solnedg�ng',
		'<b>Isha</b><br>natt'
    );
  } else {
    var timeTags = new Array(
		'<b>Fajr</b><br>dawn',
		'<b>Shuruq</b><br>sunrise',
		'<b>Dhuhr</b><br>noon',
		'<b>Asr</b><br>afternoon',
		'<b>Maghrib</b><br>sunset',
		'<b>Isha</b><br>night'
    );
    var shadow = ' x shadow'
  }
  return(timeTags)
}

function timeTagsMonthlyInfo(timetags,ps) {
var timeTags = timetags;
  var lang   = ps.document.showcity.language.value;
  var fajr   = ps.document.special.angle1.value;
  var asr1   = ps.document.special.asr1.value;
  var asr2   = ps.document.special.asr2.value;
  var isha1  = ps.document.special.angle2.value;
  var isha2  = ps.document.special.angle3.value;
  if(isha2 == 'undefined')isha2 = null;
  var adj1   = ps.document.special.sunadj1.value;
  var adj2   = ps.document.special.sunadj2.value;
  var hilat   = new Array(
      ps.document.special.hilat0.value,
      ps.document.special.hilat1.value,
      ps.document.special.hilat2.value,
      ps.document.special.hilat3.value);
  var adds = new Array(
	ps.document.special.add0.value, 
	ps.document.special.add1.value,
	ps.document.special.add2.value,
	ps.document.special.add3.value,
	ps.document.special.add4.value,
	ps.document.special.add5.value
  );
  if(lang == 'sve') {
    var shadow = ' x skyggen' 
  } else if(lang == 'dan') {
  } else {
    var shadow = ' x skyggen' 
  }

// Tag info on times adjustments and adds
// Fajr
  timeTags[0] += '<br>' + fajr + '�';
  timeTags[1] += '<br>' + adj1 + '�';
  if(hilat[0] < 0) {
    timeTags[0] += ' (';
    if(hilat[0] < -20) {
      timeTags[0] += '+' + Math.abs(hilat[0]) + 'min)';
    } else {
      timeTags[0] += Math.abs(hilat[0]) + '�)';       
    }
  }


// Asr
  var asrtag = asr1;
  if(asr2)if(asr2!=null && asr2!='null' && asr1 < asr2)asrtag = asr1 + ' ~ ' + asr2;
  if(asr2)if(asr2!=null && asr2!='null' && asr2 < asr1)asrtag = asr2 + ' ~ ' + asr1;
  timeTags[3] += '<br>' + asrtag;
  timeTags[3] += shadow;
  timeTags[4] += '<br>' + adj2 + '�';

// Isha
  var ishatag = isha1 + '�';
  if(isha2) {
    if(isha2!=null && isha2!='null') {
//	alert(isha2);
	if(isha1 < isha2)ishatag = isha1 + '�' + ' ~ ' + isha2 + '�';
  	if(isha2 < isha1)ishatag = isha2 + '�' + ' ~ ' + isha1 + '�';
    }
  }
  timeTags[5] += '<br>' + ishatag
  if(hilat[1] < 0) {
    timeTags[5] += ' (';
    if(hilat[1] < -20) {
      timeTags[5] += '+' + Math.abs(hilat[1]) + 'min)';
    } else {
      timeTags[5] += Math.abs(hilat[1]) + '�)';       
    }
  }

// Adds
  for (var i=0; i<=5; i++) {
    if(adds[i] > 0) timeTags[i] += '<br>'+'+'+adds[i] + 'min ';
    if(adds[i] < 0) timeTags[i] += '<br>'    +adds[i] + 'min ';
  }
  return timeTags;
}

//=================================================================================
//
// Date display

function datumIdag(language) {
  var lang  = language;
  var date  = new Date(); // today
  var dag   = veckoDag(lang,date.getDay());
  var manad = manadsNamn(date.getMonth(),lang);
  var ar = date.getYear(); 
  if (ar < 1000) ar = ar + 1900;
  var datum = dag + ' ' + date.getDate() + ' ' + manad + ' ' + ar; 
  return datum;
}

function manadsNamn(month,lang) {
  var manadsnamn;
  if(lang == 'sve') {
    manadsnamn = new Array(
	'Januari','Febuari','Mars','April','Maj','Juni','Juli',
	'Augusti','September','Oktober','November','December','Ramadan');
  } else if(lang == 'dan') {
    manadsnamn = new Array(
	'Januar','Febuar','Marts','April','Maj','Juni','Juli',
	'August','September','Oktober','November','December','Ramadan');
  } else {
    manadsnamn = new Array(
	'January','February','March','April','May','June','July',
	'August','September','October','November','December','Ramadan');
  }
  return manadsnamn[month];
}

function veckoDag(lang,day) {
  var veckodag;
  if(lang == 'sve') {
    veckodag = new Array('S�n','M�n','Tis','Ons','Tor','Fre','L�r');
  } else if(lang == 'dan') {
    veckodag = new Array('S�n','Man','Tir','Ons','Tor','Fre','L�r');
  } else {
    veckodag = new Array('Sun','Mon','Tue','Wed','Thu','Fri','Sat');
  }
  return veckodag[day];
}

/* 
svenska:
veckodag = new Array('S�ndagen','M�ndagen','Tisdagen','Onsdagen','Torsdagen','Fredagen','L�rdagen');

dansk:
veckodag = new Array('
    Mandag (Man)
    Tirsdag (Tir)
    Onsdag (Ons)
    Torsdag (Tor)
    Fredag (Fre)
    L�rdag (L�r)
    S�ndag (S�n)');
*/

//=================================================================================
//
// Table making

function excludeWhatIsBetweenTags(item) {
var item1 = item;
var i1 = 0;
var i2 = item1.length;
var extr = '';
  while(i1 >= 0) {
    var i1 = item1.indexOf('<'); 
    var i2 = item1.indexOf('>')+1;
    if(i1 >= 0) {
      extr = item1.slice(i1,i2);
//    alert(extr);
      item1 = item1.replace(extr,''); 
    }
  }
//alert(new Array(item,item1));
  return item1;
} 

function makeTableHeader(textstring, id)
// make a table header
{
  var row = document.createElement('tr');
  var cell = document.createElement('td');
  cell.innerHTML = textstring;
  cell.setAttribute('id', id);
  row.appendChild(cell); 
  return row;
}

function makeTableRow(items, id)
// make a table row
{
  var row = document.createElement('tr');
  for (var i=0; i< items.length; i++)
  {
    var cell = document.createElement('td');
    cell.innerHTML = items[i];
    if(i == 0) {
      cell.setAttribute('id', 'head-row');
      cell.setAttribute('width', 35);
    } else { 
        var item1 = excludeWhatIsBetweenTags(items[i]);
        cell.setAttribute('width', 70);
	  if(item1.length > 10) {
          cell.setAttribute('id', id);
          if(cell.getAttribute('id') != 'head-row')cell.setAttribute('width', 110);
      } else {
          cell.setAttribute('id', id);
	}
    }
    row.appendChild(cell); 
//  alert(new Array(i,items[i],cell.getAttribute('width')));
  }
  return row;
//cell.setAttribute('style.width', '120px'); // does not work
//cell.setAttribute('style.width', 120); // does not work
//cell.setAttribute('width', 120);  // works
}

function removeChildrenOfNode(node)
// remove all children of a node
{
  if (node == undefined || node == null)
  return;
  while (node.firstChild)
  node.removeChild(node.firstChild);
}

function switchFormat(offset)
// switch time format
{
  var formats = new Array('24-hour', '12-hour');
  timeFormat = (timeFormat+ offset)% 2;
  // document.getElementById('time-format').innerHTML = formats[timeFormat];
  // prayTime.setTimeFormat(timeFormat == 0 ? prayTime.Time24 : prayTime.Time12NS);
//  viewMonth(0);
}

//=================================================================================
//



