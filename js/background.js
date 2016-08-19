var icons = {
	good : "icons/github-good.png",
	ex: "icons/github-ex.png",
	empty: "icons/empty_username.png",
	bad: "icons/github-danger.png"
}, userName, commits = 0,
	startDay,
	endDay,
	TIMER = 120000;

chrome.storage.sync.get(function(items) {
	if(!items.userName || items.userName == "") {
		chrome.browserAction.setIcon({path: {"16": icons.empty }});
		return;
	}
	userName = items.userName;
	startRequest();
	setInterval(function() {
		startRequest();
	}, TIMER);
});

function startRequest() {
	startDay = new Date();
	endDay = new Date();
	startDay.setHours(0);
	startDay.setMinutes(0);
	startDay.setSeconds(0);
	endDay.setHours(23);
	endDay.setMinutes(59);
	endDay.setSeconds(59);
	startDay = startDay.getTime();
	endDay = endDay.getTime();

	new Promise(function(resolve, reject) {
			getProjects(resolve)
		}).then(changeIcon);
	commits = 0;
}

function getProjects(resolve) {
	var projectNames = [];
	$.get("https://api.github.com/users/" + userName +  "/repos", function(data) {
		for(var i = 0, max = data.length; i < max; i+=1 ) {			
			projectNames.push(data[i].name);
		}
		getCommits(projectNames, resolve);
	});
}

function getCommits(projects, resolve) {
	if(projects.length < 1) return;
	var u = 0,
		max = projects.length;
	for(var i = 0; i <= max-1; i+=1) {
		$.get("https://api.github.com/repos/" + userName + "/" + projects[i] + "/commits",
			function(data) {
						console.log(data);
				commits += parseCommit(data);
				u += 1;
			});
		
	}
	var timerId = setInterval(function() {
	 	if(u == max) {
		 	resolve();
	 	}
	}, 50);
}

function parseCommit(commit) {
	var repCommit = 0;

	for(var i = 0, max = commit.length - 1; i <= max; i+=1) {
		var commiter = commit[i].commit.committer;
		if(commit[i].committer) {
			if(commit[i].committer.login == userName) {
				repCommit += parseInt(todayCommit(commiter.date));
			}
		}
	}
	
	return repCommit;	
}

function todayCommit(string) {
	var time = new Date(string);

	time = time.getTime();
	if(startDay <= time &&  time <= endDay) {
		return 1;
	}

	return 0;
}

function changeIcon() {
	if(commits == 0) {
		chrome.browserAction.setIcon({path: {"16": icons.bad }});
	}
	if(commits > 0) {
		chrome.browserAction.setIcon({path: {"16": icons.good }});
	}

	if(commits > 4) {
		chrome.browserAction.setIcon({path: {"16": icons.ex }});
	}
}

