/*
 *
 * Geocoding Autocomplete class v0.0.1
 * Class by Rezart Muco.
 * https://github.com/rezartmuco/
 * Free to use under the MIT License.
 *
 */

var autocomplete = (function(settings){


     var apikey=settings.key;

      var container = settings.input;
      var userAgent = navigator.userAgent;
      var mobileFirefox = userAgent.indexOf("Firefox") !== -1 && userAgent.indexOf("Mobile") !== -1;
      var keyUpEventName = mobileFirefox ? "input" : "keyup";
      var items = [];
      var inputValue = "";
      var minLen = 1;

      var selected=-1;
      var keypressCounter = 0;

      var randomprefix=Math.floor(Math.random() * 100);

      var autocompleteinputid='autocomp'+randomprefix;
      var autocompleteinput;

      var closebtnid='closebtn'+randomprefix;
      var closebtn;

      var loadingimageid='loadingimage'+randomprefix;

      var dropdownid='dropdownmenu'+randomprefix;



      var itemtemplate=settings.itemtemplate;
      var debouncetimer;
      var debouncethreshold;


      settings.key==null?apikey='test':apikey=settings.key;
      settings.debouncethreshold==null?debouncethreshold=350:debouncethreshold=debouncethreshold;

      itemtemplate==null?itemtemplate='<a class="list-group-item list-group-item-action flex-column align-items-start"> {{geocodeaddr}} </a>':itemtemplate=itemtemplate;  




      let keydownEventHandler=function(e){
         
        if(e.keyCode==38){
           if(selected>0) selected=--selected % items.length;
           moveinlist(selected);
        }

        if(e.keyCode==40){
          selected=++selected % items.length;
          moveinlist(selected);
        }


     	if(e.keyCode!=8 && e.keyCode!=38 && e.keyCode!=40){

      	inputValue+=String.fromCharCode(e.keyCode);

      	if(inputValue.length>=minLen){
          if (debouncetimer!=null ) clearTimeout(debouncetimer);
          debouncetimer=setTimeout(function(){ 
            makereq(inputValue);
            
          },
           debouncethreshold);
      	 }else{
      		hideclosebuton();
      	 }

       }

       if(e.keyCode==8){ //backspace
        autocompleteinput=document.getElementById(autocompleteinputid);
        inputValue=autocompleteinput.value;

         if (debouncetimer!=null ) clearTimeout(debouncetimer);
          debouncetimer=setTimeout(function(){ 
            makereq(inputValue);
          },
           debouncethreshold);

        if(autocompleteinput.value.length>=minLen){
          showdropdownmenu();
          showloadingimage();
        }else{
          hideloadingimage();
          hidedropdownmenu();
          hideclosebuton();
        }
       }

      
      }//keyhandler


   //html Constructor
   var inputhtml='\
    <div class="input-group">\
			<span class="input-group-append bg-white border-left-0">\
	            <span class="input-group-text bg-transparent">\
	                <img height="24px" src="/geocoderAutocompleteJs-main/img/geocodelogo.svg" id="loadingimage'+randomprefix+'"/>\
	            </span>\
	        </span>\
			\
	        <input class="form-control border-right-0" id="autocomp'+randomprefix+'">\
	        <span id="'+closebtnid+'_container" style="display:none;" class="input-group-append bg-white border-left-0">\
	            <span class="input-group-text bg-transparent">\
	                <img id="closebtn'+randomprefix+'" height="24px" src="/geocoderAutocompleteJs-main/img/geocodelogo.svg"/>\
	            </span>\
	        </span>\
		\
    	</div>\
    	\
    	<div id="dropdownmenu'+randomprefix+'" class="list-group" style="margin-top:1%;display:none;">\
	    \
	    </div>';

   //container.remove();   
   
   container.parentNode.insertAdjacentHTML('beforeend',inputhtml);
    container.remove();

   var input=document.getElementById(autocompleteinputid);
   input.addEventListener(keyUpEventName, keydownEventHandler);

   closebtn=document.getElementById(closebtnid);

   closebtn.addEventListener("click", function(){ 
    if (debouncetimer!=null ) clearTimeout(debouncetimer);
    input.value='';
    hidedropdownmenu();
    hideclosebuton();
   });


   function makereq(val){
   	var xmlhttp = new XMLHttpRequest();
	  var url = "https://geocoder.ca/?autocomplete=1&auth="+apikey+"&locate="+val+"&json=1";
	
    showloadingimage();

	xmlhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
			showdropdownmenu();
      hideloadingimage();
      items=[];
      
          var listhtml="";
	        var myArr = JSON.parse(this.responseText);

	        var listcontainer=document.getElementById(dropdownid);
	        listcontainer.innerHTML='';
          if(myArr.streets.street!=undefined){

          if(myArr.streets.street.length<=15){
          
	        for(i in myArr.streets.street){
            items.push(myArr.streets.street[i]);
            listhtml+=parsemicrotemplate(itemtemplate,myArr.streets.street[i]);
            }
           }else{
            items.push(myArr.streets.street);
            listhtml+=parsemicrotemplate(itemtemplate,myArr.streets.street);
           }
	         showclosebuton();
           }else{
           hideclosebuton(); 
           }


          selected=-1;
	        listcontainer.insertAdjacentHTML('beforeend',listhtml);
	    }
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
  }


//--private
function parsemicrotemplate(planhtml,val){
  var r=planhtml.replaceAll("{{geocodeaddr}}",val);
  return r;
}

function moveinlist(sel){
  var itemlist = document.getElementsByClassName("list-group-item-action");
  for (i = 0; i < itemlist.length; i++) {
    itemlist[i].classList.remove("active");
  }
   itemlist[sel].classList.add("active");
}


function showclosebuton(){
  document.getElementById(closebtnid).src = "/geocoderAutocompleteJs-main/img/close.png";
  document.getElementById(closebtnid+"_container").style.display = "block";
}


function hideclosebuton(){
    document.getElementById(closebtnid).src = "/geocoderAutocompleteJs-main/img/close.png";
    document.getElementById(closebtnid+"_container").style.display = "none";
}

function showloadingimage(){
  document.getElementById(loadingimageid).src = "/geocoderAutocompleteJs-main/img/loading.gif";
}

function hideloadingimage(){
  document.getElementById(loadingimageid).src = "/geocoderAutocompleteJs-main/img/geocodelogo.svg";
}

function showdropdownmenu(){
  document.getElementById(dropdownid).style.display="block";
}

function hidedropdownmenu(){
  document.getElementById(dropdownid).style.display="none";
}


})//end class


