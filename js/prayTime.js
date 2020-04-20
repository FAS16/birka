//alert('hej');

//--------------------- Copyright Block ----------------------
/* 

PrayTime.js: Prayer Times Calculator (ver 1.2)
Copyright (C) 2007-2008 Hamid Zarrabi-Zadeh
License: Creative Commons 3.0 (BY-NC-SA)

This program can be used in other websites or applications
provided its source (http://tanzil.info/praytime) is clearly 
indicated in the derived work.

See details of the license at 
http://creativecommons.org/licenses/by-nc-sa/3.0/

//--------------------- Help and Manual ----------------------

User's Manual: 
http://tanzil.info/praytime/doc/manual

Calculating Formulas: 
http://tanzil.info/praytime/doc/calculation

*/

//--------------------- PrayTime Class -----------------------

function PrayTime()
{

//--------------------- User Interface -----------------------
/* 
	getPrayerTimes (date, latitude, longitude, timeZone)
	getDatePrayerTimes (year, month, day, latitude, longitude, timeZone)

	setAsrMethod (methodID)
	setAngles (angles)	      // angles for fajr, shuruq, maghrib, isha1, isha2
	setAddMinutes (minutes)	      // minutes after each prayer time
	setHighLatsMethod (hilat)	// adjust method for higher latitudes

	setTimeFormat (timeFormat)	
	floatToTime24 (time)
	floatToTime12 (time)
	floatToTime12NS (time)
*/
//------------------------ Constants --------------------------

	// Time Formats
	this.Time24     = 0;    // 24-hour format
	this.Time12     = 1;    // 12-hour format
	this.Time12NS   = 2;    // 12-hour format with no suffix
	this.Float      = 3;    // floating point number 

	// Time Names
	this.InvalidTime = '---';	 // The string used for invalid times

//	this.tinit = new Array(3, 3, 6, 12, 15, 15, 18, 20, 20, 21, 21); //default times

//---------------------- Global Variables --------------------

	this.asr1Juristic  = 1;		// Juristic method for Asr
	this.asr2Juristic  = 2;		// Juristic method for Asr
	this.highLats = new Object;		// adjusting method for higher latitudes
	this.highLats.method  = new Array;	// method of taqdir; 0=none
	this.highLats.crit    = new Array;	// critical value; 
	this.highLats.smooth  = new Array;	// smoothing: noo days to smooth: 0 or null=no, <0=combine with []
	this.highLats.combi   = false;

	this.timeFormat   = 0;		// time format

	this.last = new Object;		// for storing last computed results
	this.last.sequence = -99; 
	this.last.day = 1;	
	this.last.times = new Array(0,0,0,0,0,0,0,0,0,0,0,0); 
	this.last.times = new Array(4.5,5.9,12.0,15.7,14.,17.,20.3,20.3,19.8,19.8);	
	this.last.trend = new Array(0,0,0,0,0,0,0,0,0,0,0,0); 
	this.times7     = new Array(0,1,2,3,4,5,6,7,8,9,10,11); 
	this.backstep   = new Array(0,0,0,0,0,0,0,0,0,0,0,0);	
	this.gap 	    = new Array(0,0,0,0,0,0,0,0,0,0,0,0);
	this.step       = new Array(0,0,0,0,0,0,0,0,0,0,0,0);	
	this.critFajr   = false;
	this.critIsha1  = false;
	this.critIsha2  = false;

	var lat;        // latitude 
	var lng;        // longitude 
	var timeZone;   // time-zone 
	var JDate;      // Julian date

//--------------------- Technical Settings --------------------

	this.numIterations = 1;		// number of iterations needed to compute times

//------------------- Calc Method Parameters --------------------

      // Minutes to be subtracted added to fajr, shuruq, zhuhr, asr, maghrib, isha
      this.addedMinutes = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

      // Angles for fajr, shuruq, maghrib, isha1, isha2
	this.Angles = new Array(18, 0.833, 0.833, 15, 18);
}	

//-------------------- Interface Functions --------------------

PrayTime.prototype.getPrayerTimes = function(date, latitude, longitude, timeZone)
// return prayer times for a given date
{
	return this.getDatePrayerTimes(date.getFullYear(), date.getMonth()+ 1, date.getDate(),latitude, longitude, timeZone);
}

PrayTime.prototype.getDatePrayerTimes = function(year, month, day, latitude, longitude, timeZone)
// return prayer times for a given date
{
	this.lat = latitude;
	this.lng = longitude; 
	this.timeZone = this.effectiveTimeZone(year, month, day, timeZone); 
	this.JDate = this.julianDate(year, month, day)- longitude/ (15* 24);
	return this.computeDayTimes();
}

PrayTime.prototype.setAsrMethod = function(methodID1,methodID2)
// set the juristic method for Asr
{
	this.asr1Juristic = Math.abs(methodID1);
	this.asr2Juristic = null;
	if (methodID2)this.asr2Juristic = Math.abs(methodID2);
}

PrayTime.prototype.setAngles = function(angles_array_with_five_elements)
// Set angles for each of the prayer times
{
	this.Angles = angles_array_with_five_elements;
}

PrayTime.prototype.setAddMinutes = function(minutesarray_with_six_elements)
// Set minutes to be added to each of the prayer times
{
//	this.addedMinutes = minutesarray_with_six_elements;

	this.addedMinutes[0] = minutesarray_with_six_elements[0]-1; // fajr (rounded down)
	this.addedMinutes[1] = minutesarray_with_six_elements[0]-1;	// fajrstar (rounded down)
	this.addedMinutes[2] = minutesarray_with_six_elements[1]-1; // shuruq (rounded down)
	this.addedMinutes[3] = minutesarray_with_six_elements[2];	// zhuhr
	this.addedMinutes[4] = minutesarray_with_six_elements[3];	// asr1
	this.addedMinutes[5] = minutesarray_with_six_elements[3];	// asr2
	this.addedMinutes[6] = minutesarray_with_six_elements[4];	// maghrib
	this.addedMinutes[7] = minutesarray_with_six_elements[5];	// isha1
	this.addedMinutes[8] = minutesarray_with_six_elements[5];	// isha1star
	this.addedMinutes[9] = minutesarray_with_six_elements[5];	// isha2
	this.addedMinutes[10] = minutesarray_with_six_elements[5];// isha2star
}

PrayTime.prototype.setHighLatsMethod = function(hilat) 
// set adjusting method for higher latitudes 
{
	this.highLats.method[0] = hilat[0];	
	this.highLats.method[1] = hilat[1];	
	this.highLats.method[2] = hilat[1];	
	this.highLats.crit[0] = hilat[2];	
	this.highLats.crit[1] = hilat[3];	
	this.highLats.crit[2] = hilat[3];	
	this.highLats.smooth[0] = hilat[4];	
	this.highLats.smooth[1] = hilat[5];	
	this.highLats.smooth[2] = hilat[5];	
	this.highLats.combi = (hilat[5] < 0);
}

//====================== Computationl Procedure =======================

PrayTime.prototype.computeDayTimes = function(fajrisha)
// compute prayer times at given julian date - Computational procedure
{
	var fi = 1;
	if(fajrisha)fi=fajrisha;
	var times;
	for (var i=1; i<=this.numIterations; i++)
	times = this.computeTimes(times);//2.0192442827924477
	times = this.addMinutes(times)//2.002577616125781
	times = this.estimateTimes(times)
	times = this.smoothTimes(times);
	times = this.combineIshaTimes(times);//2.002577616125781
	this.saveLast(times);
	times = this.adjustTimeZone(times)
	times = this.adjustTimesFormat(times);//3.1646884827924477
	times = this.tagModifiedTimes(times);
	
	return times;
}

PrayTime.prototype.computeTimes7 = function(noodays) 
// compute prayer times 1 week ahead
{
	if(noodays)if(noodays < 0)return;
	var times7 = new Array;
	var ndays = 6;
	if(noodays)ndays = Math.abs(noodays);
// alert(ndays);
	if(ndays > 0) {		
	   if(this.times7[11] != this.JDate + ndays) {
		var JDate0 = this.JDate;
		this.JDate += ndays;
		for (var i=1; i<=this.numIterations; i++)
		times7 = this.computeTimes(times7);
		times7 = this.addMinutes(times7);
		times7 = this.estimateTimes(times7);
		for (var i=0; i<times7.length; i++) 
		this.times7[i] = times7[i];
		this.times7[11] = this.JDate; // store date of comtuted times
		this.JDate = JDate0; // reset JDate
	   }
	} else {
	   if(this.times7[11] != this.JDate) {
		for (var i=0; i<=10; i++) 
		this.times7[i] = times[i];
		this.times7[11] = this.JDate; // store date of comtuted times
	   }
	}
	return;
}

//---------------------- Compute Prayer Times -----------------------

PrayTime.prototype.computeTimes = function(times)
// compute prayer times at given julian date
{
	var tinit = new Array(3, 3, 6, 12, 15, 15, 18, 20, 20, 21, 21); //default times
	t = this.dayPortion(tinit);

// Fajr
	var Fajr = this.computeTime(180 - this.Angles[0], t[0]);
	var Fajrstar= Fajr;
// Shuruq
	var Shuruq = this.computeTime(180 - this.Angles[1], t[2]);
      var Dhuhr  = this.computeMidDay(t[3]);
// Asr
	var Asr1 = this.computeAsr(this.asr1Juristic, t[4]);
	var Asr2;
	if(this.asr2Juristic)
    	    Asr2 = this.computeAsr(this.asr2Juristic, t[5]);
// Maghrib
	var Maghrib = this.computeTime(this.Angles[2], t[6]);
// Isha1
      var Isha1;	
      if(this.Angles[3] == 0) { Isha1 = Maghrib;
	} else { Isha1 = this.computeTime(this.Angles[3], t[7]);
	}
      var Isha1star = Isha1;
// Isha2
      var Isha2;	
      if(this.Angles[4]) {
        if(this.Angles[4] == 0) { Isha2 = Maghrib;
	  } else { Isha2 = this.computeTime(this.Angles[4], t[9]);
	  }
	}
      var Isha2star = Isha2;

	return new Array(
	Fajr, Fajrstar, Shuruq,	Dhuhr, Asr1, Asr2, 
	Maghrib, Isha1, Isha1star, Isha2, Isha2star);
}

PrayTime.prototype.addMinutes = function(times)
// Added minutes
{
      for (var i=0; i<times.length; i++) 
      if(times[i])times[i] += this.addedMinutes[i]/ 60; // Add minutes to all times
	return times;
}

//---------------------- Taqdir -----------------------

PrayTime.prototype.setCritTimes = function(times) 
// Set up conditions for critical times
{
/*
      var critFajr  = isNaN(Fajr)  || this.timeDiff(Fajr,Dhuhr)  > 12.0 - this.highLats.crit[0];
	var critIsha1 = isNaN(Isha1) || this.timeDiff(Dhuhr,Isha1) > 12.0 - this.highLats.crit[1];
	var critIsha2 = isNaN(Isha2) || this.timeDiff(Dhuhr,Isha2) > 12.0 - this.highLats.crit[2];	
*/
   	this.critFajr  = isNaN(times[0]) || this.timeDiff(times[0],times[3])  > 12.0 - this.highLats.crit[0];
   	this.critIsha1 = isNaN(times[7]) || this.timeDiff(times[3],times[7])  > 12.0 - this.highLats.crit[1];
	this.critIsha2 = false; 
	if(this.Angles[4])
   	this.critIsha2 = isNaN(times[9]) || this.timeDiff(times[3],times[9])  > 12.0 - this.highLats.crit[2];	

//alert(new Array(this.highLats.crit[0],this.highLats.crit[1], this.highLats.crit[2]));
//alert(new Array(this.critFajr, this.critIsha1, this.critIsha2));

	return;
}


PrayTime.prototype.estimateTimes = function(times)
// Taqdir for high latitudes
{
	if (this.highLats.method[0] + this.highLats.method[1] + this.highLats.method[1] == 0) return times;
	this.setCritTimes(times);
	if(!this.critFajr && !this.critIsha1 && !this.critIsha2)return times;
//alert(new Array(this.critFajr, this.critIsha1, this.critIsha2));
   	times = this.adjustHighLatTimes(times);
	return times;
}

PrayTime.prototype.adjustHighLatTimes = function(times)
// adjust Fajr and Isha for locations at higher latitudes
{
	var Fajr    = times[0];
	var Shuruq  = times[2];
	var Dhuhr   = times[3];
	var Maghrib = times[6];
	var Isha1   = times[7];
	var Isha2   = times[9];

	var nightTime = this.timeDiff(Maghrib, Shuruq); // sunset to sunrise
	var midnight1 = Shuruq  - nightTime/2;
	var midnight2 = Maghrib + nightTime/2;

// Fajr & Isha: Aqrab al-Bilad
	var aFajr  = this.highLats.method[0] >= 10 && this.highLats.method[0] <20 && this.critFajr;
	var aIsha1 = this.highLats.method[1] >= 10 && this.highLats.method[1] <20 && this.critIsha1;
	var aIsha2 = this.highLats.method[2] >= 10 && this.highLats.method[2] <20 && this.critIsha2;

	if( aFajr || aIsha1 || aIsha2 )
	times = this.acrabBilad(times,aFajr,aIsha1,aIsha2);


// Isha: Add fix noo minutes to Maghrib
      var mIsha1 = this.highLats.method[1] < -20 && this.critIsha1;
      var mIsha2 = this.highLats.method[2] < -20 && this.critIsha2 &&  this.Angles[4];
	var minutes;

	if( mIsha1) {
	    minutes = -this.highLats.method[1]/60;
	    times[8] = Maghrib + minutes;
	    if( times[8] > midnight2 ) times[8] = midnight2;
 	}
      if( mIsha2) {
	    minutes = -this.highLats.method[2]/60;
	    times[10] = Maghrib + minutes;
	    if(times[10] > midnight2) times[10] = midnight2;
	}

// Fajr & Isha: a different angle
	var tinit = new Array(3, 3, 6, 12, 15, 15, 18, 20, 20, 21, 21); //default times
	t = this.dayPortion(tinit);

	vFajr  = this.highLats.method[0] < 0 && this.highLats.method[0] > -20 && this.critFajr ;
	vIsha1 = this.highLats.method[1] < 0 && this.highLats.method[1] > -20 && this.critIsha1 ;
	vIsha2 = this.highLats.method[2] < 0 && this.highLats.method[1] > -20 && this.critIsha2 ;

	if(vFajr) times[1]  = this.computeTime(-this.highLats.method[0], t[1]);
	if(vIsha1)times[8]  = this.computeTime(-this.highLats.method[1], t[8]);
	if(vIsha2)times[10] = this.computeTime(-this.highLats.method[2], t[10]);


// Fajr & Isha: fix night-portion
	var FajrDiff  = this.nightPortion(this.Angles[0],this.highLats.method[0])* nightTime;
	var IshaDiff1 = this.nightPortion(this.Angles[3],this.highLats.method[1])* nightTime;
	var IshaDiff2 = this.nightPortion(this.Angles[4],this.highLats.method[2])* nightTime;

      var pFajr  = this.highLats.method[0] >=1 && this.highLats.method[0] <= 8 && this.critFajr;
      var pIsha1 = this.highLats.method[1] >=1 && this.highLats.method[1] <= 8 && this.critIsha1;
      var pIsha2 = this.highLats.method[2] >=1 && this.highLats.method[2] <= 8 && this.critIsha2;

// !! Smooth transition IF style
      var bFajr = this.highLats.method[0] == 9;
	var bFajr = bFajr && ( isNaN(Fajr) || this.timeDiff(Fajr, Shuruq)  > FajrDiff ); 
	var bIsha1 = (this.highLats.method[1] == 9) && ( isNaN(Isha1) || this.timeDiff(Maghrib, times[8])  > IshaDiff1 ); 
      var bIsha2 = (this.highLats.method[2] == 9) && ( isNaN(Isha2) || this.timeDiff(Maghrib, times[10]) > IshaDiff2 );

	if( pFajr  || bFajr  ) times[1]  = Shuruq - FajrDiff;
	if( pIsha1 || bIsha1 ) times[8]  = Maghrib + IshaDiff1;
	if( pIsha2 || bIsha2 ) times[10] = Maghrib + IshaDiff2;

	return times;
}


PrayTime.prototype.nightPortion = function(angle,portion)
// the night portion used for adjusting times in higher latitudes
{
	if (portion == 9) return 1/60* angle;  	     	   // AngleBased
	if (portion >= 2 && portion <=8) return 1/portion; // indicated part of the night
}


PrayTime.prototype.dayPortion = function(times)
// convert hours to day portions 
{
	for (var i=0; i<times.length; i++) times[i] /= 24;
	return times;
}

PrayTime.prototype.adjustTimesFormat = function(times)
// convert times array to given time format
{
	if (this.timeFormat == this.Float)
		return times;
	for (var i=0; i<times.length; i++) {
		if (this.timeFormat == this.Time12) {
			times[i] = this.floatToTime12(times[i]); 
		} else if (this.timeFormat == this.Time12NS) {
			times[i] = this.floatToTime12(times[i], true); 
		} else {
			times[i] = this.floatToTime24(times[i]);
		}
	}
	return times;
}

PrayTime.prototype.tagModifiedTimes = function(times)
//    Tag modfied times
{
	var tagged = 0;

	if(times[0] != times[1]) { times[0]='<span id="taqdir">(' + times[1]  + ')</span>'; tagged += 1; }
	if(times[7] != times[8]) { times[7]='<span id="taqdir">(' + times[8]  + ')</span>'; tagged += 1; }
	if(times[9] && times[10]) {
	if(times[9] != times[10]){ times[9]='<span id="taqdir">(' + times[10] + ')</span>'; tagged += 1; }
	}
	times.push(tagged) ;
	return times;
}

//---------------------- AQRAB AL-BILAD -----------------------

PrayTime.prototype.acrabBilad = function(times,aFajr,aIsha1,aIsha2)
// adjust Fajr and Isha for locations at higher latitudes
{
	var Fajr    = times[0];
	var Shuruq  = times[2];
	var Dhuhr   = times[3];
	var Maghrib = times[6];
	var Isha1   = times[7];
	var Isha2   = times[9];
	var nighttime = this.timeDiff(Maghrib,Shuruq);  // sunset to sunrise local
	var aqrab = new Array;

//alert(' ' + Maghrib + Shuruq + nighttime);

// Store away actual latitude

      var lat0 = this.lat;

// Compute prayer times for Aqrab al-Bilad corresponding t0 15 -- 18 degrees

// NOTE : 
// redefining 
// the latitude

	if(this.highLats.method[0] == 13 || this.highLats.method[1] == 13 || this.highLats.method[2] == 13){ 
// Aqrab at 45th latitude (MWL)
         this.lat = 45.;
	   aqrab[21] = this.computeAqrab(nighttime);
// alert('hej' + aqrab[21].Fajr);
	} else {

// 15deg depression
         this.lat = 51.;
	   aqrab[15] = this.computeAqrab(nighttime);

// 16deg depression
         this.lat = 50.;
	   aqrab[16] = this.computeAqrab(nighttime);

// 17deg depression
         this.lat = 49.;
	   aqrab[17] = this.computeAqrab(nighttime);

// 18deg depression
         this.lat = 48.;
	   aqrab[18] = this.computeAqrab(nighttime);
	}

      this.lat = lat0;

// Actual latitude restored 
// End NOTE.

	   var A = new Object;  
	   A = this.selectAqrab(aqrab);

	// method = 10: Use times at Aqrab location
         if(this.highLats.method[0] == 10 && aFajr ) times[1]  = A.Fajr;
         if(this.highLats.method[1] == 10 && aIsha1) times[8]  = A.Isha1;
         if(this.highLats.method[2] == 10 && aIsha2) times[10] = A.Isha2;

	// method = 11: Add time difference at Aqrab location - 
 	// 		   Note: This does not work at high latitudes
         if(this.highLats.method[0] == 11 && aFajr ) times[1]  = Shuruq  - A.dFajr;   
         if(this.highLats.method[1] == 11 && aIsha1) times[8]  = Maghrib + A.dIsha1;
         if(this.highLats.method[2] == 11 && aIsha2) times[10] = Maghrib + A.dIsha2;

	// method = 12: Add variable nightportion derived from Aqrab location
	// method = 13: Add variable nightportion derived from location at 45th latitude (MWL)

         if((this.highLats.method[0] == 12 || this.highLats.method[0] == 13) && aFajr ) times[1]  =  Shuruq  - A.dFajr*A.nquote3;
         if((this.highLats.method[1] == 12 || this.highLats.method[1] == 13) && aIsha1) times[8]  =  Maghrib + A.dIsha1*A.nquote1;
         if((this.highLats.method[2] == 12 || this.highLats.method[2] == 13) && aIsha2) times[10] =  Maghrib + A.dIsha2*A.nquote2;

//alert(new Array(Shuruq,A.dFajr,A.nquote3));

 
//alert(new Array(Maghrib, Shuruq, A.dIsha1, A.nquote1));
	return times;
}


PrayTime.prototype.computeAqrab = function(nighttime) {
// Compute parameters at aqrab latitude corresponding to given angle of depression

	var timesa;
	for (var i=1; i<=this.numIterations; i++)timesa = this.computeTimes(timesa);

   	var aqrab = new Object;

   	aqrab.Fajr      = timesa[0];
   	aqrab.Shuruq    = timesa[2];
   	aqrab.Maghrib   = timesa[6];
   	aqrab.Isha1     = timesa[7];
   	aqrab.Isha2     = timesa[9];
   	aqrab.dFajr     = this.timeDiff(aqrab.Fajr,aqrab.Shuruq);     // Fajr to sunrise at A
   	aqrab.dIsha1    = this.timeDiff(aqrab.Maghrib,aqrab.Isha1);   // sunset to Isha1 at A
   	aqrab.dIsha2    = this.timeDiff(aqrab.Maghrib,aqrab.Isha2);   // sunset to Isha2 at A
   	aqrab.nighttime = this.timeDiff(aqrab.Maghrib,aqrab.Shuruq);  // sunset to sunrise at A
   	aqrab.nquote    = nighttime/aqrab.nighttime;    				

   return aqrab;
}

PrayTime.prototype.selectAqrab = function(aqrab) 
// Determine which aqrab location to use
{  
   var A = new Object; 

// AB at 45th latitude (MWL)
   if(this.highLats.method[0] == 13 || this.highLats.method[1] == 13 || this.highLats.method[2] == 13) {
	   var iangle = 21;

    	   if(this.highLats.method[1] == 13) { 
    	   A.iangle3 = iangle;
    	   A.Isha1   = aqrab[iangle].Isha1; 
    	   A.dIsha1  = aqrab[iangle].dIsha1; 
    	   A.nquote1 = aqrab[iangle].nquote;
    	   }
    	   if(this.highLats.method[2] == 13) { 
    	   A.iangle4 = iangle;
    	   A.Isha2   = aqrab[iangle].Isha2; 
    	   A.dIsha2  = aqrab[iangle].dIsha2; 
    	   A.nquote2 = aqrab[iangle].nquote;
    	   }  
    	   if(this.highLats.method[0] == 13) { 
    	   A.iangle0 = iangle;
    	   A.Fajr    = aqrab[iangle].Fajr; 
    	   A.dFajr   = aqrab[iangle].dFajr; 
    	   A.nquote3 = aqrab[iangle].nquote;
    	   }
   } else {
// Determine which aqrab location to use based on depression angle of Fajr/Isha
   
	for(var iangle=15; iangle<=18; iangle++) {

    	   if(this.Angles[3] >= iangle) { 
    	   A.iangle3 = iangle;
    	   A.Isha1   = aqrab[iangle].Isha1; 
    	   A.dIsha1  = aqrab[iangle].dIsha1; 
    	   A.nquote1 = aqrab[iangle].nquote;
    	   }
    	   if(this.Angles[4] >= iangle) { 
    	   A.iangle4 = iangle;
    	   A.Isha2   = aqrab[iangle].Isha2; 
    	   A.dIsha2  = aqrab[iangle].dIsha2; 
    	   A.nquote2 = aqrab[iangle].nquote;
    	   }  
    	   if(this.Angles[0] >= iangle) { 
    	   A.iangle0 = iangle;
    	   A.Fajr    = aqrab[iangle].Fajr; 
    	   A.dFajr   = aqrab[iangle].dFajr; 
    	   A.nquote3 = aqrab[iangle].nquote;
    	   }
    	}
   }  
   return A;
}

//---------------------- Smoothing -----------------------------------

PrayTime.prototype.smoothTimes = function(times) 
// Smoothing algorithm
{
	//	Check if any taqdir was done
	if(this.highLats.method[0] == 0 && 
	   this.highLats.method[1] == 0 && 
	   this.highLats.method[2] == 0 ) return times;

	//	Establish condition for critical times
	this.setCritTimes(times);

	if (this.critFajr || this.critIsha1 || this.critIsha2) {

		if(this.critFajr  && this.highLats.smooth[0])times[1] = this.smooth(times[1],1,this.highLats.smooth[0]);
		if(this.critIsha1 && this.highLats.smooth[1])times[8] = this.smooth(times[8],8,this.highLats.smooth[1]);

		if(this.critIsha2 && this.highLats.smooth[2] && this.Angles[4]) {
			times[10] = this.smooth(times[10],10,this.highLats.smooth[2]);	
//			if(this.highLats.smooth[2] < 0) times = this.combineIshaTimes(times);			
		}
	}
	return times;
}

PrayTime.prototype.smooth = function(timefi,fi,ndays,alerts) 
// Smooth edges resulting from time estimates at high latitudes
{
   time = timefi;
// Check if there is progression in time
   if(this.signum(this.last.sequence) != 1) { // no time progression - reset flags
		this.backstep[fi] = false; 
		this.step[fi] = 0; 
		return time;
   } 

// Critical values
   var sdiff = new Array;
   var bdiff = new Array;
   var cgap = 0.5; // maximum tolerated gap
   var time = timefi;
   var lasttime = this.last.times[fi];


// Check for gap
// sdiff = Difference between smoothed (last saved) and original(present, non-smoothed) estimate 
   sdiff[fi] = time - lasttime;

   if(Math.abs(sdiff[fi]) > cgap && !this.backstep[fi]) { // there is a large gap
	if(this.JDate > 2455422)alert(new Array('! ',Math.floor(this.JDate))); // logic warning
	if(this.step[fi] == 0) { 
		this.gap[fi] = sdiff[fi]; this.step[fi] = this.gap[fi]/(Math.abs(ndays)+1); 
		if(alerts)alert('step1['+fi+']: ' + this.step[fi]);
	}

	// Update estimated time
	time = lasttime + this.step[fi];

// Time back?
   } else { // there is no large step - check for step
	
	if(!this.backstep[fi]) { // Check for step ahead

		this.computeTimes7(); // times 1 week ahead
		sdiff[fi] = time - this.times7[fi];
		if(Math.abs(sdiff[fi]) < cgap ) { // there is no step ahead
			this.backstep[fi] = false; this.gap[fi] = 0; 
			return time; 
		}
		// There is a step ahead	
		this.backstep[fi] = true;
		this.gap[fi] = sdiff[fi]; 
		this.step[fi] = this.gap[fi]/(Math.abs(ndays)+1);
		if(alerts)alert('back step1['+fi+'] : ' + this.step[fi]);
	}

	// Update estimated time
	time = lasttime - this.step[fi];
	
	// Don't exceed existing time
	if(fi < 3  && time < this.times7[fi])time = this.times7[fi]; // before Zhuhr
	if(fi > 3  && time > this.times7[fi])time = this.times7[fi]; // after Zhuhr
   }
   return time; 
}

//---------------------- Conclude time calculation -----------------------

PrayTime.prototype.combineIshaTimes = function(times) 
// Combine both Isha taqdirs if there are alternates
{
	if(!this.highLats.combi)return times;
	var combi;
	if(times[7] != times[8] && times[9] == times[10]) { 	// taqdir on first isha time only
		combi = times[9];						// existing second time 
	} else if(times[7] == times[8] && times[9] != times[10]) { 	// taqdir on second isha time only
		combi = times[7]; 						// existing first time 
	} else if(times[7] != times[8] && times[9] != times[10]) { 	// taqdir on both isha times
	   var combi = Math.min(times[8],times[10]);			// smallest of the two taqdirs
	}
//alert(new Array(times[8],times[10],combi));
	if(combi) {
	   if(!(times[7] != times[8] && times[9] != times[10])) { // both are not taqdirs
	      times[7] = combi; // modify actual times, since alternate exists
	      times[9] = combi;
	   } 
	   times[8]  = combi;
	   times[10] = combi;
	}	
//	alert('combining '+ times[8] + ' and ' + times[10]); 
	return times;
}

PrayTime.prototype.adjustTimeZone = function(times)
// Adjust time zone
{
	for (var i=0; i<times.length; i++)
	if(times[i])
	times[i] += this.timeZone- this.lng/ 15;
	return times;
}

PrayTime.prototype.saveLast = function(times) 
// Save previous times
{
	this.last.sequence  = Math.floor(this.JDate) - this.last.day;
	this.last.day = Math.floor(this.JDate);	

	for (var i=0; i<times.length; i++)	{
	this.last.trend[i]  = this.signum( times[i] - this.last.times[i] );
	this.last.times[i]  = times[i];
	}	 	
	return;
}


//====================== Calculation Functions =======================

// References:
// http://www.ummah.net/astronomy/saltime  
// http://aa.usno.navy.mil/faq/docs/SunApprox.html


// compute declination angle of sun and equation of time
PrayTime.prototype.sunPosition = function(jd)
{
	var D = jd - 2451545.0;
	var g = this.fixangle(357.529 + 0.98560028* D);
	var q = this.fixangle(280.459 + 0.98564736* D);
	var L = this.fixangle(q + 1.915* this.dsin(g) + 0.020* this.dsin(2*g));

	var R = 1.00014 - 0.01671* this.dcos(g) - 0.00014* this.dcos(2*g);
	var e = 23.439 - 0.00000036* D;

	var d = this.darcsin(this.dsin(e)* this.dsin(L));
	var RA = this.darctan2(this.dcos(e)* this.dsin(L), this.dcos(L))/ 15;
	RA = this.fixhour(RA);
	var EqT = q/15 - RA;

	return new Array(d, EqT);
}

// compute equation of time
PrayTime.prototype.equationOfTime = function(jd)
{
	return this.sunPosition(jd)[1];
}

// compute declination angle of sun
PrayTime.prototype.sunDeclination = function(jd)
{
	return this.sunPosition(jd)[0];
}

// compute mid-day (Dhuhr, Zawal) time
PrayTime.prototype.computeMidDay = function(t)
{
	var T = this.equationOfTime(this.JDate+ t);
	var Z = this.fixhour(12- T);
	return Z;
}

// compute time for a given angle G
PrayTime.prototype.computeTime = function(G, t)
{
	var D = this.sunDeclination(this.JDate+ t);
	var Z = this.computeMidDay(t);
	var V = 1/15* this.darccos((-this.dsin(G)- this.dsin(D)* this.dsin(this.lat)) / 
			(this.dcos(D)* this.dcos(this.lat)));

// alert('lat='+this.lat + ' G='+G + ' D='+D + ' Z='+Z + ' V='+V);
	return Z+ (G>90 ? -V : V);
}

// compute the time of Asr: Shafii: shadow=1, Hanafi: shadow=2
PrayTime.prototype.computeAsr = function(step, t)  
{
//  	var shadow = Math.abs(step);
    	var shadow = step;
         
	var D = this.sunDeclination(this.JDate+ t);
	var G = -this.darccot(shadow + this.dtan(Math.abs(this.lat-D)));

	return this.computeTime(G, t);
}


//---------------------- Julian Date Functions -----------------------


// calculate julian date from a calendar date
PrayTime.prototype.julianDate = function(year, month, day)
{
	if (month <= 2) 
	{
		year -= 1;
		month += 12;
	}
	var A = Math.floor(year/ 100);
	var B = 2- A+ Math.floor(A/ 4);

	var JD = Math.floor(365.25* (year+ 4716))+ Math.floor(30.6001* (month+ 1))+ day+ B- 1524.5;
	return JD;
}


// convert a calendar date to julian date (second method)
PrayTime.prototype.calcJD = function(year, month, day)
{
	var J1970 = 2440588.0;
	var date = new Date(year, month- 1, day);
	var ms = date.getTime();   // # of milliseconds since midnight Jan 1, 1970
	var days = Math.floor(ms/ (1000 * 60 * 60* 24)); 
	return J1970+ days- 0.5;
}


//---------------------- Time-Zone Functions -----------------------


// compute local time-zone for a specific date
PrayTime.prototype.getTimeZone = function(date) 
{
// Obs omställning till sommartid sker kl 3 på natten (i Sverige)
//	var localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
	var localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 3, 1, 0, 0);
	var GMTString = localDate.toGMTString();
	var GMTDate = new Date(GMTString.substring(0, GMTString.lastIndexOf(' ')- 1));
	var hoursDiff = (localDate- GMTDate) / (1000* 60* 60);
	return hoursDiff;
}


// compute base time-zone of the system
PrayTime.prototype.getBaseTimeZone = function() 
{
	return this.getTimeZone(new Date(2000, 0, 15))
}


// detect daylight saving in a given date
PrayTime.prototype.detectDaylightSaving = function(date) 
{
	return this.getTimeZone(date) != this.getBaseTimeZone();
}


// return effective timezone for a given date
PrayTime.prototype.effectiveTimeZone = function(year, month, day, timeZone)
{
	if (timeZone == null || typeof(timeZone) == 'undefined' || timeZone == 'auto')
		timeZone = this.getTimeZone(new Date(year, month- 1, day));
	return 1* timeZone;
}

//---------------------- Time format Functions -----------------------

PrayTime.prototype.setTimeFormat = function(timeFormat)
// set the time format 
{
	this.timeFormat = timeFormat;
}

PrayTime.prototype.floatToTime24 = function(time)
// convert float hours to 24h format
{
	if (isNaN(time))
		return this.InvalidTime;
	time = this.fixhour(time+ 0.5/ 60);  // add 0.5 minutes to round
	var hours = Math.floor(time); 
	var minutes = Math.floor((time- hours)* 60);
	return this.twoDigitsFormat(hours)+':'+ this.twoDigitsFormat(minutes);
}

PrayTime.prototype.floatToTime12 = function(time, noSuffix)
// convert float hours to 12h format
{
	if (isNaN(time))
		return this.InvalidTime;
	time = this.fixhour(time+ 0.5/ 60);  // add 0.5 minutes to round
	var hours = Math.floor(time); 
	var minutes = Math.floor((time- hours)* 60);
	var suffix = hours >= 12 ? ' pm' : ' am';
	hours = (hours+ 12 -1)% 12+ 1;
	return hours+':'+ this.twoDigitsFormat(minutes)+ (noSuffix ? '' : suffix);
}

PrayTime.prototype.floatToTime12NS = function(time)
// convert float hours to 12h format with no suffix
{
	return this.floatToTime12(time, true);
}

//------------------- Misc Functions -----------------------


// compute the difference between two times 
PrayTime.prototype.timeDiff = function(time1, time2)
{
	return this.fixhour(time2- time1);
}


// add a leading 0 if necessary
PrayTime.prototype.twoDigitsFormat = function(num)
{
	return (num <10) ? '0'+ num : num;
}

//---------------------- Trigonometric Functions -----------------------

// degree sin
PrayTime.prototype.dsin = function(d)
{
    return Math.sin(this.dtr(d));
}

// degree cos
PrayTime.prototype.dcos = function(d)
{
    return Math.cos(this.dtr(d));
}

// degree tan
PrayTime.prototype.dtan = function(d)
{
    return Math.tan(this.dtr(d));
}

// degree arcsin
PrayTime.prototype.darcsin = function(x)
{
    return this.rtd(Math.asin(x));
}

// degree arccos
PrayTime.prototype.darccos = function(x)
{
    return this.rtd(Math.acos(x));
}

// degree arctan
PrayTime.prototype.darctan = function(x)
{
    return this.rtd(Math.atan(x));
}

// degree arctan2
PrayTime.prototype.darctan2 = function(y, x)
{
    return this.rtd(Math.atan2(y, x));
}

// degree arccot
PrayTime.prototype.darccot = function(x)
{
    return this.rtd(Math.atan(1/x));
}

// degree to radian
PrayTime.prototype.dtr = function(d)
{
    return (d * Math.PI) / 180.0;
}

// radian to degree
PrayTime.prototype.rtd = function(r)
{
    return (r * 180.0) / Math.PI;
}

// range reduce angle in degrees.
PrayTime.prototype.fixangle = function(a)
{
	a = a - 360.0 * (Math.floor(a / 360.0));
	a = a < 0 ? a + 360.0 : a;
	return a;
}

// range reduce hours to 0..23
PrayTime.prototype.fixhour = function(a)
{
	a = a - 24.0 * (Math.floor(a / 24.0));
	a = a < 0 ? a + 24.0 : a;
	return a;
}

PrayTime.prototype.signum = function(input) 
{
	var sign;
	var number = parseFloat(input);
	if(number > 0) sign = 1;
	if(number < 0) sign = -1;
	if(number == 0) sign = 0;
	return sign;
}



//---------------------- prayTime Object -----------------------

var prayTime = new PrayTime();

/*
*/