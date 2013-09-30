Crafty.scene("title", function() {
 Crafty.background('purple');
    var nameText = Crafty.e("2D, DOM, Text").attr({
		 w : 2170,
		 h : 400,
		 x : 300,
		 y : 0
	     }).text("Card Blocks").textFont({
		 size : '40px'   
	     });

 var startText = Crafty.e("2D, DOM, Text, Mouse").attr({
		 w : 2170,
		 h : 400,
		 x : 370,
		 y : 100
	     }).text("Start").textFont({
		 size : '40px'   
	     });

 var ruleText = Crafty.e("2D, DOM, Text, Mouse").attr({
		 w : 2170,
		 h : 400,
		 x : 370,
		 y : 200
	     }).text("Rules").textFont({
		 size : '40px'   
	     });

 var eText = Crafty.e("2D, DOM, Text, Mouse").attr({
		 w : 2170,
		 h : 400,
		 x : 370,
		 y : 300
	     }).text("Exit").textFont({
		 size : '40px'   
	     });

startText.bind('MouseDown', function(e) {
    if( e.mouseButton == Crafty.mouseButtons.LEFT ){
	Crafty.scene("game");
    }


});

ruleText.bind('MouseDown', function(e) {
    if( e.mouseButton == Crafty.mouseButtons.LEFT ){
	Crafty("*").each(function() {
		this.destroy();
	});
	var blah = Crafty.e("2D, DOM, Text, Mouse").attr({
		 w : 2170,
		 h : 400,
		 x : 200,
		 y : 0
	     }).text("Back to Main Screen").textFont({
		 size : '40px'   
	     }).textColor("#FF0000");
	blah.bind('MouseDown', function(e) {
    if( e.mouseButton == Crafty.mouseButtons.LEFT ){
	location.reload();
    }




});

var bg = Crafty.e("2D, DOM, Image")
             .image("cbrules.png")
            .attr({x: 20, y: 60});
	//var ent = Crafty.e("2D, DOM, Image").image("cbexamples.png");
	//var ent2 = Crafty.e("2D, DOM, Image").image("cbrules.png");


    }


});

eText.bind('MouseDown', function(g) {
    if( g.mouseButton == Crafty.mouseButtons.LEFT){
	Crafty("*").each(function() {
		this.destroy();
	});
	 var tText = Crafty.e("2D, DOM, Text, Mouse").attr({
		 w : 2170,
		 h : 400,
		 x : 100,
		 y : 0
	     }).text("Thanks for Playing our Crafty Game").textFont({
		 size : '40px'   
	     });

var ggggText = Crafty.e("2D, DOM, Text, Mouse").attr({
		 w : 2170,
		 h : 400,
		 x : 100,
		 y : 100
	     }).text("Music:  Tetris Remix by unrl").textFont({
		 size : '40px'   
	     });
 var tText = Crafty.e("2D, DOM, Text, Mouse").attr({
		 w : 2170,
		 h : 400,
		 x : 370,
		 y : 150
	     }).text("Creators:").textFont({
		 size : '40px'   
	     });

 var wText = Crafty.e("2D, DOM, Text, Mouse").attr({
		 w : 2170,
		 h : 400,
		 x : 370,
		 y : 200
	     }).text("Allen Park").textFont({
		 size : '40px'   
	     });

 var xText = Crafty.e("2D, DOM, Text, Mouse").attr({
		 w : 2170,
		 h : 400,
		 x : 370,
		 y : 250
	     }).text("Nathan Pinsker").textFont({
		 size : '40px'   
	     });

 var yText = Crafty.e("2D, DOM, Text, Mouse").attr({
		 w : 2170,
		 h : 400,
		 x : 370,
		 y : 300
	     }).text("Skyler Seto").textFont({
		 size : '40px'   
	     });

	

    }


});
});

var Screen = {
    start: function() {
        Crafty.init(780, 540);
        Crafty.scene("title");
    }
};

Crafty.scene("game", function() {
var Game = {
map_grid: {
    height: 5,
    player_width: 6,
    width: 13, // player_width * 2 + 1
    tile: {
        width:  80,
        height: 80
    },
    cards: [[]],
},
empty_card: {
    value: -1
},
player1pos: 0, // 0 to map_grid.player_width-1
player2pos: 0, // 0 to map_grid.player_width-1
player1card: null,
player2card: null,
player1points: 0,
player2points: 0,
player1pointsText: null,
player2pointsText: null,
currentPlayer: 0, // used for block clearing and sending
leftMarker: null,
rightMarker: null,
originalCount: 180,
count: 180,
counter: null,
MIN_CARD: 1,
MAX_CARD: 9,
MIN_DUPLICATE_SIZE: 2,
MIN_STRAIGHT_SIZE: 3,
AI_PLAY_INTERVAL: 4,
timeText: null,
gameOver: false,

gameFinished: function(youWon, message) {
    this.gameOver = true;
    Crafty("*").each(function() {
        this.destroy();
    });

    var displayText = "GAME OVER";
    if (youWon) {
        displayText += " YOU WIN!";
    } else {
        displayText += " YOU LOSE!";
    }
    Crafty.e("2D, DOM, Text").attr({
        w : 2170,
        h : 400,
        x : 300,
        y : 450
    }).text(displayText).textFont({
        size : '40px'   
    });
    if (message) {
        Crafty.e("2D, DOM, Text").attr({
            w : 2170,
            h : 400,
            x : 400,
            y : 500
        }).text(message).textFont({
            size : '40px'   
        });
    }

    var playagain = Crafty.e("2D, DOM, Text, Mouse").attr({
        w : 2170,
        h : 400,
        x : 330,
        y : 100
    }).text("Click to Play Again").textFont({
        size : '40px'   
    });

    playagain.bind('MouseUp', function(e) {
        if (e.mouseButton == Crafty.mouseButtons.LEFT) {
            location.reload();
        }
    });
 
},

timer: function()
{
    this.count = this.count - 1;
    if (this.count < 0 || this.gameOver)
    {
        clearInterval(this.counter);
        return;
    }
    var min = Math.floor(this.count / 60);
    var sec = this.count % 60;
    if (sec < 10)
    {
        this.timeText.text("time remaining: " + min + ": " + "0" + sec );
    } else {
        this.timeText.text("time remaining: " + min + ": " + sec );
    }
    if (min == 0 && sec == 0) {
        var message = "You: " + Game.player1points + " Him: " + Game.player2points;
        this.gameFinished(Game.player1points >= Game.player2points, message);
    }
    if (this.count < this.originalCount && this.count % Game.AI_PLAY_INTERVAL == 0 && !this.gameOver) {
        this.AImove();
    }
},
width: function() {
    return this.map_grid.width * this.map_grid.tile.width;
},

height: function() {
    return this.map_grid.height * this.map_grid.tile.height
        + 2*this.map_grid.tile.height;
},
printCards: function() {
    for (var j=0; j<Game.map_grid.height; ++j) {
    var s = "";
    for (var i=0; i<Game.map_grid.width; ++i) {
        s += Game.map_grid.cards[i][j].value;
        if (i < Game.map_grid.width-1) s += ",";
    }
    console.log(s);
    }
},

createCard: function(val) {
    var card = {};
    if (val == -1) {
	card.value = Crafty.math.randomInt(this.MIN_CARD, this.MAX_CARD);
    }
    else {
	card.value = val;
    }
    card.bg = Crafty.e("Card, 2D, DOM, Color")
                    .color('rgb(255, 255, 255)')
                    .attr({ x: 0,
                            y: 0,
                            w: Game.map_grid.tile.width - 10,
                            h: Game.map_grid.tile.height - 10 });
    card.text = Crafty.e("2D, DOM, Text")
                      .attr({ x: 10, y:10, })
                      .text(card.value).textFont({
              size : '25px' });
    card.moveTo = function(x, y) { this.bg.x = x; this.bg.y = y; };
    
    card.bg.attach(card.text);
    card.bg.z = 1;
    card.text.z = 2;
    
    return card;
},
createWrapperCard: function(val) {
    var card = {value: val};
    return card;
},
assignCard: function(player, card) {
    if (player == 0) Game.player1card = card;
    else Game.player2card = card;
},
dropCard: function(index, pos) {
    if (index == 0) {
        var column = pos;
        var row = this.findLowestFreeCell(column);
     
        this.player1card.moveTo(column * this.map_grid.tile.width + 5,
                                 row * this.map_grid.tile.height + 5);
        this.map_grid.cards[column][row] = this.player1card;
        return [column, row];
    }
    else {
        var column = pos + (Game.map_grid.player_width+1);
        var row = this.findLowestFreeCell(column);
     
        this.player2card.moveTo(column * this.map_grid.tile.width + 5,
                                 row * this.map_grid.tile.height + 5);
        this.map_grid.cards[column][row] = this.player2card;
        return [column, row];
    }
        
    return [-1, -1];
},
calculatePoints: function(size, type) {
    if (type == 'duplicates') {
        return size;
    } else if (type == 'straights') {
        return size + 1;
    }
},
updatePointsDisplay: function() {
    Game.player1pointsText.text("P1 score: " + Game.player1points).textFont({
        size : '16px'   
    });
    Game.player2pointsText.text("P2 score: " + Game.player2points).textFont({
        size : '16px'   
    });
},
calculateNextAIMove: function() {
    var toReturn = -1;
    for (var i=0; i<Game.map_grid.player_width; ++i) {
	// BAD BAD BAD ugly hack :(
	if (toReturn != -1) break;

	var tryColumn = Game.map_grid.player_width+1 + i;
	var tryRow = this.findLowestFreeCell(tryColumn);
	if (tryRow < 0) continue;

	Game.map_grid.cards[tryColumn][tryRow] = Game.createWrapperCard(Game.player2card.value);
	if (Game.checkCellForBlocks(tryColumn, tryRow) != null) {
	    toReturn = tryColumn - (Game.map_grid.player_width+1);
	}
	Game.map_grid.cards[tryColumn][tryRow] = Game.empty_card;
    }
    if (toReturn == -1) {
        toReturn = Crafty.math.randomInt(0, Game.map_grid.player_width-1);
        for (var i=0; i<100; ++i) {
            if (Game.findLowestFreeCell(toReturn + (Game.map_grid.player_width+1)) == -1) {
                toReturn = Crafty.math.randomInt(0, Game.map_grid.player_width-1);
                break;
            }
        }
    }
    return toReturn;
},
	    
	
checkCellForBlocks: function(cellX, cellY) {
    // 'anchor1' and 'anchor2' denote the two numbers at each edge of the block.
    // this is used to help with transferring blocks to the other player's grid.

    var cellContents = this.map_grid.cards[cellX][cellY].value;
    var bestBlock = null;
    var type = 'duplicates';

    // Checking X duplicates.
    var bottomX = cellX - 1;
    while (bottomX >= 0 && this.map_grid.cards[bottomX][cellY].value == cellContents) {
        bottomX --;
    }
    bottomX ++; // This is the lowest contiguous x that matches cellContents.
    var topX = cellX + 1;
    while (topX < this.map_grid.width && this.map_grid.cards[topX][cellY].value == cellContents) {
        topX ++;
    }
    topX --; // This is the top contiguous x that matches cellContents.
    if (topX - bottomX + 1 >= this.MIN_DUPLICATE_SIZE) {
        var points = this.calculatePoints(topX - bottomX + 1, type);
        if (!bestBlock || points >= bestBlock.points) {
            bestBlock = {bottomX: bottomX, bottomY: cellY, topX: topX, topY: cellY, anchor1: cellContents, anchor2: cellContents, type: type, points: points};
        }
    }

    // Checking Y duplicates.
    var bottomY = cellY - 1;
    while (bottomY >= 0 && this.map_grid.cards[cellX][bottomY].value == cellContents) {
        bottomY --;
    }
    bottomY ++; // This is the lowest contiguous y that matches cellContents.
    var topY = cellY + 1;
    while (topY < this.map_grid.height && this.map_grid.cards[cellX][topY].value == cellContents) {
        topY ++;
    }
    topY --; // This is the top contiguous y that matches cellContents.
    if (topY - bottomY + 1 >= this.MIN_DUPLICATE_SIZE) {
        var points = this.calculatePoints(topY - bottomY + 1, type);
        if (!bestBlock || points >= bestBlock.points) {
            bestBlock = {bottomY: bottomY, bottomX: cellX, topY: topY, topX: cellX, anchor1: cellContents, anchor2: cellContents, type: type, points: points};
        }
    }

    type = 'straights';

    // Checking X increasing straights.
    var bottomX = cellX - 1;
    while (bottomX >= 0 && this.map_grid.cards[bottomX][cellY].value == cellContents - (cellX - bottomX)) {
        bottomX --;
    }
    bottomX ++; // This is the lowest contiguous x that matches cellContents.
    var topX = cellX + 1;
    while (topX < this.map_grid.width && this.map_grid.cards[topX][cellY].value == cellContents + (topX - cellX)) {
        topX ++;
    }
    topX --; // This is the top contiguous x that matches cellContents.
    if (topX - bottomX + 1 >= this.MIN_STRAIGHT_SIZE) {
        var points = this.calculatePoints(topX - bottomX + 1, type);
        if (!bestBlock || points >= bestBlock.points) {
            bestBlock = {bottomX: bottomX, bottomY: cellY, topX: topX, topY: cellY, anchor1: cellContents - (cellX - bottomX), anchor2: cellContents + (topX - cellX), type: type, points: points};
        }
    }

    // Checking X decreasing straights.
    var bottomX = cellX - 1;
    while (bottomX >= 0 && this.map_grid.cards[bottomX][cellY].value == cellContents + (cellX - bottomX)) {
        bottomX --;
    }
    bottomX ++; // This is the lowest contiguous x that matches cellContents.
    var topX = cellX + 1;
    while (topX < this.map_grid.width && this.map_grid.cards[topX][cellY].value == cellContents - (topX - cellX)) {
        topX ++;
    }
    topX --; // This is the top contiguous x that matches cellContents.
    if (topX - bottomX + 1 >= this.MIN_STRAIGHT_SIZE) {
        var points = this.calculatePoints(topX - bottomX + 1, type);
        if (!bestBlock || points >= bestBlock.points) {
            bestBlock = {bottomX: bottomX, bottomY: cellY, topX: topX, topY: cellY, anchor1: cellContents + (cellX - bottomX), anchor2: cellContents - (topX - cellX), type: type, points: points};
        }
    }

    // Checking Y increasing straights.
    var bottomY = cellY - 1;
    while (bottomY >= 0 && this.map_grid.cards[cellX][bottomY].value == cellContents - (cellY - bottomY)) {
        bottomY --;
    }
    bottomY ++; // This is the lowest contiguous y that matches cellContents.
    var topY = cellY + 1;
    while (topY < this.map_grid.height && this.map_grid.cards[cellX][topY].value == cellContents + (topY - cellY)) {
        topY ++;
    }
    topY --; // This is the top contiguous y that matches cellContents.
    if (topY - bottomY + 1 >= this.MIN_STRAIGHT_SIZE) {
        var points = this.calculatePoints(topX - bottomX + 1, type);
        if (!bestBlock || points >= bestBlock.points) {
            bestBlock = {bottomY: bottomY, bottomX: cellX, topY: topY, topX: cellX, anchor1: cellContents - (cellY - bottomY), anchor2: cellContents + (topY - cellY), type: type, points: points};
        }
    }

    // Checking Y decreasing straights.
    var bottomY = cellY - 1;
    while (bottomY >= 0 && this.map_grid.cards[cellX][bottomY].value == cellContents + (cellY - bottomY)) {
        bottomY --;
    }
    bottomY ++; // This is the lowest contiguous y that matches cellContents.
    var topY = cellY + 1;
    while (topY < this.map_grid.height && this.map_grid.cards[cellX][topY].value == cellContents - (topY - cellY)) {
        topY ++;
    }
    topY --; // This is the top contiguous y that matches cellContents.
    if (topY - bottomY + 1 >= this.MIN_STRAIGHT_SIZE) {
        var points = this.calculatePoints(topY - bottomY + 1, type);
        if (!bestBlock || points >= bestBlock.points) {
            bestBlock = {bottomY: bottomY, bottomX: cellX, topY: topY, topX: cellX, anchor1: cellContents + (cellY - bottomY), anchor2: cellContents - (topY - cellY), type: type, points: points};
        }
    }
    return bestBlock;
},
removeBlock: function(player, block) {
    if (!block) {
        return;
    }
    Game.transferBlock(player, block);
    for (var x = block.bottomX; x <= block.topX; x++) {
        for (var y = block.bottomY; y <= block.topY; y++) {
            if (this.map_grid.cards[x][y].value == -1) {
                console.log('Square (' + x + ', ' + y + ') was empty before being cleared.');
            }
            this.map_grid.cards[x][y].text.destroy();
            this.map_grid.cards[x][y].bg.destroy();
            this.map_grid.cards[x][y] = this.empty_card;
        }
    }
    this.makeBlocksFall();
},
transferBlock: function(player, block) {
    //this method relies on the assumption that blocks are always straight lines.
    //but then again, so does checkCellForBlocks

    if (!block) {
        return;
    }

    var offset = player * (Game.map_grid.player_width + 1);
    var dropLocation = 0;

    if (block.bottomY == block.topY) {
        var valid = [];
        var sign = 1;
        if (block.anchor1 > block.anchor2) sign = -1;
        else if (block.anchor1 == block.anchor2) sign = 0;	
	
        dropLocation = Crafty.math.randomInt(0, Game.map_grid.player_width-1-(block.topX-block.bottomX));

        var cardHold = Game.player2card;
        if (player == 1) cardHold = Game.player1card;

        for (var i=block.bottomX; i<=block.topX; ++i) {
            Game.assignCard(1 - player, Game.createCard(block.anchor1 + sign * (i - block.bottomX)));
            Game.dropCard(1 - player, dropLocation + (i - block.bottomX));
        }
        Game.assignCard(1 - player, cardHold);
    }
    else if (block.bottomX == block.topX) {
        var valid = [];
        var sign = 1;
        if (block.anchor1 < block.anchor2) sign = -1;
        else if (block.anchor1 == block.anchor2) sign = 0;

        for (var i=0; i<Game.map_grid.player_width; ++i) {
            var row = Game.findLowestFreeCell(i + offset);
            if (row - (block.topY - block.bottomY) >= 0) {
                valid.push(i);
            }
        }
        if (valid.length > 0) {
            dropLocation = valid[Crafty.math.randomInt(0, valid.length-1)];
        }
        else {
            dropLocation = 0;
        }
        var cardHold = Game.player2card;
        if (player == 1) cardHold = Game.player1card;

        for (var i=block.topY; i>=block.bottomY; --i) {
            Game.assignCard(1 - player, Game.createCard(block.anchor2 + sign * (block.topY - i)));
            Game.dropCard(1 - player, dropLocation);
        }
        Game.assignCard(1 - player, cardHold);
    }
    else {
	//panic
    }
},
makeBlocksFall: function() {
    var movedBlocks = [];
    for (var x = 0; x < this.map_grid.width; x++) {
        var lowestFreeCell = this.findLowestFreeCell(x);
        for (var y = lowestFreeCell-1; y >= 0; y--) {
            if (this.map_grid.cards[x][y].value != -1) {
                this.map_grid.cards[x][lowestFreeCell] = this.map_grid.cards[x][y];
                this.map_grid.cards[x][y] = this.empty_card;
                this.map_grid.cards[x][lowestFreeCell].moveTo(
                    x * this.map_grid.tile.width + 5,
                    lowestFreeCell * this.map_grid.tile.height + 5);
                movedBlocks.push([x, lowestFreeCell]);
                lowestFreeCell --;
            }
        }
    }

    var largestBlock = null;
    for (var i = 0; i < movedBlocks.length; i++) {
        var block = this.checkCellForBlocks(movedBlocks[i][0], movedBlocks[i][1]);
        if (block && (!largestBlock || block.points > largestBlock.points)) {
            largestBlock = block;
        }
    }
    if (largestBlock) {
	var player = 0;
	if (largestBlock.bottomX < Game.player_width) player = 1;

        this.removeBlock(player, largestBlock);
    }
    //this.refreshCursorPos();
},            
    
        
findLowestFreeCell: function(column) {
    for (var i=this.map_grid.height-1; i>=0; --i) {
        if (this.map_grid.cards[column][i].value == -1) {
            return i;
        }
    }
    return -1;
},
checkPlayer1Lose: function() {
    for (var x = 0; x < this.map_grid.player_width; x++) {
        if (this.findLowestFreeCell(x) != -1) {
            return false;
        }
    }
    return true;
},
checkPlayer2Lose: function() {
    for (var x = this.map_grid.player_width + 1; x < 2 * this.map_grid.player_width + 1; x++) {
        if (this.findLowestFreeCell(x) != -1) {
            return false;
        }
    }
    return true;
},
refreshCursorPos: function() {
    this.leftMarker.x = this.map_grid.tile.width * this.player1pos + this.map_grid.tile.width / 3;
    this.leftMarker.y = this.map_grid.tile.height / 3 + this.map_grid.tile.height * this.findLowestFreeCell(this.player1pos);
    
    this.rightMarker.x = this.map_grid.tile.width * (this.player2pos + this.map_grid.player_width+1) + this.map_grid.tile.width / 3;
    this.rightMarker.y = this.map_grid.tile.height / 3 + this.map_grid.tile.height * this.findLowestFreeCell(this.player2pos+this.map_grid.player_width+1);
},
AImove: function() {
    //temporary AI code
    Game.player2pos = Game.calculateNextAIMove();
    dropPos = Game.dropCard(1, Game.player2pos);
    block = Game.checkCellForBlocks(dropPos[0], dropPos[1]);
    if (block) {
        Game.player2points += block.points;
        Game.removeBlock(1, block);

    }
    Game.player2card = Game.createCard(-1);
    Game.player2card.moveTo((Game.map_grid.player_width + 5) * Game.map_grid.tile.width, Game.map_grid.tile.height * (Game.map_grid.height+1));
    if (Game.checkPlayer2Lose()) {
        this.gameFinished(true, "He ran out of room!");
    }
    Game.refreshCursorPos();
    Game.updatePointsDisplay();
},


// Initialize and start our game
start: function() {


    // Start crafty and set a background color so that we can see it's working
    Crafty.init(Game.width(), Game.height());
    Crafty.background('green');


    var pay = Crafty.e("2D, DOM, Text, Mouse").attr({
        w : 2170,
        h : 400,
        x : 330,
        y : 400
    }).text("Click to Play Again").textFont({
        size : '40px'   
    });

    pay.bind('MouseUp', function(e) {
        if (e.mouseButton == Crafty.mouseButtons.LEFT) {
            location.reload();
        }
    });
    
    for (var x = 0; x < Game.map_grid.width; x++) {
        Game.map_grid.cards.push(new Array());
        for (var y = 0; y < Game.map_grid.height; y++) {
            Game.map_grid.cards[x].push(Game.empty_card);

            //color everything in
            if (((x%2==0 && y%2==0) || x%2==1 && y%2==1) && x != 6) {
                Crafty.e('2D, Canvas, Color')
                      .attr({
                          x: x * Game.map_grid.tile.width,
                          y: y * Game.map_grid.tile.height,
                          w: Game.map_grid.tile.width,
                          h: Game.map_grid.tile.height
                       })
                      .color('black');
            } else if(x!=6) {
                // divider
                Crafty.e('2D, Canvas, Color')
                      .attr({
                          x: x * Game.map_grid.tile.width,
                          y: y * Game.map_grid.tile.height,
                          w: Game.map_grid.tile.width,
                          h: Game.map_grid.tile.height
                       })
                      .color('red');
            }
        }
    }
    this.timeText = Crafty.e("2D, DOM, Text").attr({
        w : 2170,
        h : 400,
        x : 370,
        y : 450
    }).text(this.count).textFont({
        size : '40px'   
    });
    this.count = this.originalCount;

    
    this.leftMarker = Crafty.e("LeftMarker, 2D, DOM, Color")
        .color('rgb(0,255,255)')
        .attr({ x: Game.map_grid.tile.width / 3,
                y: Game.map_grid.tile.height / 3 + Game.map_grid.tile.height * 4,
                w: Game.map_grid.tile.width / 3,
                h: Game.map_grid.tile.height / 3 })
        .bind("KeyDown", function(e) {
            if (e.keyCode == 37) {
                if (Game.player1pos > 0) {
                    var originalPos = Game.player1pos;
                    --Game.player1pos;
                    while (Game.findLowestFreeCell(Game.player1pos) == -1) {
                        --Game.player1pos;
                        if (Game.player1pos < 0) {
                            Game.player1pos = originalPos;
                            break;
                        }
                    }
                    Game.refreshCursorPos();
                }
            } else if (e.keyCode == 39) {
                if (Game.player1pos < Game.map_grid.player_width-1) {
                    var originalPos = Game.player1pos;
                    ++Game.player1pos;
                    while (Game.findLowestFreeCell(Game.player1pos) == -1) {
                        ++Game.player1pos;
                        if (Game.player1pos >= Game.map_grid.player_width) {
                            Game.player1pos = originalPos;
                            break;
                        }
                    }
                    Game.refreshCursorPos();
                }
            } else if (Game.player1card != null && (e.keyCode == 32 || e.keyCode == 40) && Game.findLowestFreeCell(Game.player1pos) != -1) {
                var dropPos = Game.dropCard(0, Game.player1pos);

                Game.player1card = Game.createCard(-1);
                Game.player1card.moveTo(Game.map_grid.tile.width, Game.map_grid.tile.height * (Game.map_grid.height+1));
                var block = Game.checkCellForBlocks(dropPos[0], dropPos[1]);
                if (block) {
                    Game.player1points += block.points;
                    Game.removeBlock(0, block);
                }

                Game.refreshCursorPos();
                Game.updatePointsDisplay();
                if (Game.checkPlayer1Lose()) {
                    this.gameFinished(false, "You ran out of room!");
		    Crafty.audio.remove("theme");
                }
            }

        });
    this.rightMarker = Crafty.e("RightMarker, 2D, DOM, Color")
        .color('rgb(127, 0, 255)')
        .attr({x: Game.map_grid.tile.width / 3 + Game.map_grid.tile.width * 7,
               y: Game.map_grid.tile.height / 3 + Game.map_grid.tile.height * 4,
               w: Game.map_grid.tile.width / 3,
               h: Game.map_grid.tile.height / 3 });
    
    Crafty.e("2D, DOM, Text")
          .attr({x: Game.map_grid.tile.width, y:Game.map_grid.tile.height * 6 - 20, w: 100, h: 100 })
        .text('next card:').textFont({
         size : '15px'   
         });
          
    Crafty.e("2D, DOM, Text")
          .attr({x: (Game.map_grid.player_width + 5) * Game.map_grid.tile.width, y:Game.map_grid.tile.height * 6 - 20, w: 100, h: 100 })
        .text('next card:').textFont({
         size : '15px'   
         });
          
    Game.player1pointsText = Crafty.e("2D, DOM, Text").attr({
        w : 2170,
        h : 400,
        x : 80,
        y : 430
    });
    Game.player2pointsText = Crafty.e("2D, DOM, Text").attr({
        w : 2170,
        h : 400,
        x : 880,
        y : 430
    });
    Game.updatePointsDisplay();

    Game.player1card = Game.createCard(-1);
    Game.player1card.moveTo(Game.map_grid.tile.width, Game.map_grid.tile.height * (Game.map_grid.height+1));
    Game.player2card = Game.createCard(-1);
    Game.player2card.moveTo((Game.map_grid.player_width + 5) * Game.map_grid.tile.width, Game.map_grid.tile.height * (Game.map_grid.height+1));


    Crafty.audio.add("theme", "TetrisAmazingRemix.mp3");
    Crafty.audio.play("theme", -1, 0.25);

    this.counter=setInterval(this.timer.bind(this), 1000); //1000 will run it every 1 second
    this.count++; // Makes the count start at the original count.
    this.timer();
}
};


//
//
//
//
//


/*
    var titleText = Crafty.e("2D, DOM, Text").attr({
        w : 2170,
        h : 400,
        x : 435,
        y : 0
    }).text("CardBlocks").textFont({
        size : '40px'
    });
*/

    Game.start();

});


window.addEventListener('load', Screen.start);
