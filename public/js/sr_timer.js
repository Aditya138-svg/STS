
var interval;
var defaultTimeInSeconds = 60 * 60 * 1; //1 hours
// var defaultTimeInSeconds = 3; //2 hours

function init_time(){
    sessionStorage.setItem('is_auto_stop', false);

	if(sessionStorage.getItem("counter")){
      if(sessionStorage.getItem("counter") <= 0){
        var timeInSeconds = defaultTimeInSeconds;
      }else{
        var timeInSeconds = sessionStorage.getItem("counter");
      }
    }else{
      var timeInSeconds = defaultTimeInSeconds;
    }
	return timeInSeconds; 
}

function removesessionStorage(name){
	sessionStorage.removeItem(name);
}

function clearAllsessionStorage(){
	sessionStorage.clear();
}

function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    // var hDisplay = h > 0 ? h + (h == 1 ? " Hour: " : " Hours: ") : "";
    // var mDisplay = m > 0 ? m + (m == 1 ? " Min: " : " Min: ") : "";
    // var sDisplay = s > 0 ? s + (s == 1 ? " Sec" : " Sec") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " <div class='smalltext'>Hour </div>" : "<div class='smalltext'> Hours </div>") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " <div class='smalltext'>Min </div>" : "<div class='smalltext'> Min </div>") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " <div class='smalltext'>Sec</div>" : "<div class='smalltext'> Sec</div>") : "";
    if(hDisplay != ""){
        hDisplay = '<div><span class="hours">'+hDisplay+'</span></div>';
    }
    if(mDisplay != ""){
        mDisplay = '<div><span class="minutes">'+mDisplay+'</span></div>';
    }
    if(sDisplay != ""){
        sDisplay = '<div><span class="seconds">'+sDisplay+'</span></div>';
    }
    return hDisplay + mDisplay + sDisplay; 
}

function clearTimer(){
	clearAllsessionStorage();
	clearInterval(interval);
}

function stopTimer(){
    // clearAllsessionStorage();
	clearInterval(interval);
}

function displayTimer(timehms){
    $("#time_spent").val(timehms);
	var hms = secondsToHms(timehms);
	document.getElementById('divCounter').innerHTML = hms;
}

function autoStop(){

    $(".btn_continue_only").hide();
    click_btns('stop');
    if ($("#cookieTimerAudio")[0]){
    	setTimeout(function() {
    		$("#cookieTimerAudio")[0].play();
    	}, 10);
    }
    sessionStorage.setItem('is_auto_stop', true);
    clearTimer();
}

function startTimer(){
	var counter = function (){
		// console.log('timeInSeconds in counter: '+timeInSeconds);
	    if(timeInSeconds <= 0){
	        // sessionStorage.setItem("counter", defaultTimeInSeconds);
	        // timeInSeconds = defaultTimeInSeconds;
	        autoStop();
	    }else{
	        timeInSeconds = parseInt(timeInSeconds)-1;
	        sessionStorage.setItem("counter", timeInSeconds);
	    }
	    displayTimer(timeInSeconds);
    };

    interval = setInterval(function (){counter();}, 1000);
}
