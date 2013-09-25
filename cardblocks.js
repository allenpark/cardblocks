var MIN_CARD = 1;
var MAX_CARD = 4;
var MIN_DUPLICATE_SIZE = 2;
var MIN_STRAIGHT_SIZE = 3;

Crafty.scene("menu", function() {
    var count=5;

    var timeText = Crafty.e("2D, DOM, Text").attr({
        w : 2170,
        h : 400,
        x : 370,
        y : 450
    }).text("time remaining: " + count).textFont({
        size : '40px'   
    });

    var counter=setInterval(timer, 1000); //1000 will  run it every 1 second


    function timer()
    {
        count=count-1;
        if (count < 0)
        {
            clearInterval(counter);
            return;
        }
        var min =Math.floor(count/60);
        var sec =  count%60
        if (sec<10)
        {
            timeText.text("time remaining: " + min + ": " + "0" + sec );
        } else {
            timeText.text("time remaining: " + min + ": " + sec );
        }
	if (min ==0 && sec == 0){
	   // Crafty("2D").destroy();
	    Crafty("*").each(function() {
		this.destroy();
	    });
	    //Game.start();

	     Crafty.e("2D, DOM, Text").attr({
		 w : 2170,
		 h : 400,
		 x : 370,
		 y : 450
	     }).text("GAME OVER").textFont({
		 size : '40px'   
	     });
 	}
    }

    timer();
    var titleText = Crafty.e("2D, DOM, Text").attr({
        w : 2170,
        h : 400,
        x : 435,
        y : 0
    }).text("CardBlocks").textFont({
        size : '40px'
    });
});

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
player1pos: 0,
player2pos: 0,
player1card: null,
player2card: null,
player1points: 0,
player2points: 0,
leftMarker: null,
rightMarker: null,

width: function() {
    return this.map_grid.width * this.map_grid.tile.width;
},

height: function() {
    return this.map_grid.height * this.map_grid.tile.height
        + 2*this.map_grid.tile.height;
},



createCard: function() {
    var card = {};
    card.value = Crafty.math.randomInt(MIN_CARD, MAX_CARD);
    card.bg = Crafty.e("Card, 2D, DOM, Color")
                    .color('rgb(255, 255, 255)')
                    .attr({ x: 0,
                            y: 0,
                            w: Game.map_grid.tile.width - 10,
                            h: Game.map_grid.tile.height - 10 });
    card.text = Crafty.e("2D, DOM, Text")
                      .attr({ x: 10, y:10, })
                      .text(card.value);
                //TODO: figure out how to make the text larger
    card.moveTo = function(x, y) { this.bg.x = x; this.bg.y = y; };
    
    card.bg.attach(card.text);
    card.bg.z = 1;
    card.text.z = 2;
    
    return card;
},
dropCard: function(index) {
    if (index == 0) {
        var column = this.player1pos;
        var row = this.findLowestFreeCell(column);
     
        this.player1card.moveTo(column * this.map_grid.tile.width + 5,
                                 row * this.map_grid.tile.height + 5);
        this.map_grid.cards[column][row] = this.player1card;
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
checkCellForBlocks: function(cellX, cellY) {
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
    while (topX < this.map_grid.player_width && this.map_grid.cards[topX][cellY].value == cellContents) {
        topX ++;
    }
    topX --; // This is the top contiguous x that matches cellContents.
    if (topX - bottomX + 1 >= MIN_DUPLICATE_SIZE) {
        var points = this.calculatePoints(topX - bottomX + 1, type);
        if (!bestBlock || points >= bestBlock.points) {
            bestBlock = {bottomX: bottomX, bottomY: cellY, topX: topX, topY: cellY, type: type, points: points};
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
    if (topY - bottomY + 1 >= MIN_DUPLICATE_SIZE) {
        var points = this.calculatePoints(topY - bottomY + 1, type);
        if (!bestBlock || points >= bestBlock.points) {
            bestBlock = {bottomY: bottomY, bottomX: cellX, topY: topY, topX: cellX, type: type, points: points};
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
    while (topX < this.map_grid.player_width && this.map_grid.cards[topX][cellY].value == cellContents + (topX - cellX)) {
        topX ++;
    }
    topX --; // This is the top contiguous x that matches cellContents.
    if (topX - bottomX + 1 >= MIN_STRAIGHT_SIZE) {
        var points = this.calculatePoints(topX - bottomX + 1, type);
        if (!bestBlock || points >= bestBlock.points) {
            bestBlock = {bottomX: bottomX, bottomY: cellY, topX: topX, topY: cellY, type: type, points: points};
        }
    }

    // Checking X decreasing straights.
    var bottomX = cellX - 1;
    while (bottomX >= 0 && this.map_grid.cards[bottomX][cellY].value == cellContents + (cellX - bottomX)) {
        bottomX --;
    }
    bottomX ++; // This is the lowest contiguous x that matches cellContents.
    var topX = cellX + 1;
    while (topX < this.map_grid.player_width && this.map_grid.cards[topX][cellY].value == cellContents - (topX - cellX)) {
        topX ++;
    }
    topX --; // This is the top contiguous x that matches cellContents.
    if (topX - bottomX + 1 >= MIN_STRAIGHT_SIZE) {
        var points = this.calculatePoints(topX - bottomX + 1, type);
        if (!bestBlock || points >= bestBlock.points) {
            bestBlock = {bottomX: bottomX, bottomY: cellY, topX: topX, topY: cellY, type: type, points: points};
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
    if (topY - bottomY + 1 >= MIN_STRAIGHT_SIZE) {
        var points = this.calculatePoints(topX - bottomX + 1, type);
        if (!bestBlock || points >= bestBlock.points) {
            bestBlock = {bottomY: bottomY, bottomX: cellX, topY: topY, topX: cellX, type: type, points: points};
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
    if (topY - bottomY + 1 >= MIN_STRAIGHT_SIZE) {
        var points = this.calculatePoints(topY - bottomY + 1, type);
        if (!bestBlock || points >= bestBlock.points) {
            bestBlock = {bottomY: bottomY, bottomX: cellX, topY: topY, topX: cellX, type: type, points: points};
        }
    }

    return bestBlock;
},
removeBlock: function(block) {
    if (!block) {
        return;
    }
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
makeBlocksFall: function() {
    var movedBlocks = [];
    for (var x = 0; x < this.map_grid.player_width; x++) {
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
        this.removeBlock(largestBlock);
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
refreshCursorPos: function() {
    leftMarker.x = this.map_grid.tile.width * this.player1pos + this.map_grid.tile.width / 3;
    leftMarker.y = this.map_grid.tile.height / 3 + this.map_grid.tile.height * this.findLowestFreeCell(this.player1pos);
},


// Initialize and start our game
start: function() {
    // Start crafty and set a background color so that we can see it's working
    Crafty.init(Game.width(), Game.height());
    Crafty.background('green');
    Crafty.scene("menu");

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
    
    this.leftMarker = Crafty.e("LeftMarker, 2D, DOM, Color")
        .color('rgb(0,255,255)')
        .attr({ x: Game.map_grid.tile.width / 3,
                y: Game.map_grid.tile.height / 3 + Game.map_grid.tile.height * 4,
                w: Game.map_grid.tile.width / 3,
                h: Game.map_grid.tile.height / 3 })
        .bind("KeyDown", function(e) {
            if (e.keyCode == 37) {
                if (Game.player1pos > 0) {
                    --Game.player1pos;
                    Game.refreshCursorPos();
                }
            } else if (e.keyCode == 39) {
                if (Game.player1pos < Game.map_grid.player_width-1) {
                    ++Game.player1pos;
                    Game.refreshCursorPos();
                }
            } else if (Game.player1card != null && (e.keyCode == 32 || e.keyCode == 40)) {
                var dropPos = Game.dropCard(0);

                Game.player1card = Game.createCard();
                Game.player1card.moveTo(Game.map_grid.tile.width, Game.map_grid.tile.height * (Game.map_grid.height+1));
                var block = Game.checkCellForBlocks(dropPos[0], dropPos[1]);
                if (block) {
                    Game.removeBlock(block);
                }
                Game.refreshCursorPos();
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
          .text('next card:');

    Game.player1card = Game.createCard();
    Game.player1card.moveTo(Game.map_grid.tile.width, Game.map_grid.tile.height * (Game.map_grid.height+1));
}
};
window.addEventListener('load', Game.start);
