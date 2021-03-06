//https://stackoverflow.com/questions/247483/http-get-request-in-javascript
var HttpClient = function() {
	this.get = function(aUrl, aCallback) {
		var anHttpRequest = new XMLHttpRequest();
		anHttpRequest.onreadystatechange = function() { 
			if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
				aCallback(anHttpRequest.responseText);
		}

		anHttpRequest.open( "GET", aUrl, true );            
		anHttpRequest.send( null );
	}
}

if(document.URL.startsWith('https://lms.alphastar.academy/course/view.php')){
	console.log("LMSGrader assignment view");
	var client = new HttpClient();

	try {
		var weeks = document.body.lastElementChild.children[1].firstElementChild.firstElementChild.firstElementChild.children[1].children[2].children[2];
		
		var curInd = 0;
		var change = -1;
		try {
			for(; curInd+1 < weeks.children.length && new Date(weeks.children[curInd+1].children[3].children[1].children[0].children[1].innerText)<Date.now(); curInd++) {}
			console.log("Date found");
		} catch (e) {
			curInd = 0;
			change = 1;
			console.log("Could not find date");
		}
		
		for (var i = 0; i < weeks.children.length; i++, curInd = (curInd+weeks.children.length+change)%weeks.children.length) {
			var activities = weeks.children[curInd].children[3].children[3].children;
			for (var j = 0; j < activities.length; j++) {
				if(activities[j].className.startsWith('activity assign modtype_assign')){
					let activity = activities[j].children[0].children[0].children[1].children[0].children[0];
					let link = activity.href;
					client.get(link, function(response) {
						let index = response.indexOf('<td class="cell c0" style="">Needs grading</td>\n<td class="cell c1 lastcol" style="">');
						response = response.substring(index+85);
						let index2 = response.indexOf("</td>");
						response = response.substring(0, index2);
						if(response != 0){
							activity.innerHTML = '<style> strong{ color: red; }</style><strong>(' + response + ' to grade)</strong> ' + activity.innerHTML;
						}
					})
				}
			}
		}
	} catch (e) {
		console.log("Not a teacher")
	}
} else if (document.URL.startsWith('https://lms.alphastar.academy/mod/assign/view.php') && !document.URL.includes('grading')) {//If on assignment tab
	if (localStorage.autoOpen == "true") {
		console.log("Auto-open ungraded submissions");
		console.log("Type localStorage.autoOpen=false into console to disable auto opening of ungraded submissions");
		if (document.getElementsByClassName("cell c1 lastcol")[2].innerHTML != 0) {//If there are ungraded submissions
			localStorage.wasAutoOpened="true";//Set flag to auto-open from view all submissions tab
			window.open(document.getElementsByClassName("btn btn-secondary")[0].href, '_blank');//open view all submissions
		}
	} else {
		console.log("Type localStorage.autoOpen = true into console to enable auto opening of ungraded submissions");
	}
} else if (document.URL.startsWith('https://lms.alphastar.academy/mod/assign/view.php')){//If on view all submissions tab
	console.log("LMSGrader grading view");
	var users = document.getElementsByClassName("box boxaligncenter gradingtable")[0];
	users = users.children[users.children.length - 2].children[0].children[1];
	let toCheck = 0;
		
	for (var i = 0; i < users.children.length; i++) {
		let child = users.children[i];
		let dateSubmitted = child.children[8].textContent;
		let dateGraded = child.children[11].textContent;
		if (dateSubmitted !== '-' && (dateGraded === '-' || new Date(dateSubmitted) >= new Date(dateGraded))){
			child.children[6].children[0].className = 'btn btn-warning';
			let temp = users.children[toCheck].innerHTML;
			users.children[toCheck].innerHTML = users.children[i].innerHTML;
			users.children[i].innerHTML = temp;
			toCheck++;
		}
	}
	if (localStorage.wasAutoOpened == "true") { //If Auto Opened from Assignment tab
		var links = document.getElementsByClassName("btn btn-warning");//Get ungraded links
		for (var i = 0; i < links.length; i++) {//Open ungraded links
			window.open(links[i].href, '_blank');
		}
		localStorage.wasAutoOpened = "false";//Put flag down
		window.close();//Auto-close View all submissions tab
	}
}
