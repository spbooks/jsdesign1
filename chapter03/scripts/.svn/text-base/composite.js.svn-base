
window.onload = init;




function init()
{
	var compositions = ["source-over", "destination-over", "source-in", "destination-in", "source-out", "destination-out", "source-atop", "destination-atop", "lighter", "darker", "xor", "copy"]

	var radius = 25;
	
	for (var i = 0; i < compositions.length; i++)
	{
		var canvas = document.createElement("canvas");
		canvas.setAttribute("width", "110");
		canvas.setAttribute("height", "70");
		document.body.appendChild(canvas);
		
		var context = canvas.getContext("2d");

		context.globalCompositeOperation = "source-over";
		context.beginPath();
		context.arc(radius + 10, radius + 10, radius, 0, Math.PI * 2, true);
		context.fillStyle = "#FF0000";
		context.fill();
		
		context.globalCompositeOperation = compositions[i];
		context.beginPath();
		context.arc(radius * 2.5 + 10, radius + 10, radius, 0, Math.PI * 2, true);
		context.fillStyle = "#00CC00";
		context.fill();		
	}
};