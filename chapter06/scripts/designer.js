


//floor plan designer object constructor
function FloorplanDesigner()
{
	//get a reference to the floorplan table
	//and don't continue if it doesn't exist
	this.floorplan = document.getElementById('floorplan');
	if(!this.floorplan) { return; }

	//instantiate the tools object and save the reference
	this.tools = new Tools();

	//instantiate the config object and save the reference
	this.config = new DungeonConfig();

	//default rows and columns
	this.plansize = [20, 40];

	//get a reference to the data form
	this.dataform = document.getElementById('dataform');

	//create the table rows and cells
	this.createRowsAndCols(this.plansize)




	//create a reference to this for inner functions
	var self = this;


	//bind a click handler to the table for cell selection
	this.floorplan.onclick = function(e)
	{
		//get the target element
		//and don't continue if it isn't a table cell
		var cell = e ? e.target : window.event.srcElement;
		if(cell.nodeName.toLowerCase() != 'td')
		{
			return;
		}

		//get the row and column reference from the cell ID
		//and pass the data to the update data matrix method
		//including the autoclick argument so it checks adjacent squares
		//so that changes are in blocks of four
		var ref = cell.id.split('-');
		self.updateDataMatrix(parseInt(ref[1], 10), parseInt(ref[2], 10), true);
	};


	//bind a submit handler to the data form
	//to generate the output matrix
	this.dataform.onsubmit = function()
	{
		//compile an output data string
		var str = 'var floorplan = [';
		for(var i=0; i<self.data.length; i++)
		{
			str += '[';
			for(var j=0; j<self.data[i].length; j++)
			{
				str += "'" + self.data[i][j].join('') + "'";
				if(j + 1 < self.data[i].length)
				{
					str += ',';
				}
			}
			str += ']';
			if(i + 1 < self.data.length)
			{
				str += ',';
			}
			str += '';
		}
		str += '];\n';

		//output the data string to the data area
		this['data'].value = str;

		//don't submit
		return false;
	};


	//bind a reset handler to the data form
	//to display an input matrix
	this.dataform.onreset = function()
	{
		//get the data string from the data area
		//and strip it of all whitespace
		var str = this['data'].value.replace(/[\t\n\r]/g, '');

		//don't continue if we have an empty value
		if(str == '') { return false; }

		//remove unwanted data and split into a matrix
		str = str.replace(/[a-z\. \=\']/g, '');
		var matrix = str.split('],');
		for(var i=0; i<matrix.length; i++)
		{
			matrix[i] = matrix[i].replace(/[\[\]\;]/g, '');
			matrix[i] = matrix[i].split(',');
		}

		//re-create the table rows and cells
		self.createRowsAndCols([matrix.length, matrix[0].length]);

		//apply it to the floorplan and copy its values to the data matrix
		self.applyInputMatrix(matrix);

		//clear the field value
		this['data'].value = '';

		//don't reset
		return false;
	};


	//bind a general click handler to the data form
	//to handle the update button
	this.dataform.onclick = function(e)
	{
		//get the event target
		var target = e ? e.target : window.event.srcElement;

		//if the target is the update button and we get confirmation to do this
		if(target.id == 'floorsize-update' && confirm('WARNING: Changing the size will erase any current floor plan.'))
		{
			//get the new floorplan values from the fields
			self.plansize = [
				parseInt(self.dataform['floorsize-y'].value, 10),
				parseInt(self.dataform['floorsize-x'].value, 10)
				];

			//limit minimum values
			for(var i=0; i<2; i++)
			{
				if(isNaN(self.plansize[i]) || self.plansize[i] < 2) { self.plansize[i] = 2; }
			}

			//re-create the table rows and cells
			self.createRowsAndCols(self.plansize);
		}
	};
};



//apply an input matrix to the floorplan grid and copy its values to the data matrix
FloorplanDesigner.prototype.applyInputMatrix = function(matrix)
{
	//iterate through the input matrix
	for(var i=0; i<matrix.length; i++)
	{
		//limit check in case the input is larger than the grid
		//** not necessary now we have auto sizing
		//if(i < this.data.length)
		{
			for(var j=0; j<matrix[i].length; j++)
			{
				//limit check in case the input is larger than the grid
				//** not necessary now we have auto sizing
				//if(j < this.data[i].length)
				{
					//save each character, converted to a number
					//to the corresponding position in the data array
					for(var k=0; k<4; k++)
					{
						this.data[i][j][k] = parseInt(matrix[i][j].charAt(k), 10);
					}

					//write the data into the cell
					this.cells[i][j].firstChild.nodeValue = '' + this.data[i][j][0] + this.data[i][j][1] + ' ' + this.data[i][j][2]  + this.data[i][j][3];

					//work out the higlight by comparing the earlier cell if there is on
					//if there isn't one highlight the previous one with this data
					if(j > 0)
					{
						if(this.data[i][j - 1][1] == 1)
						{
							this.cells[i][j].className = 'floorcell';
						}

						if(j == 1 && this.data[i][j][3] == 1)
						{
							this.cells[i][0].className = 'floorcell';
						}
					}
				}
			}
		}
	}
};



//create the table rows and cells
//first removing any existing content
FloorplanDesigner.prototype.createRowsAndCols = function(plansize)
{
	//fix opera repaint bug part 1
	document.documentElement.style.position = 'relative';

	//cells collection is a matrix of rows and cells
	this.cells = [];

	//data collection is a matching matrix of cell data
	//where each member is an array of four boolean numbers
	//0 if there's wall in that direction
	//1 if there's floor in that direction
	//ordered like CSS properties: [0] = above, [1] = right, [2] = below, [3] = left
	this.data = [];

	//remove any existing content from the table
	while(this.floorplan.childNodes.length > 0)
	{
		this.floorplan.removeChild(this.floorplan.firstChild);
	}

	//create the necessary rows and columns
	//saving a reference to each cell in the cells matrix
	var tbody = this.floorplan.appendChild(this.tools.createElement('tbody'));
	for(var i=0; i<plansize[0]; i++)
	{
		var row = tbody.appendChild(this.tools.createElement('tr'));
		this.cells[i] = [];
		this.data[i] = [];
		for(var j=0; j<plansize[1]; j++)
		{
			this.data[i][j] = [0, 0, 0, 0];
			this.cells[i][j] = row.appendChild(this.tools.createElement('td', {
					'id' : 'Cell-' + i + '-' + j,
					'text' : '00 00',
					'title' : 'x = ' + (Math.floor(j / 2) * 2) + ', y = ' + (Math.floor(i / 2) * 2)
					}));
		}
	}

	//write rows and cols to dataform
	this.dataform['floorsize-y'].value = plansize[0];
	this.dataform['floorsize-x'].value = plansize[1];

	//fix opera repaint bug part 2
	document.documentElement.style.position = 'static';
};




//update the data matrix in response to a cell click
FloorplanDesigner.prototype.updateDataMatrix = function(row, col, autoclick)
{
	//get a reference to this cell
	var cell = this.cells[row][col];

	//if the cell already has the floorcell classname,
	//then we know it's already selected as a piece of floor
	//and we want to select it as a piece of wall
	if(cell.className == 'floorcell')
	{
		//remove its classname
		cell.className = '';

		//set the select flag to 0
		//meaning we're deselecting this cell
		var select = 0;
	}

	//otherwise it's currently a piece of wall
	//and we want to select it as a piece of floor
	else
	{
		//if autoclick is false (no need to validate programatic calls)
		//or if validation is successful for creating this floor space
		//(if it's not trying to create a longer column than we can support)
		if(!autoclick || this.validateFloorSpace(row, col))
		{
			//add the floor cell clas name
			cell.className = 'floorcell';

			//set the select flag to 1
			//meaning we're selecting this cell
			select = 1;
		}

		//otherwise we can't select this square as floor, so we're done
		else
		{
			return false;
		}
	}


	//set the cell class name accordingly
	cell.className = select == 1 ? 'floorcell' : '';



	//compile the new data for this cell
	//initially assuming we have an adjacent floor cell on all four sides
	//until we determine otherwise, for each direction
	var data = [1, 1, 1, 1];

	//saving each adjacent cell row and column number as we go
	//again, assuming none in every direction until we know otherwise
	var adjacents = [null, null, null, null];

	//if there's no cell above us, or there is but it's not selected
	if(row == 0)
	{
		data[0] = 0;
	}
	else
	{
		adjacents[0] = [row - 1, col];
		if(this.cells[row - 1][col].className != 'floorcell')
		{
			data[0] = 0;
		}
	}

	//if there's no cell to the right, or there is but it's not selected
	if(col + 1 == this.plansize[1])
	{
		data[1] = 0;
	}
	else
	{
		adjacents[1] = [row, col + 1];
		if(this.cells[row][col + 1].className != 'floorcell')
		{
			data[1] = 0;
		}
	}

	//if there's no cell below us, or there is but it's not selected
	if(row + 1 == this.plansize[0])
	{
		data[2] = 0;
	}
	else
	{
		adjacents[2] = [row + 1, col];
		if(this.cells[row + 1][col].className != 'floorcell')
		{
			data[2] = 0;
		}
	}

	//if there's no cell to the left, or there is but it's not selected
	if(col == 0)
	{
		data[3] = 0;
	}
	else
	{
		adjacents[3] = [row, col - 1];
		if(this.cells[row][col - 1].className != 'floorcell')
		{
			data[3] = 0;
		}
	}

	//write the new data back into the cell
	cell.firstChild.nodeValue = '' + data[0] + data[1] + ' ' + data[2]  + data[3];


	//change the corresponding value in the data array of each adjacent cell
	//if it exists, and also write the new data back into that cell
	for(var i=0; i<4; i++)
	{
		if(adjacents[i])
		{
			var r = adjacents[i][0], c = adjacents[i][1];
			var n = i + 2;
			if(n >= 4) { n -= 4; }

			this.data[r][c][n] = select;
			this.cells[r][c].firstChild.nodeValue = '' + this.data[r][c][0] + this.data[r][c][1] + ' ' + this.data[r][c][2]  + this.data[r][c][3];
		}
	}


	//if autoclick is true, click adjacent squares in a pattern of four
	//by getting their references and calling this method again
	//this time without the autoclick argument
	//so that we don't get infinite recursion
	if(autoclick)
	{
		var newrow = row / 2 == Math.round(row / 2) ? row + 1 : row - 1;
		var newcol = col / 2 == Math.round(col / 2) ? col + 1 : col - 1;

		this.updateDataMatrix(newrow, col, false);
		this.updateDataMatrix(row, newcol, false);
		this.updateDataMatrix(newrow, newcol, false);
	}

	//just so we always return something :)
	return true;
};



//validate a floor space selection
FloorplanDesigner.prototype.validateFloorSpace = function(rows, cols)
{
	//we need to do all this twice - once for each direction
	for(var i=0; i<2; i++)
	{
		//iterate backwards through the cells
		//looking for the start of the corridor we're creating
		//start from the cell before this one for even values
		//or the cell before that for odd values, because odd ones are the end-most
		//in a pair of two which won't have been fully selected yet
		var iseven = arguments[i]/2 == Math.round(arguments[i]/2) || arguments[i] == 0;
		var n = arguments[i] - (iseven ? 1 : 2), start = 0;
		while(n >= 0)
		{
			start = n + 1;
			var cell = i == 0 ? this.cells[n][cols] : this.cells[rows][n];
			if(cell.className == 'floorcell')
			{
				n--;
			}
			else
			{
				break;
			}
		}
		if(n < 0) { start = 0; }

		//now, iterate and count the length of the corridor as it is now
		//(including the two new squares which we know will be floor space, but aren't at the moment)
		//if we reach the limit of what's supported by the script return false for validation failure
		n = start - 1;
		while(true)
		{
			n++;

			//break if we reach the end of the plan
			if(i == 0)
			{
				if(n == this.cells.length)
				{
					break;
				}
				else
				{
					cell = this.cells[n][cols];
				}
			}
			else
			{
				if(n == this.cells[rows].length)
				{
					break;
				}
				else
				{
					cell =  this.cells[rows][n];
				}
			}

			//return false for failure if the corridor will be too long
			if(n - start > this.config.gridsize[0])
			{
				return false;
			}

			//keep iterating if this is floor space
			if(
				(cell.className == 'floorcell')
				||
				(n == arguments[i] || ((iseven && arguments[i] + 1 == n) || (!iseven && arguments[i] - 1 == n)))
				)
			{
				continue;
			}

			//break if this is wall
			if(cell.className == '')
			{
				break;
			}
		}
	}

	//if we get this far, return true for validation success
	return true;
};




