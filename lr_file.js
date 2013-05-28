/* only maps */
function load_maps() {  
	// obtain input element through DOM 
	var file = document.getElementById("load_mapfile").files[0];
	if(file){
		get_as_text(file, mapfile_loaded);
	}
}

function save_maps() {
	var maps = collect_maps();
	var mapsBlob = new Blob([JSON.stringify(maps)]);
	saveAs(mapsBlob, "maps.lrmaps");
}

function mapfile_loaded(evt) {  
	// Obtain the read file data    
	var fileString = evt.target.result;

	var maps = JSON.parse(fileString);
	var domShortNames = document.getElementsByName("map_short[]");
	var domLongNames = document.getElementsByName("map_long[]");
	for (var i = 0; i < domShortNames.length; i++) {
		domShortNames[i].value = maps[i]["name"];
		domLongNames[i].value = maps[i]["namev"];
	}

	gsl_update();
}

/* everything */
function load_everything() {  
	// obtain input element through DOM 
	var file = document.getElementById("load_everything").files[0];
	if (file) {
		get_as_text(file, everything_file_loaded);
	}
}

function save_everything() {
	var everything = new Object();
	everything.template = document.getElementById("template_input").value;
	everything.maps = collect_maps();
	everything.players = collect_players();
	everything.series = new Object();
	everything.series.initial_1 = series_details("initial_1");
	everything.series.initial_2 = series_details("initial_2");
	everything.series.winners = series_details("winners");
	everything.series.losers = series_details("losers");
	everything.series.final = series_details("final");

	var everythingBlob = new Blob([JSON.stringify(everything)]);
	saveAs(everythingBlob, "everything.lrgsl");
}

function everything_file_loaded(evt) {  
	// Obtain the read file data    
	var fileString = evt.target.result;

	var everything = JSON.parse(fileString);

	// template
	document.getElementById("template_input").value = everything.template;

	// maps
	var maps = everything.maps;
	var domShortNames = document.getElementsByName("map_short[]");
	var domLongNames = document.getElementsByName("map_long[]");
	for (var i = 0; i < domShortNames.length; i++) {
		domShortNames[i].value = maps[i]["name"];
		domLongNames[i].value = maps[i]["namev"];
	}

	update_map_dropdown(everything.maps);

	// players
	var players = everything.players;
	domShortNames = document.getElementsByName("player_short[]");
	domLongNames = document.getElementsByName("player_long[]");
	for (var i = 0; i < domShortNames.length; i++) {
		domShortNames[i].value = players[i]["name"];
		domLongNames[i].value = players[i]["namev"];
	}

	fillin_series("initial_1", everything.series.initial_1);
	fillin_series("initial_2", everything.series.initial_2);
	fillin_series("winners", everything.series.winners);
	fillin_series("losers", everything.series.losers);
	fillin_series("final", everything.series.final);

	gsl_update();
}

function fillin_series(prefix, details) {
	for (var i = 1; i <= SERIES_SIZE; i++) {
		var iter_prefix = prefix + "_" + i.toString();

		// map
		var domMap = iter_prefix + "_map";
		var mapIdx = details[i].map != null ? details[i].map+1 : 0;
		document.getElementById(domMap).options.selectedIndex = mapIdx;

		// outcome
		var domScore = iter_prefix + "_score";
		var domScoreOption = document.getElementById(domScore).options;
		if (details[i].not_needed) {
			domScoreOption.selectedIndex = DROPDOWN_NOT_NEEDED;
		} else if (details[i].winner == 1) {
			domScoreOption.selectedIndex = DROPDOWN_WIN_R;
		} else if (details[i].winner == -1) {
			domScoreOption.selectedIndex = DROPDOWN_WIN_L;
		} else {
			domScoreOption.selectedIndex = DROPDOWN_UNDECIDED;
		}

		// live report
		var domReport = iter_prefix + "_report";
		document.getElementById(domReport).value = details[i].report;

		var domNoReport = iter_prefix + "_noreport";
		document.getElementById(domNoReport).checked = details[i].noreport;

		// recommended?
		var domShow = iter_prefix + "_showpoll";
		document.getElementById(domShow).checked = details[i].showpoll;
		var domPoll = iter_prefix + "_poll";
		document.getElementById(domPoll).value = details[i].poll;
	}
}

function get_as_text(readFile, loaded) {
	var reader = new FileReader();
  
	// Read file into memory      
	reader.readAsText(readFile);
  
	// Handle progress, success, and errors
	reader.onprogress = update_progress;
	reader.onload = loaded;
	reader.onerror = error_handler;
}

function update_progress(evt) {
	if (evt.lengthComputable) {
		// evt.loaded and evt.total are ProgressEvent properties
		var loaded = (evt.loaded / evt.total);
		if (loaded < 1) {
			// Increase the prog bar length
			// style.width = (loaded * 200) + "px";
		}
	}
}

function error_handler(evt) {
	if(evt.target.error.name == "NotReadableError") {
		// The file could not be read
	}
}


