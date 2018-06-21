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

var client = new HttpClient();

var weeks = document.body.lastElementChild.children[1].firstElementChild.firstElementChild.firstElementChild.children[1].children[2].children[2];
for (var i = 0; i < weeks.children.length; i++) {
  var activities = weeks.children[i].children[3].children[3].children;
  for (var j = 0; j < activities.length; j++) {
    if(activities[j].className.startsWith("activity assign modtype_assign")){
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
