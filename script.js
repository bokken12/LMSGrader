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

	var weeks = document.body.lastElementChild.children[1].firstElementChild.firstElementChild.firstElementChild.children[1].children[2].children[2];
	for (var i = 0; i < weeks.children.length; i++) {
		var activities = weeks.children[i].children[3].children[3].children;
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
} else if (document.URL.startsWith('https://lms.alphastar.academy/mod/assign/view.php')){
	console.log("LMSGrader grading view");
	var users = document.getElementsByClassName("box boxaligncenter gradingtable")[0];
	users = users.children[users.children.length - 2].children[0].children[1];
	let toCheck = 0;
	console.log(users.children);
	for (var i = 0; i < users.children.length; i++) {
		let child = users.children[i];
		let dateSubmitted = child.children[8].textContent;
		let dateGraded = child.children[11].textContent;
		if(dateSubmitted !== '-' && (dateGraded === '-' || new Date(dateSubmitted) >= new Date(dateGraded))){
			child.children[6].children[0].className = 'btn btn-warning';
			let temp = users.children[toCheck].innerHTML;
			users.children[toCheck].innerHTML = users.children[i].innerHTML;
			users.children[i].innerHTML = temp;
			toCheck++;
		}
	}
	
	if(localStorage.autoOpen=="true") {
		console.log("Auto-open ungraded submissions");
		console.log("Type localStorage.autoOpen=false into console to disable auto opening of ungraded submissions");
		var links = document.links;
		for (var i = 0; i < links.length; i++) {
			if(links[i].className=='btn btn-warning') {
				window.open(links[i].href, '_blank');
			}
		}
	}
	else {
		console.log("Type localStorage.autoOpen=true into console to enable auto opening of ungraded submissions");
	}
}
