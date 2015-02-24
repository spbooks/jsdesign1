
window.onload = init;




function init()
{
	var data = [Math.random() * 100, Math.random() * 100,  Math.random() * 100,  Math.random() * 100,  Math.random() * 100,  Math.random() * 100];
	var data2 = [Math.random() * 100, Math.random() * 100,  Math.random() * 100,  Math.random() * 100,  Math.random() * 100,  Math.random() * 100];
	
	setTimeout(function()
		{
			new RingChart(data2, 180, 50);
			new RingChart(data, 110, 50);
		},
		1
	);
};




function RingChart(data, outerRadius, width)
{
	this.data = data;
	this.outerRadius = outerRadius;
	this.width = width;
	
	this.canvasWidth = 400;
	this.canvasHeight = 400;
	this.startColor = [204, 0, 0];
	this.endColor = [115, 12, 243];

	this.canvas = document.getElementById("chart");
	
	if (typeof this.canvas.getContext != "undefined")
	{
		this.context = this.canvas.getContext("2d");
		this.context.lineWidth = 1;
		this.context.strokeStyle = "#000000";
		
		this.draw();
	}
	else
	{
		alert("Your browser does not support <canvas>");
	}
}




RingChart.prototype.draw = function()
{
	var cx = this.canvasWidth / 2;
	var cy = this.canvasHeight / 2;
	
	var dataTotal = 0;
	
	for (var i = 0; i < this.data.length; i++)
	{
		dataTotal +=  this.data[i];
	}
	
	var dataSubTotal = 0;
	
	for (var i = 0; i < this.data.length; i++)
	{
		var red = Math.round(this.startColor[0] - ((this.startColor[0] - this.endColor[0]) / (this.data.length - 1) * i));
		var green = Math.round(this.startColor[1] - ((this.startColor[1] - this.endColor[1]) / (this.data.length - 1) * i));
		var blue = Math.round(this.startColor[2] - ((this.startColor[2] - this.endColor[2]) / (this.data.length - 1) * i));

		this.context.fillStyle = "rgb(" + red + "," + green + "," + blue + ")";

		this.context.beginPath();
		this.context.moveTo(cx, cy);
		this.context.arc(cx, cy, this.outerRadius, dataSubTotal / dataTotal * Math.PI * 2, (dataSubTotal + this.data[i]) / dataTotal * Math.PI * 2, false);
		this.context.closePath();
		this.context.fill();
		
		this.context.beginPath();
		this.context.moveTo(cx, cy);
		this.context.arc(cx, cy, this.outerRadius, dataSubTotal / dataTotal * Math.PI * 2, (dataSubTotal + this.data[i]) / dataTotal * Math.PI * 2, false);
		this.context.closePath();
		this.context.stroke();
		
		dataSubTotal += this.data[i];
	}
	
	this.context.globalCompositeOperation = "destination-out";

	this.context.beginPath();
	this.context.arc(cx, cy, this.outerRadius - this.width, 0, Math.PI * 2, false);
	this.context.fill();
	this.context.closePath();

	this.context.globalCompositeOperation = "source-over";
	
	this.context.beginPath();
	this.context.arc(cx, cy, this.outerRadius - this.width, 0, Math.PI * 2, false);
	this.context.stroke();
	this.context.closePath();
};




function clearCanvas(canvasId)
{
	var canvas = document.getElementById(canvasId);
	
	if (canvas != null && typeof canvas.getContext != "undefined")
	{
		canvas.getContext("2d").clearRect(0, 0, canvas.getAttribute("width"), canvas.getAttribute("height"));
	}
};