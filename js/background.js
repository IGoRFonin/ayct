var icons = {
	good : "icons/github-good.png",
	ex: "icons/github-ex.png",
	empty: "icons/empty_username.png"
}, userName;

chrome.storage.sync.get(function(items) {
	if(!items.userName || items.userName == "") {
		chrome.browserAction.setIcon({path: {"16": icons.empty }});
		return;
	}
	userName = items.userName;
	getCommits();
});

function getCommits() {
	var projectNames = [];
	$.get("https://api.github.com/users/" + userName +  "/repos", function(data) {
		for(var i = 0, max = data.length; i < max; i+=1 ) {			
			projectNames.push(data[i].name);
		}
		console.log(projectNames);
	});
}

// $.get()

// chrome.browserAction.setIcon({path: {"16":"icons/github-ex.png"}});

