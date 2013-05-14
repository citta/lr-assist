// Constants
var DROPDOWN_UNDECIDED = 0;
var DROPDOWN_WIN_L = 1;
var DROPDOWN_WIN_R = 2;
var DROPDOWN_NOT_NEEDED = 3;

var SERIES_SIZE = 3;
var SERIES_MAJORITY = 2;


/**
 * TYPES
 * 
 * Player
 * + name {string} short name
 * + namev {string} verbose name (e.g. TLPD'd name)
 *
 * Map
 * + name {string} short name
 * + namev {string} verbose name (e.g. link to the map)
 *
 * SeriesPlayer
 * + left {index} index of the left player in the player list
 * + right {index} index of the right player in the player list
 * 
 * SubmatchDetail
 * + map {index} index of the map in the map list
 * + not_needed {bool} is the submatch needed?
 * + winner {left-or-right} winner or null, if undecided
 * + poll {string} recommended poll for the submatch
 * + report {string} link to live report for the submatch
 * + noreport {bool} should the LR link be striked through?
 *  
 */

/**
 * Replaces every occurence of pattern in str with replacement.
 * 
 * @param {string} str The string in which the replacements occur
 * @param {string} pattern The pattern to be replaced
 * @param {string} replacement The replacement
 */
function greplace(str, pattern, replacement) {
	return str.replace(new RegExp(pattern, "g"), replacement)
}

/**
 * Surrounds the string content with the bbcode-style tag.
 * 
 * @param {string} content The content to be surrounded
 * @param {string} tag The tag name (without the square brackets)
 */
function surround(content, tag) {
	return "[" + tag + "]" + content + "[/" + tag + "]";
}

/**
 * Reads players from the input fields.
 *
 * @return {Player[]} the players read
 */
function collect_players() {
	var domShortNames = document.getElementsByName("player_short[]");
	var domLongNames = document.getElementsByName("player_long[]");
	var players = new Array();
	for (var i = 0; i < domShortNames.length; i++) {
		players[i] = new Array();
		players[i]["name"] = domShortNames[i].value;
		players[i]["namev"] = domLongNames[i].value;
	}
	return players;
}

/**
 * Reads maps from the input fields.
 *
 * @return {Map[]} the maps read
 */
function collect_maps() {
	var domShortNames = document.getElementsByName("map_short[]");
	var domLongNames = document.getElementsByName("map_long[]");
	var maps = new Array();
	for (var i = 0; i < domShortNames.length; i++) {
		maps[i] = new Array();
		maps[i]["name"] = domShortNames[i].value;
		maps[i]["namev"] = domLongNames[i].value;
	}
	return maps;
}

/**
 * Writes maps into the dropdown menus that lets you select the map. These menus
 * are named "select_map".
 * 
 * @param {Map[]} maps The maps that will be options of the dropdown menu
 */
function update_map_dropdown(maps) {
	var dropdowns = document.getElementsByName("select_map");
	for (var i=0; i < dropdowns.length; i++) {
		var preservedIdx = dropdowns[i].selectedIndex;
		if (preservedIdx == -1)
			preservedIdx = 0;

		// clear existing dropdown
		while (dropdowns[i].hasChildNodes()) {
			dropdowns[i].removeChild(dropdowns[i].firstChild);
		}

		// add new options
		var defaultOption = document.createElement("option");
		defaultOption.innerHTML = "Unknown";
		dropdowns[i].appendChild(defaultOption);

		for (var j = 0; j < maps.length; j++) {
			var node = document.createElement("option");
			node.innerHTML = maps[j]["name"];
			dropdowns[i].appendChild(node);
		}
		
		// if preservedIdx is not in range, selectedIdx will be set to -1
		dropdowns[i].selectedIndex = preservedIdx;
	}
}

/**
 * Writes players into the match table of the series prefixed by prefix.
 *
 * @param {Player[]} players player list
 * @param {string} prefix The series prefix
 * @param {SeriesPlayer} participants The participants of the series
 */
function label_players(players, prefix, participants) {
	for (var i = 1; i <= SERIES_SIZE; i++) {
		var id_prefix = prefix + "_" + i.toString();
		if (participants["left"] != null) {
			var label = players[participants["left"]]["name"];
			document.getElementById(id_prefix + "_left").innerHTML = label;
		}
		if (participants["right"] != null) {
			var label = players[participants["right"]]["name"];
			document.getElementById(id_prefix + "_right").innerHTML = label;
		}
	}
}

/**
 * Reads from the score input the outcome of the series prefixed with prefix.
 *
 * @param {string} prefix The series prefix
 * @return {left-or-right} -1 if left player won, 1 if right player won, 0 if undecided
 */
function decide_outcome(prefix) {
	var left_cnt = 0;
	var right_cnt = 0;

	for (var i = 1; i <= SERIES_SIZE; i++) {
		var domName = prefix + "_" + i.toString() + "_score";
		var idx = document.getElementById(domName).options.selectedIndex;

		if (idx == DROPDOWN_WIN_L)
			left_cnt += 1;
		else if (idx == DROPDOWN_WIN_R)
			right_cnt += 1;
	}

	if (left_cnt >= SERIES_MAJORITY)
		return -1;
	else if (right_cnt >= SERIES_MAJORITY)
		return 1;
	else
		return 0;
}

/**
 * Reads from the score input the score of the loser of the series prefixed with prefix.
 *
 * @param {string} prefix The series prefix
 * @return {number} number of maps won by the loser
 */
function loser_score(prefix) {
	var left_cnt = 0;
	var right_cnt = 0;

	for (var i = 1; i <= SERIES_SIZE; i++) {
		var domName = prefix + "_" + i.toString() + "_score";
		var idx = document.getElementById(domName).options.selectedIndex;

		if (idx == DROPDOWN_WIN_L)
			left_cnt += 1;
		else if (idx == DROPDOWN_WIN_R)
			right_cnt += 1;
	}

	if (left_cnt >= SERIES_MAJORITY)
		return right_cnt;
	else if (right_cnt >= SERIES_MAJORITY)
		return left_cnt;
	else
		return "X";	
}

/**
 * Returns the submatch details of the series prefixed by prefix.
 * 
 * @param {string} prefix The series prefix
 * @return {SubmatchDetail[]} The details of each submatch of the series
 */
function series_details(prefix) {
	var details = new Array();

	for (var i = 1; i <= SERIES_SIZE; i++) {
		details[i] = new Array();

		var iter_prefix = prefix + "_" + i.toString();

		// map
		var domMap = iter_prefix + "_map";
		var mapIdx = document.getElementById(domMap).options.selectedIndex;
		details[i]["map"] = (mapIdx < 1) ? null : (mapIdx - 1);

		// outcome
		var domScore = iter_prefix + "_score";
		var scoreIdx = document.getElementById(domScore).options.selectedIndex;
		details[i]["not_needed"] = false;
		var winner = 0;
		if (scoreIdx == DROPDOWN_WIN_L)
			winner = -1;
		else if (scoreIdx == DROPDOWN_WIN_R)
			winner = 1;
		else if (scoreIdx == DROPDOWN_NOT_NEEDED)
			details[i]["not_needed"] = true;
		details[i]["winner"] = winner;

		// live report
		var domReport = iter_prefix + "_report";
		details[i]["report"] = document.getElementById(domReport).value;

		var domNoReport = iter_prefix + "_noreport";
		details[i]["noreport"] = document.getElementById(domNoReport).checked;

		// recommended?
		var domShow = iter_prefix + "_showpoll";
		var show = document.getElementById(domShow).checked;
		var domPoll = iter_prefix + "_poll";
		details[i]["poll"] = show ? document.getElementById(domPoll).value : "";
	}

	return details;
}

/**
 * Returns the player index of the winner.
 *
 * @param {left-or-right} outcome The outcome
 * @param {SeriesPlayer} participants The participants of the series
 * @return player number of winner or null, if winner undecided
 */
function ext_winner(outcome, participants) {
	if (outcome == -1)
		return participants["left"];
	else if (outcome == 1)
		return participants["right"];
	else
		return null;
}

/**
 * Returns the player index of the loser.
 * 
 * @param {left-or-right} outcome The outcome
 * @param {SeriesPlayer} participants The participants of the series
 * @return player number of loser or null, if loser undecided
 */
function ext_loser(outcome, participants) {
	if (outcome == 1)
		return participants["left"];
	else if (outcome == -1)
		return participants["right"];
	else
		return null;
}

/**
 * Replaces the placeholders for a series with the corresponding values.
 *
 * @param players {Player[]} the player list
 * @param maps {Map[]} the map list
 * @param series {SeriesPlayer} players participating in the series
 * @param details {SubmatchDetail[]} the submatch details of the series
 * @param prefix {string} The series prefix
 * @param str {string} string to be processed
 */
function series_replace(players, maps, series, details, prefix, str) {
	var left = (series["left"] != null) ? players[series["left"]]["name"] : "";
	var right = (series["right"] != null) ? players[series["right"]]["name"] : "";
	var leftv = (series["left"] != null) ? players[series["left"]]["namev"] : "";
	var rightv = (series["right"] != null) ? players[series["right"]]["namev"] : "";
	str = greplace(str, "{" + prefix + "_left}", left);
	str = greplace(str, "{" + prefix + "_right}", right);

	for (var i = 1; i <= SERIES_SIZE; i++) {
		var my_prefix = "{" + prefix + "_" + i.toString();

		var sub_left = leftv;
		var sub_right = rightv;
		if (details[i]["winner"] == -1)
			sub_left = surround(sub_left, "b");
		else if (details[i]["winner"] == 1)
			sub_right = surround(sub_right, "b");
		else if (details[i]["not_needed"]) {
			sub_left = surround(sub_left, "s");
			sub_right = surround(sub_right, "s");
		}

		str = greplace(str, my_prefix + "_leftv}", sub_left);
		str = greplace(str, my_prefix + "_rightv}", sub_right);

		var mapv = (details[i]["map"] != null) ? maps[details[i]["map"]]["namev"] : "";
		str = greplace(str, my_prefix + "_mapv}", mapv);

		str = greplace(str, my_prefix + "_report}", details[i]["report"]);
		str = greplace(str, my_prefix + "_poll}", details[i]["poll"]);

		var noreport_beg = details[i]["noreport"] ? "[s]" : "";
		var noreport_end = details[i]["noreport"] ? "[/s]" : "";

		str = greplace(str, my_prefix + "_noreport_begin}", noreport_beg);
		str = greplace(str, my_prefix + "_noreport_end}", noreport_end);
	}

	var winner = ext_winner(decide_outcome(prefix), series);
	var winner_label = (winner == null) ? "X" : players[winner]["namev"];
	str = greplace(str, "{" + prefix + "_winner}", winner_label);
	str = greplace(str, "{" + prefix + "_ls}", loser_score(prefix));

	return str;
}

/**
 * Replaces the placeholders for advancing players with the names of the
 * advancing players.
 *
 * @param {string} str string to be processed
 * @param {Player[]} players player list
 * @param {SeriesPlayer[]} matches participating players in the matches
 */
function gsl_advance_replace(str, players, matches) {
	var advance_left = matches["advance"]["left"];
	var advance_left_label = (advance_left == null) ? "X" : players[advance_left]["namev"];

	var advance_right = matches["advance"]["right"];
	var advance_right_label = (advance_right == null) ? "X" : players[advance_right]["namev"];

	str = greplace(str, "{advance_1}", advance_left_label);
	str = greplace(str, "{advance_2}", advance_right_label);

	return str;
}

/**
 * Outputs the processed template from "template_input" to "print_output".
 *
 * @param {Map[]} maps map list
 * @param {Player[]} players player list
 * @param {SeriesPlayer[]} matches participating players in the matches
 */
function gsl_template_replace(maps, players, matches) {
	var input_template = document.getElementById("template_input").value;
	var transf = input_template;
	transf = series_replace(players, maps, matches["initial_1"], series_details("initial_1"), "initial_1", transf);
	transf = series_replace(players, maps, matches["initial_2"], series_details("initial_2"), "initial_2", transf);
	transf = series_replace(players, maps, matches["winners"], series_details("winners"), "winners", transf);
	transf = series_replace(players, maps, matches["losers"], series_details("losers"), "losers", transf);
	transf = series_replace(players, maps, matches["final"], series_details("final"), "final", transf);

	transf = gsl_advance_replace(transf, players, matches);

	document.getElementById("print_output").value = transf;
}

/**
 * Returns the participating players of matches played out in the GSL-styled
 * groups as far as they can be inferred from the scores hitherto.
 * 
 * @return {SeriesPlayer[]} participating players in the matches
 */
function gsl_players_to_matches() {
	// determine who is playing which matches
	var matches = new Array();

	var initial_1 = new Array();
	var initial_2 = new Array();
	var winners = new Array();
	var losers = new Array();
	var final = new Array();
	var advance = new Array();
	var outcome;

	initial_1["left"] = 0;
	initial_1["right"] = 1;
	initial_2["left"] = 2;
	initial_2["right"] = 3;

	outcome = decide_outcome("initial_1");
	winners["left"] = ext_winner(outcome, initial_1);
	losers["left"] = ext_loser(outcome, initial_1);

	outcome = decide_outcome("initial_2");
	winners["right"] = ext_winner(outcome, initial_2);
	losers["right"] = ext_loser(outcome, initial_2);

	outcome = decide_outcome("winners");
	advance["left"] = ext_winner(outcome, winners);
	final["left"] = ext_loser(outcome, winners);

	final["right"] = ext_winner(decide_outcome("losers"), losers);

	advance["right"] = ext_winner(decide_outcome("final"), final);

	matches["initial_1"] = initial_1;
	matches["initial_2"] = initial_2;
	matches["winners"] = winners;
	matches["losers"] = losers;
	matches["final"] = final;
	matches["advance"] = advance;

	return matches;
}

/**
 * Updates the input mask and output according to all input provided so far.
 */
function gsl_update() {
	var players = collect_players();
	var maps = collect_maps();
	var matches = gsl_players_to_matches();	

	update_map_dropdown(maps);
	
	label_players(players, "initial_1", matches["initial_1"]);
	label_players(players, "initial_2", matches["initial_2"]);
	label_players(players, "winners", matches["winners"]);
	label_players(players, "losers", matches["losers"]);
	label_players(players, "final", matches["final"]);

	gsl_template_replace(maps, players, matches);
}
