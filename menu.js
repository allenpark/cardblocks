Crafty.scene("title", function() {
 Crafty.background('blue');
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
		 y : 150
	     }).text("Start").textFont({
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

startText.bind('MouseUp', function(e) {
    if( e.mouseButton == Crafty.mouseButtons.LEFT ){
	console.log("click works");


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
		 x : 270,
		 y : 0
	     }).text("Thanks for Playing our Crafty Game").textFont({
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
window.addEventListener('load', Screen.start);
