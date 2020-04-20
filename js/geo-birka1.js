//alert('hej');

// Google maps and other geo-functions
var point;
var view;
var map;
var geocoder;
var address;

// mapview: lobal variable indicating if map is to be draw
// if false: calculation, no map, 
// if true: no calculation, map shown with view size mapview (typically 5)
var mapview;

//================================================================
// Functions for debugging
function hej(windowloc,message){
  thiswindow = windowloc;
  thiswindow.document.write(message);
}

function alertpsLocation(message,ps) {
// Alert message for debugging 
   alert(message + ' location stored in ps: ' + ps.document.getElementById('address').value + ' ' + ps.document.getElementById('lat').value + ', ' + ps.document.getElementById('lng').value + ' Timezone: ' + ps.document.getElementById('tzid').value + ' GMT offset:' + ps.document.getElementById('tz').value);
  return false;
}

//================================================================
// get location by geoip
// uses script source: http://j.maxmind.com/app/geoip.js" 
// 
function getLocation() {
	document.write("45");
    document.write("København");
    document.write("Danmark");
	document.write("NV");
	document.write("Sjælland");
    document.write("55.676098");
    document.write("12.568337");
	document.write("2400");
}

function geoipLocation(pss){
// Automaitc retrieval of location and coordinates based on IP
  var ps = this.window;
  if(pss)ps = pss;
    ps.document.showcity.address.value = "København" + ', ' + "Danmark";
    ps.document.showcity.lat.value = "55.676098";
    ps.document.showcity.lng.value = "12.568337";
//alertpsLocation('geoipLocation: ',ps);
return false;
}

//================================================================
// 

function initCity(mapp) {
  var ps = this.window;
//Note program change
//var pt = ps.parent.prayertimetable;
  var pt = this.window;

  var mapview;
  if(mapp)mapview = mapp;
//alert(mapview);
  var location = ps.document.showcity.address.value;
  var lat = ps.document.showcity.lat.value;
  var lng = ps.document.showcity.lng.value;
//alertpsLocation('initCity: ',ps);
  if(!location || location == 'auto') {
//alert('initCity calling geopip, gettimezone, compute');
	geoipLocation(ps);
      getTimeZone();
	if(!mapview)compute();
  } else {
//alert('initCity calling mapcity');
//    mapcity1(location,ps.parent.prayertimetable,165,213,mapview);
      mapcity1(location,mapview);
  }
  return false;
}

function getTimeZone(pss) {
  var ps = this.window;
  if(pss)ps = pss;
  if(ps.document.showcity.tz) {
    if(ps.document.showcity.tz.value != 'Timezone' &&
       ps.document.showcity.tzid.value != 'set manually to ')GetTimeZoneData();
  }
  return false;
}

//================================================================
// get timezone for given coordintes
// uses script source: http://ws.geonames.org/export/jsr_class.js
// (code included in this file)

function getTimeZoneReply(jData) {
// handles json query reply
// this function will be called by our JSON callback
// jData contains the data object returned by jsr_class.js

  if (jData == null)return;
  
   var jgmtOffset    = jData.gmtOffset;
   var jcountryName  = jData.countryName;
   var jcountryCode  = jData.countryCode;
   var jtimezoneId   = jData.timezoneId;
   var jlat          = jData.lat;
   var jlng          = jData.lng;
// alert('timezone: ' + jtimezoneId + ' GMT offset:' +  jgmtOffset);

// store data in ps
   ps = this.window.document;
// ps.showcity.address.value = jcountryCode;
// ps.showcity.lat.value = jlat;
// ps.showcity.lng.value = jlng;

// All we actually need here is the time zone 
   if(!ps.showcity.tz)return;
   if(!ps.showcity.tzid)return;
   ps.showcity.tz.value   = jgmtOffset;
   ps.showcity.tzid.value = jtimezoneId;

   var gmtstr = 'GMT';
   if(jgmtOffset > 0)gmtstr += '+';
   gmtstr += jgmtOffset;
   ps.showcity.tz.value = gmtstr;
//   ps.getElementById('tz').value = gmtstr;
}


function GetTimeZoneData() {
// get  coordinates from ps
   ps = this.window.document;
   var lat = ps.showcity.lat.value;
   var lng = ps.showcity.lng.value;

// compose request
   request = 'http://ws.geonames.org/timezoneJSON?formatted=true&lat=' + lat + '&lng=' + lng + '&callback=getTimeZoneReply&style=full';

// execute the request
   aScript = new JSONscriptRequest(request); // Create a new script object
   aScript.buildScriptTag(); // Build the script tag
   aScript.addScriptTag(); // Execute (add) the script tag
}

//================================================================
// http://ws.geonames.org/export/jsr_class.js
//
// JSONscriptRequest -- a simple class for accessing Yahoo! Web Services
// using dynamically generated script tags and JSON
//
// Author: Jason Levitt
// Date: December 7th, 2005
//
// Constructor -- pass a REST request URL to the constructor
//
function JSONscriptRequest(fullUrl) {
    // REST request path
    this.fullUrl = fullUrl; 
    // Keep IE from caching requests
    this.noCacheIE = '&noCacheIE=' + (new Date()).getTime();
    // Get the DOM location to put the script tag
    this.headLoc = document.getElementsByTagName("head").item(0);
    // Generate a unique script tag id
    this.scriptId = 'YJscriptId' + JSONscriptRequest.scriptCounter++;
}

// Static script ID counter
JSONscriptRequest.scriptCounter = 1;

// buildScriptTag method
//
JSONscriptRequest.prototype.buildScriptTag = function () {

    // Create the script tag
    this.scriptObj = document.createElement("script");
    
    // Add script object attributes
    this.scriptObj.setAttribute("type", "text/javascript");
    this.scriptObj.setAttribute("src", this.fullUrl + this.noCacheIE);
    this.scriptObj.setAttribute("id", this.scriptId);
}
 
// removeScriptTag method
// 
JSONscriptRequest.prototype.removeScriptTag = function () {
    // Destroy the script tag
    this.headLoc.removeChild(this.scriptObj);  
}

// addScriptTag method
//
JSONscriptRequest.prototype.addScriptTag = function () {
    // Create the script tag
    this.headLoc.appendChild(this.scriptObj);
}

//================================================================
// google maps functions

function getAddress(inputstring) {
  var str = inputstring;
  if (str != null) {
    initgeo(); 
    geocoder.getLocations(str,showAddress);
  }
}

function mapcity1(address,viewcode) {
// Draws a map of "address" in window "frameloc"
   mapview = viewcode; 
   var thisaddress = address;
   thisaddress = thisaddress.split('GMT')[0]; //strip off gmt from addres string
   initgeo();
   if(mapview) {
   view = viewcode;
   var thiswindow = this.window;

// Note: progrm change: set mapdiv height instead of calling setupcontainer
// setupcontainer1(thiswindow,width,height);

   ptdiv = document.getElementById('prayertimetable'); // close pt-div
   ptdiv.style.height = '1px';
   mapdiv = document.getElementById('map_canvas');	// open map-div
   mapdiv.style.height = '140px';

   initmap(thiswindow);
  }
  getAddress(thisaddress);
}

function getAddress(inputstring) {
  var str = inputstring;
  if (str != null) {
    initgeo(); 
    geocoder.getLocations(str,showAddress);
  }
}

function showAddress(response) {
// Program change: ps redifined
//   var ps = parent.prayerselect; 
   var ps = this; 

  if (!response || response.Status.code != 200) {
    alert("Status Code:" + response.Status.code); return false;
  } else {
    place = response.Placemark[0];
    point = new GLatLng(
      place.Point.coordinates[1],
      place.Point.coordinates[0] 
    );

//alert(place.address);
//alert(place.Point.coordinates)

// Allocate new address & koord
   ps.document.showcity.address.value = place.address;
   ps.document.showcity.lat.value = place.Point.coordinates[1];
   ps.document.showcity.lng.value = place.Point.coordinates[0];

//alert('showaddress calling timezone');
    getTimeZone();

//alert(mapview);
    if(mapview) {
    map.clearOverlays();
    marker = new GMarker(point);
    map.setCenter(point, view);
//  map.setUIToDefault();
    map.addControl(new GSmallZoomControl3D());
    map.addOverlay(marker);
    }
//alert('showaddress calling compute');
    if(!mapview)compute();
  }
/* 
str  = '<b>Koordinater: </b>'  + '<br>'; 
str += ' Latitud ' + place.Point.coordinates[1] + '<br>';
str += 'Longitud ' + place.Point.coordinates[0] + '<br>';
str += '<b>Address:</b>'  + '<br>' + place.address + '<br>';
// alert(str);
// thiswindow.document.write(str);
// marker.openInfoWindowHtml(str);
*/
return;
}



function initgeo() { 
//Initialize geocoder
  geocoder = new GClientGeocoder();
}

function initmap(myframeloc) {
  var thiswindow = this.window;
  if(myframeloc)thiswindow = myframeloc;

//Initialize map in my frame
  mapdiv = thiswindow.document.getElementById('map_canvas');
  map = new GMap2(mapdiv);
//map = new GMap2(mapdiv));
//map.setUIToDefault();  
  map.addControl(new GSmallZoomControl3D());
}

function setupcontainer1(myframeloc,width,height) { 
//same as above, but without margins
//table taken out as well  
  var thiswindow = this.window;
  if(myframeloc)thiswindow = myframeloc;
//  thiswindow.document.write('Here goes the map...');
//  alert('setupcontainer1 drawing map');
//  thiswindow.focus();
  str  = '';
  str += '<html><head><title>Mapwindow</title>';
//str += '<link rel="stylesheet" href="gmap.css" type="text/css">';
  str += '</head>';
  str += '<body style="background-color: transparent;"';
//str += 'class="map" onLoad="self.focus()">';
  str += '<div style="margin: 4px 5px;">';
  str += '<center><div id="map_canvas"'; 
  str += 'style="width: ' + width + 'px; height: ' + height + 'px;">';
  str += '</div></center></div></body></html>';  
  thiswindow.document.write(str);
}

function close(myframeloc) {
  thiswindow = myframeloc; 
  thiswindow.document.close();
}

function writecoord(myframeloc,address) {
  var thiswindow = myframeloc;

//hej(thiswindow,'entering if');
//Get coord's for address 
  if (!geocoder) {
    alert("no geocoder");
  } else {

    geocoder.getLatLng(
    address,
    function(point) {
      if (!point) {
        alert(address + " not found");
      } else {
//      thiswindow.document.write(point);
        str='<div style="';
str += 'font-family: arial;';
str += 'font-size: 13px;';
str += 'font-style: normal;';
str += 'color: #003366;}">';
str += '<center>Koordinater för ' + address + ':<br>';
str += point + '<\/center><\/div>';
        thiswindow.document.write(str);
      }
    });
  }
 close(thiswindow);
}


//==============================================================
/*
function showAddress2(address) {
// Get coord's for address and mark on map 
  if (geocoder) {
    geocoder.getLatLng(
    address,
    function(point) {
      if (!point) {
        alert(address + " not found");
      } else { 
        map.setCenter(point, view);
        var marker = new GMarker(point);
        map.addOverlay(marker);
//      clickdisplay(map);
        thiswindow.document.close();
      }
    }
    );
  }
}
*/

