function getQueryVariable(variable,qlocation) {
  var qloc;
  if(qlocation)qloc = qlocation; 
  else qloc = window.location;
//alert(qloc);

  var query = qloc.search.substring(1);
//var query = window.location.search.substring(1);
//alert(new Array(query,variable));

  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
//     alert(pair[0] + '=' + pair[1]); 
       return pair[1];
     }
  }
  //alert('Query Variable ' + variable + ' not found'); 
  return null;
}

//    Now make a request to page.html?x=Hello
//    alert( getQueryVariable("x") );

