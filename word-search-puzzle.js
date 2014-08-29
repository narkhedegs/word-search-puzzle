var WordSearchPuzzle = WordSearchPuzzle || {};

WordSearchPuzzle.WordSearchPuzzleGenerator = function(options){
	var self = this;

	self.directions = options.directions;
};

WordSearchPuzzle.WordSearchPuzzleGenerator.prototype = {
	generate: function(words){
		var longestWord = words.sort(function(a,b){ return b.length - a.length; })[0],
			puzzleSize = longestWord.length,
			grid = new WordSearchPuzzle.Grid(puzzleSize);

		for(var i = 0;i < words.length;i++){
			var word = words[i],
				availableDirections = [].concat(this.directions),
				randomDirectionIndex,
				randomDirection,
				placements = new Array();

			while(placements.length == 0 && availableDirections.length > 0){
				randomDirectionIndex = this.getRandomInteger(0, availableDirections.length - 1);
				randomDirection = availableDirections[randomDirectionIndex];
				availableDirections.splice(randomDirectionIndex, 1);
				placements = grid.findPlacements(word, randomDirection);
			}

			if(placements.length == 0){
				i = 0;
				puzzleSize++;
				grid = new WordSearchPuzzle.Grid(puzzleSize);
				continue;
			}

			var randomPlacementIndex = this.getRandomInteger(0, placements.length - 1)
				randomPlacement = placements[randomPlacementIndex];

			randomPlacement.placeContent(word);
		}

		return grid;
	},

	getRandomInteger: function (minimum, maximum) {
        return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
    }
};

WordSearchPuzzle.Grid = function(gridSize){
	var self = this,
		createRows = function(){
			var rows = new Array();
			for(var rowNumber = 0;rowNumber < gridSize;rowNumber++){
				var row = rows[rowNumber] = new Array();
				for(var columnNumber = 0;columnNumber < gridSize;columnNumber++){
					var cell = new WordSearchPuzzle.GridCell(rowNumber, columnNumber);
					row.push(cell);
				}
			}
			return rows;
		};

	self.gridSize = gridSize;
	self.rows = createRows();
};

WordSearchPuzzle.Grid.prototype = {
	findPlacements: function(content, direction){
		var placements = this.getPlacements(content.length, direction);

		return placements.filter(function(placement){
			return placement.canPlaceContent(content);
		});
	},

	getPlacements: function(contentLength, direction){
		var placements = new Array(),
			rowLength = columnLength = this.gridSize,
			numberOfPlacements,
			startCell;

		switch(direction){
			case WordSearchPuzzle.PlacementDirection.LeftToRight:
				numberOfPlacements = this.getNumberOfPossiblePlacementsInContainer(contentLength, rowLength);
				for (var row = 0; row < this.gridSize; row++) {
					for (var i = 0, startColumn = 0; i < numberOfPlacements; i++, startColumn++) {
						var placement = new WordSearchPuzzle.Placement(direction);
						for(var j = 0, column = startColumn; j < contentLength; j++, column++){
							placement.addCell(this.rows[row][column]);
						}
						placements.push(placement);
					}
				}
			break;
			case WordSearchPuzzle.PlacementDirection.RightToLeft:
				numberOfPlacements = this.getNumberOfPossiblePlacementsInContainer(contentLength, rowLength);
				for (var row = 0; row < this.gridSize; row++) {
					for (var i = 0, startColumn = contentLength - 1; i < numberOfPlacements; i++, startColumn++) {
						var placement = new WordSearchPuzzle.Placement(direction);
						for(var j = 0, column = startColumn; j < contentLength; j++, column--){
							placement.addCell(this.rows[row][column]);
						}
						placements.push(placement);
					}
				}			
			break;	
			case WordSearchPuzzle.PlacementDirection.TopToDown:		
				numberOfPlacements = this.getNumberOfPossiblePlacementsInContainer(contentLength, columnLength);
				for (var column = 0;column < this.gridSize; column++) {
					for (var i = 0, startRow = 0; i < numberOfPlacements; i++, startRow++) {
						var placement = new WordSearchPuzzle.Placement(direction);
						for(var j = 0, row = startRow; j < contentLength; j++, row++){
							placement.addCell(this.rows[row][column]);
						}
						placements.push(placement);
					}
				}				
			break;
			case WordSearchPuzzle.PlacementDirection.DownToTop:		
				numberOfPlacements = this.getNumberOfPossiblePlacementsInContainer(contentLength, columnLength);
				for (var column = 0; column < this.gridSize; column++) {
					for (var i = 0, startRow = contentLength - 1; i < numberOfPlacements; i++, startRow++) {
						var placement = new WordSearchPuzzle.Placement(direction);
						for(var j = 0, row = startRow; j < contentLength; j++, row--){
							placement.addCell(this.rows[row][column]);
						}
						placements.push(placement);
					}
				}
			break;			
		}

		return placements;
	},

	getNumberOfPossiblePlacementsInContainer: function(contentLength, containerLength){
		return containerLength - contentLength + 1;
	},

	toArray: function(){
		var grid = new Array();
		for(var i = 0;i < this.rows.length;i++){
			var row = this.rows[i];
			grid[i] = new Array();
			for(var j = 0;j < row.length;j++){
				grid[i].push(row[j].value);
			}
		}
		return grid;
	}
};

WordSearchPuzzle.Placement = function(direction){
	var self = this;

	self.direction = direction;
	self.cells = new Array();
};

WordSearchPuzzle.Placement.prototype = {
	addCell: function(cell){
		this.cells.push(cell);
	},

	canPlaceContent: function(content){
		var result = true;

		for(var i = 0;i < content.length;i++){
			if(!this.cells[i].isEmpty() && this.cells[i].value !== content[i]){
				result = false;
				break;
			}
		}

		return result;
	},

	placeContent: function(content){
		for(var i = 0;i < content.length;i++){
			this.cells[i].value = content[i];
		}
	}
};

WordSearchPuzzle.PlacementDirection = {
	LeftToRight: 1,
	RightToLeft: 2,
	TopToDown: 3,
	DownToTop: 4
};

WordSearchPuzzle.GridCell = function(row, column){
	var self = this;

	self.row = row;
	self.column = column;
	self.value = null;
};

WordSearchPuzzle.GridCell.prototype = {
	isEmpty: function(){
		return this.value === null;
	}
};