
window.onload = init;




function init()
{
	var canvas = document.getElementById("drawing");

	if (typeof canvas.getContext != "undefined")
	{
		var context = canvas.getContext("2d");

		context.beginPath();
		context.moveTo(150, 100);
		context.lineTo(200, 225);
		context.lineTo(250, 100);
		context.fillStyle = "#D3BEA5";
		context.fill();

		context.beginPath();
		context.moveTo(150, 100);
		context.lineTo(200, 225);
		context.lineTo(250, 100);
		context.stroke();

		context.beginPath();
		context.arc(200, 100, 50, 0, Math.PI, true);
		context.lineTo(160, 100);
		context.bezierCurveTo(170, 100, 180, 110, 180, 120);
		context.bezierCurveTo(180, 125, 172, 140, 185, 140);
		context.bezierCurveTo(198, 140, 190, 125, 190, 120);
		context.bezierCurveTo(190, 110, 200, 100, 210, 100);
		context.fillStyle = "#FB6CF9";
		context.fill();
		
		context.beginPath();
		context.arc(200, 100, 50, 0, Math.PI, true);
		context.lineTo(160, 100);
		context.bezierCurveTo(170, 100, 180, 110, 180, 120);
		context.bezierCurveTo(180, 125, 172, 140, 185, 140);
		context.bezierCurveTo(198, 140, 190, 125, 190, 120);
		context.bezierCurveTo(190, 110, 200, 100, 210, 100);
		context.closePath();
		context.stroke();
	}
};