// get the data from weather.html and split on new line
var data = document.getElementById("rawdata").value;
var split = data.split(/\n/);

// split the datapoint into 2 array; dates and temp
var dates = [];
var temp = [];
var domain_temp = [];
var min_temp = 0;
var max_temp = 0;

for (i = 0; i < split.length; i++){
	// split array by ,
	var data_point = split[i].split(",");

	// append dates and temps to array
	dates[i] = new Date(data_point[0].replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"));
	temp.push(parseInt(data_point[1]));

	// getting the max and minimum temp
	if (temp[i] < min_temp){
		min_temp = temp[i];
	}
	else if (temp[i] > max_temp){
		max_temp = temp[i];
	}
	
}

// function for the transformations
function createTransform(domain, range){
	// calculating alpha and beta
 		var alpha = ((range[1] - range[0])/ (domain[1] - domain[0]));
	var beta = range[1] - (alpha * domain[1]);
	
	//returning the function
	return function(x){
		return alpha * x + beta;
	};
}

// variable screensize
var boundry = 100
var y_length = 500
var x_length = 900

// transform the y measurments temperature
var range_yscreen = [y_length, 0];
var domain_temp = [min_temp, max_temp];
var transform_y = createTransform(domain_temp, range_yscreen);
var temp_trans = [];
for (i = 0; i < temp.length; i++){
	temp_trans.push(boundry + transform_y(temp[i]));
}

// transform the x measurements date
var range_xscreen = [0, x_length];
var domain_dates = [0, dates.length];
var transform_x = createTransform(domain_dates, range_xscreen);
var dates_trans = [];
var start_date = dates[0].getTime()
for (i = 0; i < dates.length; i++){
	dates_trans.push((dates[i].getTime() - start_date) / 86400000);
}
for (i = 0; i < dates.length; i++){
	dates_trans[i] = boundry + transform_x(dates_trans[i]);
}

// make canvas
var canvas = document.getElementById('mycanvas');
var ctx = canvas.getContext('2d');

// get edge of canvas
ctx.strokeRect(0, 0, x_length + (2 * boundry), y_length + (2 * boundry));

// draw line
for (i = 1; i < dates.length; i++){
	ctx.beginPath();
	ctx.strokeStyle = 'black';
	ctx.moveTo(dates_trans[i - 1], temp_trans[i - 1]);
	ctx.lineTo(dates_trans[i], temp_trans[i]);
	ctx.stroke();
}

// drawing y axis 
var begin_yaxis = -50
var end_yaxis = max_temp - (max_temp % 50) + 50 

// axis title
ctx.font = "16px Arial";
ctx.textAlign = "center";
ctx.fillText("Time (months)", x_length / 2 + boundry, y_length + (boundry * 2) -15);

// drawing the y axis
ctx.beginPath();
ctx.strokeStyle = 'black';
ctx.moveTo(boundry, transform_y(begin_yaxis) + boundry);
ctx.lineTo(boundry, transform_y(end_yaxis) + boundry);
ctx.stroke();

// adding the texts
for (i = begin_yaxis ; i <= end_yaxis; i = i + 50){

	// text
	ctx.font = "12px Arial";
	ctx.fillText(i / 10, 50, transform_y(i) + boundry);

	// streeljes
	ctx.beginPath();
	ctx.strokeStyle = 'black';
	ctx.moveTo(boundry - 10, transform_y(i) + boundry);
	ctx.lineTo(boundry, transform_y(i) + boundry);
	ctx.stroke();
}

// corresponding months for numbers
var month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";

// drawing y axis 
var begin_xaxis = 1
var end_xaxis = dates.length

// drawing the axis
ctx.beginPath();
ctx.strokeStyle = 'black';
ctx.moveTo(transform_x(begin_xaxis) + boundry, transform_y(begin_yaxis) + boundry);
ctx.lineTo(transform_x(end_xaxis) + boundry, transform_y(begin_yaxis) + boundry);
ctx.stroke();

// adding the texts
for (i = 15; i <= dates.length; i = i + 30){

	// text
	ctx.font = "12px Arial";
	ctx.textAlign = "center";
	ctx.fillText(month[dates[i].getMonth()], transform_x(i) + boundry, transform_y(begin_yaxis) + boundry + 20);

	// streeljes
	ctx.beginPath();
	ctx.strokeStyle = 'black';
	ctx.moveTo(transform_x(i) + boundry, transform_y(begin_yaxis) + boundry);
	ctx.lineTo(transform_x(i) + boundry, transform_y(begin_yaxis) + boundry + 10);
	ctx.stroke();
}

// drawing dashed line for 0 point
ctx.beginPath();
ctx.strokeStyle = 'grey';
ctx.setLineDash([6]);
ctx.moveTo(transform_x(begin_xaxis) + boundry, transform_y(0) + boundry);
ctx.lineTo(transform_x(end_xaxis) + boundry, transform_y(0) + boundry);
ctx.stroke();


// axis title
ctx.font = "16px Arial";
ctx.rotate( Math.PI / - 2 );
ctx.textAlign = "center";
ctx.fillText("Daily average temperature (\xB0C)",- boundry - y_length / 2, 30);

// make second canvas
var crosshair = document.getElementById('crosshair');
var ctx2 = crosshair.getContext('2d');

// function to find x and y position mouse
function mousemove(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

// add event listener for mouse movement to canvas
crosshair.addEventListener('mousemove', function(evt){

	// clear canvas
	ctx2.clearRect(0, 0, crosshair.width, crosshair.height);

	// get x y position
	var mousePos = mousemove(canvas, evt);

	// get the temp for the current x
	var inv_transform_x = createTransform(range_xscreen, domain_dates);
	var current_x = mousePos.x - boundry;

	var current_date = parseInt(inv_transform_x(current_x));
	var current_yPos = transform_y(temp[current_date - 1]) + boundry;

	if (mousePos.x > boundry & mousePos.x < crosshair.width - boundry){
		// draw circels
		for (var i = 5; i <= 10; i *= 2){
			ctx2.beginPath();
			ctx2.arc(mousePos.x, current_yPos, i, 0, 2 * Math.PI, false);
			ctx2.lineWidth = 2;
		   	ctx2.strokeStyle = 'grey';
		    ctx2.stroke();

		// draw y line
		ctx2.beginPath();
		ctx2.strokeStyle = 'grey';
		ctx2.moveTo(boundry, current_yPos);
		ctx2.lineTo(crosshair.width - boundry, current_yPos);
		ctx2.stroke();

		// draw x line
		ctx2.beginPath();
		ctx2.strokeStyle = 'grey';
		ctx2.moveTo(mousePos.x, transform_y(end_yaxis) + boundry);
		ctx2.lineTo(mousePos.x, transform_y(begin_yaxis) + boundry);
		ctx2.stroke();

		// current day
		var day = dates[current_date - 1].getUTCDate() + "/" + dates[current_date - 1].getMonth() + "/" + dates[current_date - 1].getFullYear();

		// text
		ctx2.font = "14px Arial";
		ctx2.textAlign = "left";
		ctx2.fillText("Temp: " + temp[current_date] / 10 + "(\xB0C)", crosshair.width - 250, boundry);
		ctx2.fillText("Day:    " + day, crosshair.width - 250, boundry + 20);

		}

	}

	

}, false);

// clear canvas
ctx2.clearRect(0, 0, crosshair.width, crosshair.height);





