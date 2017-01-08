// / is %2F, = is %3D, & is %26
document.addEventListener('DOMContentLoaded', bindButtons);

//Credit for this function goes to kmaida, https://gist.github.com/kmaida/6045266
function convertTimestamp(timestamp) {
  var d = new Date(timestamp * 1000),	// Convert the passed timestamp to milliseconds
		yyyy = d.getFullYear(),
		mm = ('0' + (d.getMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
		dd = ('0' + d.getDate()).slice(-2),			// Add leading 0.
		hh = d.getHours(),
		h = hh,
		min = ('0' + d.getMinutes()).slice(-2),		// Add leading 0.
		ampm = 'AM',
		time;
			
	if (hh > 12) {
		h = hh - 12;
		ampm = 'PM';
	} else if (hh === 12) {
		h = 12;
		ampm = 'PM';
	} else if (hh == 0) {
		h = 12;
	}
	
	// ie: 2013-02-18, 8:35 AM	
	time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;
		
	return time;
}

function currState(x) {
	switch (x) {
		case 0:
			return "Offline";
		case 1:
			return "Online";
		case 2:
			return "Busy";
		case 3:
			return "Away";
		case 4:
			return "Snooze";
		case 5:
			return "Looking to trade";
		case 6:
			return "Looking to play";
	}
	
}


function bindButtons() {
	
	document.getElementById("IDsubmit").addEventListener("click", function (event) {
		var req = new XMLHttpRequest();
		var ID = document.getElementById("IDinput").value;
		//var str1 = "b4key=ISteamUser/GetPlayerSummaries/v0002/";
		//var str2 = "&afterKey=steamids=";
		//url = url + 'steamID=' + ID;	//Working
		var url = 'http://flip3.engr.oregonstate.edu:51522?';
		url = url + 'b4key=ISteamUser%2FGetPlayerSummaries%2Fv0002%2F' + '&afterKey=%26steamids%3D' + ID;
		//url = url + str1 + str2 + ID;
		console.log(encodeURIComponent('&afterKey=steamids'));
		req.open("GET", url, true);
		req.addEventListener('load',function(){
			if(req.status >= 200 && req.status < 400){
				var response = JSON.parse(req.responseText);
				document.getElementById('profileName').textContent = response.response.players[0].personaname;
				document.getElementById('lastLogged').textContent = convertTimestamp(response.response.players[0].lastlogoff);
				document.getElementById('currentState').textContent = currState(response.response.players[0].personastate);
				console.log(response);
			} else {
        console.log("Error in network request: " + req.statusText);
		}
	  });
	  req.send(null);
	  event.preventDefault();
	});
}