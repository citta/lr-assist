function toggle_setup() {
	if (document.getElementById("setup_area").style.display != "none") {
		document.getElementById("setup_area").style.display="none";
		document.getElementById("toggle_setup_link").innerHTML = "[expand]";
	} else {
		document.getElementById("setup_area").style.display="block";
		document.getElementById("toggle_setup_link").innerHTML = "[hide]";
	}
}
