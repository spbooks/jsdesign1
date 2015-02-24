


//DungeonView object constructor
function DungeonView(floorplan, start, lang, viewcallback)
{
	//get a reference to the dungeon viewer
	//and don't continue if it' doesn't exist
	this.dungeon = document.getElementById('dungeon');
	if(!this.dungeon) { return; }

	//instantiate the tools object and save the reference
	this.tools = new Tools();

	//instantiate the config object and save the reference
	this.config = new DungeonConfig();

	//save the floorplan data
	this.floorplan = floorplan;

	//save the start position, and round values to even
	this.start = start;
	for(var i=0; i<2; i++)
	{
		if(this.start[i] / 2 != Math.round(this.start[i] / 2)) { this.start[i]--; }
	}

	//save the language data
	this.lang = lang;

	//if a view callback function is specified, save the reference
	//otherwise record it as null
	this.viewcallback = typeof viewcallback == 'function' ? viewcallback : null;

	//brick class names
	this.bricknames = ['top', 'upper', 'middle', 'lower'];

	//create a grid object for storing column div and brick span objects
	this.grid = {};

	//create an array for storing the current view in the floorplan
	//storing the x,y co-ordinate and the view direction
	this.currentview = [0, 0, 0];

	//get a reference to the captiontext element
	this.captiontext = document.getElementById('captiontext');



	//create the dungeon view
	this.createDungeonView();



	//get a reference to the map element
	this.map = document.getElementById('map');

	//create a matrix for storing its squares
	this.mapsquares = [];

	//create the map view
	this.createMapView();



	//bind events to the controller form
	this.bindControllerEvents();



	//try to apply the default dungeon view (the start position)
	//and if we fail show an alert
	if(!this.applyDungeonView(this.start[0], this.start[1], this.start[2]))
	{
		alert('INPUT ERROR: Start position [' + this.start[0] + ',' + this.start[1] + ',' + this.start[2] + '] is inside a wall.');
	}
};





//create the dungeon view
DungeonView.prototype.createDungeonView = function()
{
	//create the center strip element and append it to the dungeon
	//this is the back wall in the middle of the dungeon view
	var strip = this.tools.createElement('div', { 'class' : 'column C' });
	this.grid['C'] = this.dungeon.appendChild(strip);

	//run through column creation twice
	//creating one set from the left and one set from the right
	for(var k=0; k<2; k++)
	{
		//the column classid direction token is "L" or "R"
		var classid = k == 0 ? 'L' : 'R';

		//create the column divs and store their references
		for(var i=0; i<this.config.gridsize[0]; i++)
		{
			//create a column div with the correct class names
			var div = this.tools.createElement('div', { 'class' : 'column ' + classid + ' ' + classid + i });

			//append it to the dungeon view and save the reference
			this.grid[classid + i] = { 'column' : this.dungeon.appendChild(div) };

			//create the necessary brick spans inside this grid
			//and store their references to the same object member
			for(var j=0; j<this.config.gridsize[1]; j++)
			{
				//create the main span
				var span = this.tools.createElement('span', { 'class' : 'brick ' + this.bricknames[j] });

				//if this is the upper or lower brick
				if(j == 1 || j == 3)
				{
					//add another blank span inside it
					var innerspan = span.appendChild(this.tools.createElement('span'));
				}

				//append it to the column div and save the reference
				this.grid[classid + i][this.bricknames[j]] = div.appendChild(span);
			}
		}
	}

	//now reset the view to default
	this.resetDungeonView();
};






//reset the dungeon view
//by applying all the necessary default style properties
DungeonView.prototype.resetDungeonView = function()
{
	//for each set of columns
	for(var k=0; k<2; k++)
	{
		//the dimensions of the space in the previous column
		//used for measuring the space needed for the next one
		this.lastsize = [0, 0];

		//copy the bricksize values to local array
		var bricksize = [this.config.bricksize[0], this.config.bricksize[1]];

		//copy the wallcolor values to local array
		var wallcolor = [this.config.wallcolor[0], this.config.wallcolor[1], this.config.wallcolor[2]];

		//the column classid direction token is "L" or "R"
		var classid = k == 0 ? 'L' : 'R';

		//for each column in the group
		for(var i=0; i<this.config.gridsize[0]; i++)
		{
			//darken the wallcolor slightly, rounding the values
			//(because firefox insists on rounded values)
			for(var j=0; j<3; j++) { wallcolor[j] = Math.round(wallcolor[j] * this.config.darkener); }

			//iterate through the first-child span elements in this column
			//we know that they're first-child because we created them (with no whitespace)
			var spans = this.grid[classid + i].column.childNodes;
			for(var n=0; n<spans.length; n++)
			{
				//create a shortcut references to this span
				var span = spans[n];

				//if this is the upper or lower brick, we also have an inner span
				if(n == 1 || n == 3) { var innerspan = span.firstChild; }

				//apply style properties according to brick
				switch(this.bricknames[n])
				{
					//top brick (roof rectangle)
					case 'top' :

						//dimensions
						span.style.height = this.lastsize[1] + 'px';

						break;

					//upper brick (top diagonal)
					case 'upper' :

						//add current height to lastsize height
						this.lastsize[1] += bricksize[1];

						//display
						span.style.display = 'block';

						//dimensions
						span.style.height = bricksize[1] + 'px';

						//inner position
						innerspan.style.left = (k == 0 ? 0 - bricksize[0] : 0) + 'px';
						innerspan.style.top = (0 - bricksize[1]) + 'px';

						//inner clip
						innerspan.style.clip = 'rect('
							+ (bricksize[1]) + 'px, '
							+ ((k == 0 ? 2 : 1) * bricksize[0]) + 'px, '
							+ (2 * bricksize[1]) + 'px, '
							+ (k == 0 ? bricksize[0] : 0) + 'px)';

						//inner border size
						innerspan.style.borderWidth = bricksize[1] + 'px ' + bricksize[0] + 'px';

						//wall collor is inner border-bottom color
						innerspan.style.borderBottomColor = 'rgb(' + wallcolor[0] + ',' + wallcolor[1] + ',' + wallcolor[2] + ')';

						break;

					//middle brick (middle rectangle)
					case 'middle' :

						//dimensions
						span.style.height = (this.config.viewsize[1] - (this.lastsize[1] * 2)) + 'px';

						//wall color is background color
						//which is stored in a custom wallcolor attribute
						//so that we can easily retrieve it later
						span.setAttribute('wallcolor', wallcolor[0] + ',' + wallcolor[1] + ',' + wallcolor[2]);
						span.style.backgroundColor = 'rgb(' + span.getAttribute('wallcolor') + ')';

						break;

					//lower brick (bottom diagonal)
					case 'lower' :

						//display
						span.style.display = 'block';

						//dimensions
						span.style.height = bricksize[1] + 'px';

						//inner position
						innerspan.style.left = (k == 0 ? 0 - bricksize[0] : 0) + 'px';
						innerspan.style.top = '0';

						//inner clip
						innerspan.style.clip = 'rect('
							+ '0, '
							+ ((k == 0 ? 2 : 1) * bricksize[0]) + 'px, '
							+ (bricksize[1]) + 'px, '
							+ (k == 0 ? bricksize[0] : 0) + 'px)';

						//inner border size
						innerspan.style.borderWidth = bricksize[1] + 'px ' + bricksize[0] + 'px';

						//wall collor is inner border-top color
						innerspan.style.borderTopColor = 'rgb(' + wallcolor[0] + ',' + wallcolor[1] + ',' + wallcolor[2] + ')';

						break;
				}
			}

			//add current column width to lastsize width
			this.lastsize[0] += bricksize[0];

			//set the column width
			this.grid[classid + i].column.style.width = bricksize[0] + 'px';

			//decrease the bricksize proportionately
			//to corresond with the output view perspective
			for(j=0; j<2; j++) { bricksize[j] *= this.config.multiplier; }
		}
	}

	//set the final height and position of the center strip
	//using the last residual values for lastsize
	//but subtract 1 from the applied top position to sand off residual rounding errors
	this.grid['C'].style.height = (this.config.viewsize[1] - (this.lastsize[1] * 2)) + 'px';
	this.grid['C'].style.top = -1 - (this.grid['C'].offsetHeight / 2) + 'px';

	//apply the residual background color to the strip
	//so that it takes on the same color as the two farthest pieces
	this.grid['C'].style.background = 'rgb(' + wallcolor[0] + ',' + wallcolor[1] + ',' + wallcolor[2] + ')';

	//clear the view caption
	this.clearViewCaption();
};






//apply a floorplan view to the dungeon
//from a given x,y co-ordinate and view direction
DungeonView.prototype.applyDungeonView = function(x, y, dir)
{
	//first try to check if the x and y position is inside a wall
	//which we do by checking the floorplan values, looking in,
	//from each of the four squares surrounding this position
	//and if it is inside a wall, return false for failure
	try
	{
		if(this.floorplan[y][x].charAt(1) == '0' && this.floorplan[y][x].charAt(2) == '0'
			&& this.floorplan[y][x + 1].charAt(2) == '0' && this.floorplan[y][x + 1].charAt(3) == '0'
			&& this.floorplan[y + 1][x].charAt(0) == '0' && this.floorplan[y + 1][x].charAt(1) == '0'
			&& this.floorplan[y + 1][x + 1].charAt(0) == '0' && this.floorplan[y + 1][x + 1].charAt(3) == '0')
		{
			return false;
		}
	}
	//or if that fails (for example, if the start position
	//refers to a point that doesn't exist in the matrix)
	//also return false for failure
	catch(err)
	{
		return false;
	}

	//we need a matrix of squares in two arrays
	//containing the data we need to represent this view
	//where the index starts from the current position forwards
	//and each array length is the dungeon column viewsize
	this.squares = { 'L' : [], 'R' : [] };

	//switch by view direction
	//to get the data for each left and right square
	switch(dir)
	{
		//north
		case 0 :

			//starting from the y co-ordinate,
			//run backwards through the floorplan rows
			for(var i=y; i>=0; i--)
			{
				//don't count more than the horizontal grid size (view column depth)
				if(this.squares.L.length <= this.config.gridsize[0]);
				{
					//save the floorplan data unmodified
					this.squares.L[y - i] = this.floorplan[i][x];
					this.squares.R[y - i] = this.floorplan[i][x + 1];
				}
			}

			break;

		//east
		case 1 :

			//starting with the square past the x co-ordinate
			//run forwards through the columns in this floorplan row
			for(i=(x + 1); i<this.floorplan[y].length; i++)
			{
				//don't count more than the horizontal grid size (view column depth)
				if(this.squares.L.length <= this.config.gridsize[0]);
				{
					//shift the characters in the floorplan data, one character to the left
					this.squares.L[i - (x + 1)] = this.shiftCharacters(this.floorplan[y][i], 1);
					this.squares.R[i - (x + 1)] = this.shiftCharacters(this.floorplan[y + 1][i], 1);
				}
			}

			break;

		//south
		case 2 :

			//starting with the square past the y co-ordinate
			//run forwards through the floorplan rows
			for(i=(y + 1); i<this.floorplan.length; i++)
			{
				//don't count more than the horizontal grid size (view column depth)
				if(this.squares.L.length <= this.config.gridsize[0]);
				{
					//shift the characters in the floorplan data, two characters to the left
					this.squares.L[i - (y + 1)] = this.shiftCharacters(this.floorplan[i][x + 1], 2);
					this.squares.R[i - (y + 1)] = this.shiftCharacters(this.floorplan[i][x], 2);
				}
			}

			break;

		//west
		case 3 :

			//starting from the x co-ordinate
			//run backwards through the columns in this floorplan row
			for(i=x; i>=0; i--)
			{
				//don't count more than the horizontal grid size (view column depth)
				if(this.squares.L.length <= this.config.gridsize[0]);
				{
					//shift the characters in the floorplan data, three characters to the left
					this.squares.L[x - i] = this.shiftCharacters(this.floorplan[y + 1][i], 3);
					this.squares.R[x - i] = this.shiftCharacters(this.floorplan[y][i], 3);
				}
			}

			break;
	}



	//reset the dungeon view
	this.resetDungeonView();




	//we need to remember the last square to which the corridor extends
	//for when the corridor stops earlier than the end of the view
	//by deafult, this is length of a this.squares array
	var end = this.config.gridsize[0] - 1;


	//now for each array in the column object
	for(var c=0; c<2; c++)
	{
		//the object reference token
		var token = c == 0 ? 'L' : 'R';

		//the side character for testing a side wall
		//is 3 (left) for the left column or 1 (right) for the right column
		var side = c == 0 ? 3 : 1;

		//first look for the end wall by examining the first (upper) digit of each square value
		//and as soon as it's zero, the next item is the end wall
		//and so are all the others until the end of this group of columns
		for(i=0; i<this.squares[token].length; i++)
		{
			if(this.squares[token][i].charAt(0) == '0')
			{
				for(var j=(i + 1); j<this.config.gridsize[0]; j++)
				{
					//increase the width of the top piece to compensate for loss of angle pieces
					this.grid[token + j].top.style.height = j == (i + 1)
						? (this.grid[token + j].top.offsetHeight) + 'px'
						: this.grid[token + (j - 1)].top.offsetHeight + 'px';

					//increase the height of the middle piece as well
					//we increase on all of them, not just contiguous ones
					//because this is a closing wall, not an opening
					this.grid[token + j].middle.style.height = (this.grid[token + (j - 1)].middle.offsetHeight) + 'px';

					//lighten the piece for facing highlight
					if(j == (i + 1))
					{
						var background = this.grid[token + j].middle.getAttribute('wallcolor').split(',');
						for(var k=0; k<3; k++) { background[k] = Math.round(parseInt(background[k], 10) * this.config.lightener); }
					}
					this.grid[token + j].middle.style.background = 'rgb(' + background[0] + ',' + background[1] + ',' + background[2] + ')';

					//hide the angle pieces
					this.grid[token + j].upper.style.display = 'none';
					this.grid[token + j].lower.style.display = 'none';
				}

				//remember this end square
				end = i;

				//if this is the first iteration (because we only need to do this once)
				if(c == 0)
				{
					//increase the height of the center strip
					//adjust its top position accordingly
					//and apply the background color
					this.grid['C'].style.height = this.grid[token + i].middle.offsetHeight + 'px';
					this.grid['C'].style.top = -1 - (this.grid['C'].offsetHeight / 2) + 'px';
					this.grid['C'].style.background = 'rgb(' + background[0] + ',' + background[1] + ',' + background[2] + ')';
				}

				break;
			}
		}

		//now starting from the last floor space (established above)
		//work backwards through the array to create passageways
		//we need to examine the side digit of each square value
		for(i=end; i>=0; i--)
		{
			if(this.squares[token][i].charAt(side) == '1')
			{
				//increase the height of the top piece to compensate for loss of angle pieces
				this.grid[token + i].top.style.height = (this.grid[token + i].top.offsetHeight + this.grid[token + i].upper.offsetHeight) + 'px';

				//lighten the piece for facing highlight
				var background = this.grid['L' + i].middle.getAttribute('wallcolor').split(',');
				for(k=0; k<3; k++) { background[k] = Math.round(parseInt(background[k], 10) * this.config.lightener); }
				this.grid[token + i].middle.style.background = 'rgb(' + background[0] + ',' + background[1] + ',' + background[2] + ')';

				//hide the angle pieces
				this.grid[token + i].upper.style.display = 'none';
				this.grid[token + i].lower.style.display = 'none';

				//while there are contiguous this.squares,
				//apply the same dimensions to them for continuation
				while(i>0 && this.squares[token][i - 1].charAt(side) == '1')
				{
					//increase the height of the top piece to correspond with the adjacent column
					this.grid[token + (i - 1)].top.style.height = this.grid[token + i].top.offsetHeight + 'px';

					//increase the height of the middle piece as well
					this.grid[token + (i - 1)].middle.style.height = (this.grid[token + i].middle.offsetHeight) + 'px';

					//lighten the piece for facing highlight
					this.grid[token + (i - 1)].middle.style.background = 'rgb(' + background[0] + ',' + background[1] + ',' + background[2] + ')';

					//hide the angle pieces
					this.grid[token + (i - 1)].upper.style.display = 'none';
					this.grid[token + (i - 1)].lower.style.display = 'none';

					//decrease i accordingly
					i--;
				}
			}
		}
	}


	//set the center strip background to the same color as the end piece
	this.grid['C'].style.background = this.grid['L' + (this.config.gridsize[0] - 1)].middle.style.background;




	//apply this position to the map view
	this.applyMapView();



	//generate the caption for this view
	//passing the end value we saved earlier
	this.generateViewCaption(end);




	//store the position values to the current view array
	this.currentview = [x, y, dir];

	//update the dungeon view controls if we have them
	if(this.controller['x']) { this.controller['x'].selectedIndex = x / 2; }
	if(this.controller['y']) { this.controller['y'].selectedIndex = y / 2; }
	if(this.controller['dir']) { this.controller['dir'].selectedIndex = dir; }



	//if we have a view callback function
	//call it with the new position and direction
	//and a reference to this instance
	if(this.viewcallback !== null)
	{
		this.viewcallback(x, y, dir, this);
	}


	//if we get this far then all was well
	//so return true for success
	return true;
};






//create the map view
DungeonView.prototype.createMapView = function()
{
	//create as many rows as the grid size (column depth)
	for(var i=0; i<this.config.gridsize[0]; i++)
	{
		//create this member of the mapsquares array
		this.mapsquares[i] = [];

		//create six squares in each row
		//two each to the left and right to show where the passages are,
		//and two in the center for your forward view
		for(var j=0; j<6; j++)
		{
			//create the square and append it to the map
			//saving the reference in the mapsquares array
			this.mapsquares[i][j] = this.map.appendChild(this.tools.createElement('span'));
		}
	}

	//now reset the map view
	this.resetMapView();
};





//reset the map view
DungeonView.prototype.resetMapView = function()
{
	//iterate through the mapsquares rows and squares
	for(var i=0; i<this.mapsquares.length; i++)
	{
		for(var j=0; j<6; j++)
		{
			//reset the background to base wallcolor
			this.mapsquares[i][j].style.background = 'rgb(' + this.config.wallcolor[0] + ',' + this.config.wallcolor[1] + ',' + this.config.wallcolor[2] + ')';
		}
	}
};





//apply a position to the map view
DungeonView.prototype.applyMapView = function()
{
	//reset the map view
	this.resetMapView();

	//iterate through the squares collection
	for(var i=0; i<this.squares.L.length; i++)
	{
		//de-highlight those squares which are floor space
		//including the immediate two squares behind you as well,
		//because they're not included in the squares collections
		//but they would be in your peripheral vision
		var n = this.mapsquares.length - 2 - i;
		if(this.mapsquares[n])
		{
			if(this.squares.L[i].charAt(3) == '1')
			{
				this.mapsquares[n][0].style.background = 'transparent';
				this.mapsquares[n][1].style.background = 'transparent';
				if(i == 0)
				{
					this.mapsquares[n + 1][0].style.background = 'transparent';
					this.mapsquares[n + 1][1].style.background = 'transparent';
				}
			}

			if(this.squares.R[i].charAt(1) == '1')
			{
				this.mapsquares[n][4].style.background = 'transparent';
				this.mapsquares[n][5].style.background = 'transparent';
				if(i == 0)
				{
					this.mapsquares[n + 1][4].style.background = 'transparent';
					this.mapsquares[n + 1][5].style.background = 'transparent';
				}
			}

			if(this.squares.L[i].charAt(1) == '1')
			{
				this.mapsquares[n][2].style.background = 'transparent';
				this.mapsquares[n][3].style.background = 'transparent';
				if(i == 0)
				{
					this.mapsquares[n + 1][2].style.background = 'transparent';
					this.mapsquares[n + 1][3].style.background = 'transparent';
				}
			}
		}
	}
};






//clear the view caption
DungeonView.prototype.clearViewCaption = function()
{
	//clear the existing text node content
	while(this.captiontext.childNodes.length > 0)
	{
		this.captiontext.removeChild(this.captiontext.firstChild);
	}
};





//generate the caption for a view
DungeonView.prototype.generateViewCaption = function(end)
{
	//the length of the corridor is the end index
	//translated to metres using the scale property
	var len = end * this.config.scale;

	//create an object of arrays to store the passages in the left and right walls
	//the array length is the number of passages,
	//each member is its distance, also translated to metres
	var passages = {
		'left' : [],
		'right' : []
		};

	//iterate through the squares collection, stopping at the end of our view
	//and note the distance of squares which are passages
	//since a passage will be 2 squares wide, don't count both squares
	//only count the square that begins it (ie, ignore a floor square
	//if the previous member of the passages array is directly before it)
	for(var i=0; i<this.squares.L.length; i++)
	{
		if(i - 1 == end) { break; }
		if(this.squares.L[i].charAt(3) == '1')
		{
			if(passages.left.length > 0 && passages.left[passages.left.length - 1] == i * this.config.scale - this.config.scale) { continue; }
			passages.left.push(i * this.config.scale);
		}

		if(this.squares.R[i].charAt(1) == '1')
		{
			if(passages.right.length > 0 && passages.right[passages.right.length - 1] == i * this.config.scale - this.config.scale) { continue; }
			passages.right.push(i * this.config.scale);
		}
	}

	//compile the sentence, beginning with the main part of the sentence
	var sentence = this.lang['corridor'].replace('%n', len);

	//look for passages at the very end of the corridor,
	//so we can say it turns left or right, or ends in a t-junction
	var turns = '';
	if(passages.left[passages.left.length - 1] + this.config.scale == len || (len == 0 && passages.left[passages.left.length - 1] == 0))
	{
		turns += 'L';
	}
	if(passages.right[passages.right.length - 1] + this.config.scale == len || (len == 0 && passages.right[passages.right.length - 1] == 0))
	{
		turns += 'R';
	}

	//if we find a turning, add it to the sentence
	//and remove it from the passages array so that it's not mentioned twice
	//if we don't find any turning, say that it's a dead end
	switch(turns)
	{
		case 'L' :
			sentence = sentence.replace('%ends', this.lang['ends-turns'].replace('%dir', this.lang['dir-left']));
			passages.left.splice(passages.left.length - 1, 1);
			break;

		case 'R' :
			sentence = sentence.replace('%ends', this.lang['ends-turns'].replace('%dir', this.lang['dir-right']));
			passages.right.splice(passages.right.length - 1, 1);
			break;

		case 'LR' :
		case 'RL' :
			sentence = sentence.replace('%ends', this.lang['ends-tjunct']);
			passages.left.splice(passages.left.length - 1, 1);
			passages.right.splice(passages.right.length - 1, 1);
			break;

		default :
			sentence = sentence.replace('%ends', this.lang['ends-dead']);
	}

	//if the corridor is 0 meters long change the sentence to say "you're facing a wall..."
	//then add information to specify where the corridor extends either side of you
	if(len == 0)
	{
		sentence = this.lang['facing-wall'];
		switch(turns)
		{
			case 'L' :
				sentence = sentence.replace('%with', this.lang['facing-with']
					.replace('%dir', this.lang['dir-left']));
				break;

			case 'R' :
				sentence = sentence.replace('%with', this.lang['facing-with']
					.replace('%dir', this.lang['dir-right']));
				break;

			case 'LR' :
			case 'RL' :
				sentence = sentence.replace('%with', this.lang['facing-with']
					.replace('%dir', this.lang['dir-left'] + this.lang['and'] + this.lang['dir-right']));
				break;

			default :
				sentence = sentence.replace('%with', this.lang['facing-nowith']);
		}
	}

	//otherwise iterate for each side to add passages information
	else
	{
		var dirs = ['left', 'right'];
		for(var d=0; d<dirs.length; d++)
		{
			//if there are passages in this wall
			if(passages[dirs[d]].length > 0)
			{
				//count the number of openings, so we can say "there are corridors"
				//or "there's a corridor" as appropriate
				var opcount = passages[dirs[d]].length == 1 ? this.lang['opcount-one'] : this.lang['opcount-many'];

				//construct delimited sentence fragments to mention each gap
				var opat = '';

				//if the first opening is at 0 then it's right in front of you
				//so say that, then remove it from the array
				//and if there are members left, add delimiters after it
				var nextto = '', after = '';
				if(passages[dirs[d]][0] == 0)
				{
					nextto += this.lang['nextto'];
					passages[dirs[d]].splice(0, 1);
					if(passages[dirs[d]].length > 0)
					{
						nextto += this.lang['comma'];
						if(passages[dirs[d]].length == 1) { nextto += this.lang['and']; }
						nextto += this.lang['after'];
					}
				}
				//if there isn't an opening at 0, add the after fragment
				else
				{
					after += this.lang['after'];
				}

				//add the rest of the openings, delimited as necessary
				//at this final pass, add one square's distance to each passage distance
				//this is because there's a discrepancy between passage and end wall distances
				//because a passage distance is from here to the front of the square that begins the passage
				//but an end distance is from here to the back of the square that ends the corridor
				//and this can create confusion when navigating with captions alone
				for(var i=0; i<passages[dirs[d]].length; i++)
				{
					opat += this.lang['opat'].replace('%n', passages[dirs[d]][i] + this.config.scale);
					if(i < passages[dirs[d]].length - 1)
					{
						opat += i < passages[dirs[d]].length - 2 ? this.lang['comma'] : this.lang['and'];
					}
				}

				//add the gap constructed sentence fragment to the main sentence
				sentence += this.lang['openings']
					.replace('%dir', this.lang['dir-' + dirs[d]])
					.replace('%nextto', nextto)
					.replace('%after', after)
					.replace('%opcount', opcount)
					.replace('%opat', opat);
			}
		}
	}

	//append the new sentence to the caption text element
	this.captiontext.appendChild(document.createTextNode(sentence));
};







//shift the characters in a string by n characters to the left
//carrying over residual characters to the end
//so shiftCharacters('test', 2) becomes 'stte'
DungeonView.prototype.shiftCharacters = function(str, shift)
{
	//save the first n characters of the string
	var saved = str.substr(0, shift);

	//copy the substring starting past the shift character
	//to delete the characters we just saved
	str = str.substring(shift);

	//add the saved string at the end
	str += saved;

	//return the string
	return str;
};







//bind events to the controller form
DungeonView.prototype.bindControllerEvents = function()
{
	//create  reference to this for inner functions
	var self = this;

	//save the reference to the controller form
	this.controller = document.getElementById('controller');

	//populate the x and y co-ordinate selectors, if we have them
	//according to the size of the floorplan matrix
	if(this.controller['y'])
	{
		for(var i=0; i<this.floorplan.length; i+=2)
		{
			this.controller['y'].appendChild(this.tools.createElement('option', { 'value' : i, 'text' : i }));
		}
	}
	if(this.controller['x'])
	{
		for(i=0; i<this.floorplan[0].length; i+=2)
		{
			this.controller['x'].appendChild(this.tools.createElement('option', { 'value' : i, 'text' : i }));
		}
	}

	//don't submit the form via submit action
	this.controller.onsubmit = function()
	{
		return false;
	};

	//bind a click handler for the player controls
	this.controller.onclick = function(e)
	{
		//store the event target
		var target = e ? e.target : window.event.srcElement;

		//if this is the apply position button
		if(target.id == 'apply')
		{
			//get the values of the x, y and direction selectors, converted to numbers
			var x = parseInt(this['x'].options[this['x'].options.selectedIndex].value, 10);
			var y = parseInt(this['y'].options[this['y'].options.selectedIndex].value, 10);
			var dir = parseInt(this['dir'].options[this['dir'].options.selectedIndex].value, 10);

			//try to apply these values to the dungeon view
			//and alert a message if we fail
			if(!self.applyDungeonView(x, y, dir))
			{
				alert('INPUT ERROR: Position [' + x + ',' + y + '] is inside a wall.');
			}
		}

		//or if this is the reset position button
		else if(target.id == 'reset')
		{
			//reset the dungeon view
			self.resetDungeonView();

			//reset the map view
			self.resetMapView();
		}

		//or if this is a move or turn button
		else if(/^(move|turn)\-/.test(target.id))
		{
			//create a local copy of the current view array
			var currentview = [self.currentview[0], self.currentview[1], self.currentview[2]];

			//the action array is derived from the button ids (if relevant)
			//eg, id="move-forward" would be ["move", "forward"]
			var action = target.id.split('-');

			//for movement actions
			if(action[0] == 'move')
			{
				//if we're moving forward when facing north, or strafing left when facing east
				//or moving back when facing south, or strafing right when facing west
				if
				(
					(action[1] == 'forward' && currentview[2] == 0)
					||
					(action[1] == 'left' && currentview[2] == 1)
					||
					(action[1] == 'back' && currentview[2] == 2)
					||
					(action[1] == 'right' && currentview[2] == 3)
				)
				{
					//decrease the y value in the current view array
					currentview[1] -= 2;
				}

				//if we're strafing right when facing north, or moving forward when facing east
				//or strafing left when facing south, or moving back when facing west
				if
				(
					(action[1] == 'right' && currentview[2] == 0)
					||
					(action[1] == 'forward' && currentview[2] == 1)
					||
					(action[1] == 'left' && currentview[2] == 2)
					||
					(action[1] == 'back' && currentview[2] == 3)
				)
				{
					//increase the x value in the current view array
					currentview[0] += 2;
				}

				//if we're moving back when facing north, or strafing right when facing east
				//or moving forward when facing south, or strafing left when facing west
				if
				(
					(action[1] == 'back' && currentview[2] == 0)
					||
					(action[1] == 'right' && currentview[2] == 1)
					||
					(action[1] == 'forward' && currentview[2] == 2)
					||
					(action[1] == 'left' && currentview[2] == 3)
				)
				{
					//increase the y value in the current view array
					currentview[1] += 2;
				}

				//if we're strafing left when facing north, or moving back when facing east
				//or strafing right when facing south, or moving forward when facing east
				if
				(
					(action[1] == 'left' && currentview[2] == 0)
					||
					(action[1] == 'back' && currentview[2] == 1)
					||
					(action[1] == 'right' && currentview[2] == 2)
					||
					(action[1] == 'forward' && currentview[2] == 3)
				)
				{
					//decrease the x value in the current view array
					currentview[0] -= 2;
				}

				//limit the values to zero at the minimum
				//and the size of the dungeon at the maximum
				if(currentview[0] < 0) { currentview[0] = 0; }
				if(currentview[0] + 2 > self.floorplan[0].length)
				{
					currentview[0] = self.floorplan[0].length - 2;
				}
				if(currentview[1] < 0) { currentview[1] = 0; }
				if(currentview[1] + 2 > self.floorplan.length)
				{
					currentview[1] = self.floorplan.length - 2;
				}

				//focus the button you just clicked
				//this helps to maintain focus integrity in JAWS
				//allowing you to press Enter multiple times
				//to repeat the same action without re-finding the button
				//(at least in theory ... it only works about 80% of the time:
				//if it doesn't work the change in focus will be announced; 
				//if nothing is announced then it has worked)
				target.focus();
			}

			//for turn actions
			else if(action[0] == 'turn')
			{
				//if the turn direction is right, increase the direction number
				if(action[1] == 'right') { currentview[2] ++; }

				//if the turn direction is left, decrease the number
				else if(action[1] == 'left') { currentview[2] --; }

				//otherwise the direction is around, so add 2 to the number
				else if(action[1] == 'around') { currentview[2] += 2; }

				//now wrap values which go outside the range
				if(currentview[2] > 3)
				{
					currentview[2] -= 4;
				}
				else if(currentview[2] < 0)
				{
					currentview[2] += 4;
				}

				//focus the button you just clicked (as noted above)
				target.focus();
			}

			//pass the new view values to the apply view function
			//and if we succeed, overwrite the current view values
			if(self.applyDungeonView(currentview[0], currentview[1], currentview[2]))
			{
				self.currentview = [currentview[0], currentview[1], currentview[2]];
			}
		}
	};


	//we need a keyisdown flag so we can ignore multiple keydown events between each keyup event
	//this is because in safari 1.3, keydown events on arrow keys fire twice every time
	var keyisdown = false;

	//bind a key handler to the document
	//to translate arrow key presses into button clicks
	document.onkeydown = function(e)
	{
		//convert event argument
		if(!e) { e = window.event; }

		//if the keyisdown flag is true, do nothing
		//otherwise if this is an arrow key, set the flag
		if(keyisdown) { return true; }
		else if(/3[789]|40/.test(e.keyCode.toString())) { keyisdown = true; }

		//remember the ID of the button this press relates to
		var id = null;
		switch(e.keyCode)
		{
			//up arrow, move forward
			case 38 :
				id = 'move-forward';
				break;

			//right arrow, turn or strafe right
			case 39 :
				id = (e.shiftKey ? 'move' : 'turn') + '-right';
				break;

			//down arrow, move back or turn around
			case 40 :
				id = e.shiftKey ? 'turn-around' : 'move-back';
				break;

			//left arrow, turn or strafe left
			case 37 :
				id = (e.shiftKey ? 'move' : 'turn') + '-left';
				break;
		}

		//if we have an id, click the applicable button
		//we have to try dispatchEvent first, for Firefox 
		//(don't know why, but the click() method doesn't work)
		if(id)
		{
			try
			{
				var evt = document.createEvent('MouseEvents');
				evt.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				document.getElementById(id).dispatchEvent(evt);
			}
			catch(err)
			{
				document.getElementById(id).click();
			}
		}

		//return false to prevent default action
		return false;
	};

	//bind a keyup handler to reset the keyisdown flag
	document.onkeyup = function() { keyisdown = false; }
};


