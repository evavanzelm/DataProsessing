/* use this to test out your function */
window.onload = function() {
	changeColor("nl", "#ff9999");
	changeColor("be", "#ff4d4d");
	changeColor("ita", "ff4d4d");
	changeColor("gr", "b3fff0");
 	// changeColor();
}

/* changeColor takes a path ID and a color (hex value)
   and changes that path's fill color */
function changeColor(id, color) {
        var country = document.getElementById(id);
		country.style.fill = color;
}


