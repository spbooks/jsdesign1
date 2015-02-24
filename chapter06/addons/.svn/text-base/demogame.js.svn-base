


//remember if we've found the object
var havefound = false;



//view change callback
function viewchange(x, y, dir, inst)
{
	//if we've already found the object, do nothing
	if(havefound) { return; }

	//if the found object element is currently present, remove it
	var obj = document.getElementById('foundobject');
	if(obj) { obj.parentNode.removeChild(obj); }

	//if we reach the end position
	if(x == 38 && dir == 0)
	{
		//standing in front of the object
		if(y == 2)
		{
			//get a reference to the dungeon view's parent element
			var parent = inst.dungeon.parentNode;

			//create the found object, inside the parent,
			//superimposed on top of everything else
			//(and so that in source order this will also come out after the caption)
			obj = parent.appendChild(inst.tools.createElement('p', {
					'id' : 'foundobject',
					'text' : 'Found object.'
					}));

			//move it to center position and show it
			obj.style.left = (parent.offsetWidth / 2) - (obj.offsetWidth / 2) + 'px';
			obj.style.top = (parent.offsetHeight / 2) - (obj.offsetHeight / 2) + 'px';
			obj.style.visibility = 'visible';

			//add to the captiontext
			var caption = inst.captiontext.appendChild(inst.tools.createElement('strong'));
			caption.appendChild(document.createTextNode(' There is an object in front of you.'));
		}

		//standing over the object (picking it up)
		else if(y == 0)
		{
			//add to the captiontext
			caption = inst.captiontext.appendChild(inst.tools.createElement('strong'));
			caption.appendChild(document.createTextNode(' You have picked up the object.'));

			//remember that we've found the object
			havefound = true;
		}
	}
}

