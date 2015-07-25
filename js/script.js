var main = function(){
var my_media;
//var my_media_teleport;
		 
var playAudio = function(audioID) {
	var audioElement = document.getElementById(audioID);
	var url = audioElement.getAttribute('src');
	my_media = new Media(url,
			// success callback
			 function () { my_media.release(); },
			// error callback
			 function (err) { my_media.release(); }
	);
		   // Play audio
	my_media.play();
}

// var playAudioTeleport = function(audioID) {
	// var audioElement = document.getElementById(audioID);
	// var url = audioElement.getAttribute('src');
	// my_media_teleport = new Media(url,
			// // success callback
			 // function () { console.log("playAudioTeleport():Audio Success"); },
			// // error callback
			 // function (err) { console.log("playAudioTeleport():Audio Error: " + err); }
	// );
		   // // Play audio
	// my_media_teleport.play();
// }

var playerNumInit = function(){
	var queryString = new Array();
	if(queryString.length === 0){
		if (window.location.search.split('?').length > 1){
			var params = window.location.search.split('?')[1].split('&');
			for (var i=0;i<params.length;i++){
				var key = params[i].split('=')[0];
				var value = decodeURIComponent(params[i].split('=')[1]);
				queryString[key]=value;
			}
		}
	}
	if (queryString["playerNum"]!=null){
		var playerNum = queryString["playerNum"];
		return playerNum;
	}	
}

var p1Coin;
var p2Coin;
var p3Coin;
var p4Coin;
var speed;
var activeCoin;
var ac;

var cellSize = 60;
var topBorderOfBoard = 60;
var homeLocationXCoordinate = 0.3*cellSize; //3rd quadrant radius + cellSize/10
var homeLocationYCoordinate = 0.7*cellSize + topBorderOfBoard; //3rd quadrant
var lineStartPoint = 1.3 * cellSize; //cellSize + 0.3*cellSize;
var lineEndPoint = 10.3 * cellSize;
var rightSingleLineMaxLength = 11 * cellSize; //number of cells = 10 + border = cellSize
var rightDoubleLineMaxLength = 21 * cellSize; //number of movement when moved 2 lines starting from right includes 1 extra cellSize area at extreme left
var leftSingleLineMinLength = cellSize; //leftBorder = cellSize
var leftDoubleLineMinLength = -(9 * cellSize);
var adjustmentFactor = 0.4 * cellSize;
var containerTurn; 

var countSix = 0;

var stage = new createjs.Stage("myCanvas");
createjs.Ticker.setFPS(60);

createjs.Ticker.addEventListener("tick", stage);

var playerNum = playerNumInit();

if (playerNum === "1"){
		document.getElementById("controlPlayer3").style.visibility = "hidden";
		document.getElementById("controlPlayer4").style.visibility = "hidden";
		// document.getElementById("player2Name").innerHTML = "Computer";
		document.getElementById("dicePlayer2").disabled = true;
		$('#leftCol').toggleClass('player2');
		$('#rightCol').toggleClass('player2');
	}
	else if (playerNum === "2"){
		document.getElementById("controlPlayer3").style.visibility = "hidden";
		document.getElementById("controlPlayer4").style.visibility = "hidden";
		$('#leftCol').toggleClass('player2');
		$('#rightCol').toggleClass('player2');
	}
	else if (playerNum === "3"){
		document.getElementById("controlPlayer4").style.visibility = "hidden";
		$('#leftCol').toggleClass('player4');
		$('#rightCol').toggleClass('player2');
	}

var createCircle = function(){
	
	for (var i=playerNum;i>=1;i--){
	window["coin" + i] = new createjs.Shape();
		window["coin" + i].x = homeLocationXCoordinate;
		window["coin" + i].y = homeLocationYCoordinate;
		if (i == 1){
			window["coin" + i].graphics.beginFill("#4670bf").drawCircle(0, 0, cellSize/5);
		}
		else if (i == 2){
			window["coin" + i].graphics.beginFill("#c04848").drawCircle(0, 0, cellSize/5);
		}
		else if (i == 3){
			window["coin" + i].graphics.beginFill("#79c77d").drawCircle(0, 0, cellSize/5);
		}
		else{
			window["coin" + i].graphics.beginFill("#f1f294").drawCircle(0, 0, cellSize/5);
		}
		
		stage.addChild(window["coin" + i]);
	}
		
	stage.update();
}

var teleport = [
		 {startPoint:8,endPoint:26,xCoordinate:(6.3 * cellSize),yCoordinate:(2.7*cellSize)+topBorderOfBoard,line:3,image:"images/teleport0.png"},
		 {startPoint:19,endPoint:38,xCoordinate:(3.3 * cellSize),yCoordinate:(3.7*cellSize)+topBorderOfBoard,line:4,image:"images/teleport1.png"},
		 {startPoint:21,endPoint:82,xCoordinate:(2.3 * cellSize),yCoordinate:(8.7*cellSize)+topBorderOfBoard,line:9,image:"images/teleport2.png"},
		 {startPoint:28,endPoint:53,xCoordinate:(8.3 * cellSize),yCoordinate:(5.7*cellSize)+topBorderOfBoard,line:6,image:"images/teleport3.png"},
		 {startPoint:36,endPoint:57,xCoordinate:(4.3 * cellSize),yCoordinate:(5.7*cellSize)+topBorderOfBoard,line:6,image:"images/teleport4.png"},
		 {startPoint:43,endPoint:77,xCoordinate:(4.3 * cellSize),yCoordinate:(7.7*cellSize)+topBorderOfBoard,line:8,image:"images/teleport5.png"},
		 {startPoint:46,endPoint:15,xCoordinate:(6.3 * cellSize),yCoordinate:(1.7*cellSize)+topBorderOfBoard,line:2,image:"images/teleport6.png"},
		 {startPoint:48,endPoint:9,xCoordinate:(9.3 * cellSize),yCoordinate:(0.7*cellSize)+topBorderOfBoard,line:1,image:"images/teleport7.png"},
		 {startPoint:52,endPoint:11,xCoordinate:(10.3 * cellSize),yCoordinate:(1.7*cellSize)+topBorderOfBoard,line:2,image:"images/teleport8.png"},
		 {startPoint:54,endPoint:88,xCoordinate:(8.3 * cellSize),yCoordinate:(8.7*cellSize)+topBorderOfBoard,line:9,image:"images/teleport9.png"},
		 {startPoint:59,endPoint:18,xCoordinate:(3.3 * cellSize),yCoordinate:(1.7*cellSize)+topBorderOfBoard,line:2,image:"images/teleport10.png"},
		 {startPoint:61,endPoint:99,xCoordinate:(2.3 * cellSize),yCoordinate:(9.7*cellSize)+topBorderOfBoard,line:10,image:"images/teleport11.png"},
		 {startPoint:62,endPoint:96,xCoordinate:(5.3 * cellSize),yCoordinate:(9.7*cellSize)+topBorderOfBoard,line:10,image:"images/teleport12.png"},
		 {startPoint:64,endPoint:25,xCoordinate:(5.3 * cellSize),yCoordinate:(2.7*cellSize)+topBorderOfBoard,line:3,image:"images/teleport13.png"},
		 {startPoint:66,endPoint:87,xCoordinate:(7.3 * cellSize),yCoordinate:(8.7*cellSize)+topBorderOfBoard,line:9,image:"images/teleport14.png"},
		 {startPoint:68,endPoint:2,xCoordinate:(2.3 * cellSize),yCoordinate:(0.7*cellSize)+topBorderOfBoard,line:1,image:"images/teleport15.png"},
		 {startPoint:69,endPoint:33,xCoordinate:(8.3 * cellSize),yCoordinate:(3.7*cellSize)+topBorderOfBoard,line:4,image:"images/teleport16.png"},
		 {startPoint:83,endPoint:22,xCoordinate:(2.3 * cellSize),yCoordinate:(2.7*cellSize)+topBorderOfBoard,line:3,image:"images/teleport17.png"},
		 {startPoint:89,endPoint:51,xCoordinate:(10.3 * cellSize),yCoordinate:(5.7*cellSize)+topBorderOfBoard,line:6,image:"images/teleport18.png"},
		 {startPoint:93,endPoint:24,xCoordinate:(4.3 * cellSize),yCoordinate:(2.7*cellSize)+topBorderOfBoard,line:3,image:"images/teleport19.png"},
		 {startPoint:98,endPoint:13,xCoordinate:(8.3 * cellSize),yCoordinate:(1.7*cellSize)+topBorderOfBoard,line:2,image:"images/teleport20.png"}
	];

	var incrementPlayer = function() {
		if (playerNum > 1){
			if(activePlayer === (playerNum-1))
				activePlayer=0;
			else
				activePlayer++;
			for (var i=1;i<=playerNum;i++){
				if ((activePlayer+1) === i){
					document.getElementById("dicePlayer"+i).disabled = false;
				}
				else{
					document.getElementById("dicePlayer"+i).disabled = true;
				}
			}

			stage.removeChild(containerTurn);
			
			containerTurn = new createjs.Container(); 
			var textFontSize = topBorderOfBoard/3;
			textTurn = new createjs.Text("Player" + (activePlayer+1) +" turn", textFontSize +"px raleway", "#fff"); 
			containerTurn.addChild(textTurn); 
			containerTurn.x = (cellSize*10)/2; 
			containerTurn.y = cellSize/2; 
			
			stage.addChild(containerTurn); 
			stage.update();
			
			steps = 0;
			xCoordinate = player[activePlayer].xCoordinate;
			yCoordinate = player[activePlayer].yCoordinate;
			lineNumber = player[activePlayer].lineNumber;
		}
		
		else {
			steps = 0;
			if (activePlayer === 0){
				activePlayer = 1;
				document.getElementById("dicePlayer1").disabled=true;
				ran = Math.floor(Math.random() * 6) + 1;
				setTimeout(function(){
					ranValueOnCanvas(ran);
				},1500);
				
				xCoordinate = player[activePlayer].xCoordinate;
				yCoordinate = player[activePlayer].yCoordinate;
				lineNumber = player[activePlayer].lineNumber;
				game();
			}
			else{
				activePlayer = 0;
				xCoordinate = player[activePlayer].xCoordinate;
				yCoordinate = player[activePlayer].yCoordinate;
				lineNumber = player[activePlayer].lineNumber;
				document.getElementById("dicePlayer1").disabled=false;
			}
		}
		
	}
	
	var checkTeleport = function() {
		var teleportStatus=0;
		var teleportType;
		for (var i=0;i<teleport.length;i++){
			if (endLocation === teleport[i].startPoint){
				
				var messageColor;
				if (endLocation < teleport[i].endPoint){
					//Ladder
					teleportType = "Ladder";
					playAudio("LadderAudio");
					messageColor = "#8BC34A";
				}
				else{
					//Snake
					teleportType = "Snake";
					playAudio("SnakeAudio");
					messageColor = "#EF5350";
				}
				
				endLocation = teleport[i].endPoint;
				lineNumber = teleport[i].line;
			
				xCoordinate = teleport[i].xCoordinate;
				yCoordinate = teleport[i].yCoordinate
			
				createjs.Tween.get(window["coin" + (activePlayer + 1)], { loop: false })
				.to({ x: (xCoordinate), y: yCoordinate}, 1500).call(incrementPlayer);
				
				
				player[activePlayer].lineNumber= lineNumber;
				player[activePlayer].xCoordinate = teleport[i].xCoordinate;
				player[activePlayer].yCoordinate = teleport[i].yCoordinate;
				player[activePlayer].currentLocation = teleport[i].endPoint;
				canvasImage = teleport[i].image;
				var container = new createjs.Container(); 
				var image = new createjs.Bitmap(canvasImage); 
				container.addChild(image); 
				container.x = ((cellSize*10)/2) + 80; 
				container.y = ((cellSize*10)/2); 
				
				stage.addChild(container); 
				stage.update();
		
				 createjs.Tween.get(image).set({alpha:1, regX: 240, regY: 30, scaleX:1, scaleY:1}).to({alpha:1, scaleX:1.3, scaleY:1.3}, 1000).to({alpha:1, scaleX:1.3, scaleY:1.3}, 2000).call(setTimeout);
				setTimeout(function() {
					my_media.pause();
					stage.removeChild(container);
				//Tween complete
				},3500)
				
				teleportStatus = 1;
				
				break;
			}
		}
		if (teleportStatus === 0){
			incrementPlayer();
		}
	}

	var checkWinStatus = function() {
		if (endLocation < 100){
			winStatus = 0;
			player[activePlayer].currentLocation = endLocation;
		}
		else if (endLocation === 100){
			winStatus = 1;
			window.document.location.href = "endGame.html?num=" + playerNum + "&winId=" + (activePlayer+1);
			player[activePlayer].currentLocation = player[activePlayer].currentLocation + steps;

			createjs.Tween.get(window["coin" + (activePlayer + 1)], { loop: false })
		    .to({ x: xCoordinate},100)
			
			var winMessage = "Player" + [activePlayer + 1] + " wins"
			var container = new createjs.Container(); 
			var textFontSize = 40;
			
			text = new createjs.Text(winMessage, textFontSize +"px" + "fonts/Bangers.ttf", "#ffa250"); 
			container.addChild(text); 
			container.x = cellSize*4; 
			container.y = (cellSize*6) - textFontSize; 
			
			container.shadow = new createjs.Shadow("#000000", 5, 5, 10);
			stage.addChild(container); 
			stage.update();
			createjs.Tween.get(text).set({alpha:1, regX: 5, regY: 20, scaleX:1, scaleY:1}).to({alpha:1, scaleX:2, scaleY:2}, 100).to({alpha:1, scaleX:2, scaleY:2}, 500);
		}
		else{
			winStatus = -1;
			player[activePlayer].currentLocation = player[activePlayer].currentLocation;
			endLocation = player[activePlayer].currentLocation;
		}
	}
	
	var moveRight = function() {
		xCoordinate = player[activePlayer].xCoordinate + (steps * cellSize);
		yCoordinate = player[activePlayer].yCoordinate;
		if (xCoordinate > rightSingleLineMaxLength && xCoordinate < rightDoubleLineMaxLength){
			yCoordinate = yCoordinate + cellSize;
			xCoordinate = ((20*cellSize) - (xCoordinate - (2*cellSize))) - adjustmentFactor;
			lineNumber++;
			
			createjs.Tween.get(window["coin" + (activePlayer + 1)], { loop: false })
		    .to({ x: lineEndPoint}, 1000)
			.to({ y: yCoordinate}, 300)
			.to({ x: xCoordinate}, 1000)
			.call(checkTeleport);	
		}
		else if (xCoordinate > rightDoubleLineMaxLength){
			yCoordinate = yCoordinate + (2*cellSize);
			xCoordinate = xCoordinate - (20*cellSize);
			lineNumber = lineNumber + 2;
			
			createjs.Tween.get(window["coin" + (activePlayer + 1)], { loop: false })
		    .to({ x: lineEndPoint}, 1000)
			.to({ y: yCoordinate - cellSize}, 300)
			.to({ x: lineStartPoint }, 1000)
			.to({ y: yCoordinate}, 300)
			.to({ x: xCoordinate}, 1000)
			.call(checkTeleport);
		}
		else{
			xCoordinate = xCoordinate;
			
		createjs.Tween.get(window["coin" + (activePlayer + 1)], { loop: false })
		    .to({ x: xCoordinate}, 1000)
			.call(checkTeleport);
		}
		player[activePlayer].xCoordinate = xCoordinate;
		player[activePlayer].yCoordinate = yCoordinate;
		player[activePlayer].lineNumber= lineNumber;
	}
	
	var moveLeft = function() {
		xCoordinate = player[activePlayer].xCoordinate - (steps * cellSize);
		yCoordinate = player[activePlayer].yCoordinate;
		if (xCoordinate < leftSingleLineMinLength && xCoordinate > leftDoubleLineMinLength){
			yCoordinate = yCoordinate + cellSize;
			xCoordinate = -(xCoordinate) + (2*cellSize) - adjustmentFactor;
			lineNumber++;
			
			createjs.Tween.get(window["coin" + (activePlayer + 1)], { loop: false })
		    .to({ x: lineStartPoint}, 1000)
			.to({ y: yCoordinate}, 300)
			.to({ x: (xCoordinate)}, 1000)
			.call(checkTeleport);
		}
		else if (xCoordinate < leftDoubleLineMinLength ){
			yCoordinate = yCoordinate + (2*cellSize);
			xCoordinate = (20*cellSize) + xCoordinate;
			lineNumber = lineNumber + 2;
			
			createjs.Tween.get(window["coin" + (activePlayer + 1)], { loop: false })
		    .to({ x: lineStartPoint}, 1000)
			.to({ y: yCoordinate - cellSize}, 300)
			.to({ x: lineEndPoint}, 1000)
			.to({ y: yCoordinate}, 300)
			.to({ x: xCoordinate}, 1000)
			.call(checkTeleport);
		}
		else{
			xCoordinate = xCoordinate;
			
			createjs.Tween.get(window["coin" + (activePlayer + 1)], { loop: false })
		    .to({ x: xCoordinate}, 1000)
			.call(checkTeleport);
		}
		player[activePlayer].xCoordinate = xCoordinate;
		player[activePlayer].yCoordinate = yCoordinate;
		player[activePlayer].lineNumber= lineNumber;
	}
	
	var continueOnboard = function(){
	
	if (ran === 6){
		countSix = countSix + 1;
		if (countSix === 3){
			steps = 0;
		}
		else{
			steps = steps + ran;
		}
		if (playerNum === "1" && activePlayer === 1){
			ran = Math.floor(Math.random() * 6) + 1;
			setTimeout(function(){
				ranValueOnCanvas(ran);
			},1500);
			game();
		}
	}
	else{
		countSix = 0;
		steps = steps + ran;
		elementId = "player"+(activePlayer + 1);
		endLocation = player[activePlayer].currentLocation + steps;
		checkWinStatus();
		if (winStatus === 1){
			createjs.Tween.get(window["coin" + (activePlayer + 1)], { loop: false })
		    .to({ x: lineStartPoint}, 1000)
			.call(incrementPlayer()); 
		 }
		if (winStatus === -1){
			incrementPlayer();
		}
		else{
			speed=100*steps;
			document.getElementById("dicePlayer"+(activePlayer+1)).disabled = true;
			if (player[activePlayer].lineNumber%2 != 0){
				moveRight();
			}
			else{
				moveLeft();
			}		
		} 
	}
}
	
	var game = function(){	
		if (player[activePlayer].onboard === 0 && ran === 6){
			player[activePlayer].onboard = 1;
			elementId = "player"+(activePlayer+1);
			endLocation = player[activePlayer].currentLocation + steps;
			if (playerNum === "1" && activePlayer === 1){
				ran = Math.floor(Math.random() * 6) + 1;
				setTimeout(function(){
					ranValueOnCanvas(ran);
				},1500);
				game();
			}
			
		}
		else if (player[activePlayer].onboard === 1){
			continueOnboard();
		}
		else{
			incrementPlayer();
		}
	}
	
	var lineNumber = 1;
	var endLocation;
	var winStatus = 0;
	var steps = 0;
	var elementId;
	var player = [
		{onboard:0,currentLocation:0,xCoordinate:homeLocationXCoordinate,yCoordinate:homeLocationYCoordinate,lineNumber:1},
		{onboard:0,currentLocation:0,xCoordinate:homeLocationXCoordinate,yCoordinate:homeLocationYCoordinate,lineNumber:1},
		{onboard:0,currentLocation:0,xCoordinate:homeLocationXCoordinate,yCoordinate:homeLocationYCoordinate,lineNumber:1},
		{onboard:0,currentLocation:0,xCoordinate:homeLocationXCoordinate,yCoordinate:homeLocationYCoordinate,lineNumber:1},
	];
	var ran;
	var win = 0;
	var activePlayer = 0;
	
	if (playerNum > 1){
		for (var i=1;i<=playerNum;i++){
			if ((activePlayer+1) === i){
				document.getElementById("dicePlayer"+i).disabled = false;
			}
			else{
				document.getElementById("dicePlayer"+i).disabled = true;
			}
		}
	}
	else{
		if (activePlayer === 1){
			document.getElementById("dicePlayer1").disabled = true;
		}
	}
	
	createCircle()
	
	var ranValueOnCanvas = function(ran){
		var container = new createjs.Container(); 
        //var textFontSize = 60;
		image = new createjs.Bitmap("images/showDice"+ran+".png"); 
		container.addChild(image); 
		container.x = ((cellSize*10)/2); 
		container.y = ((cellSize*10)/2); 
		
        // image = new createjs.Text(ran, textFontSize +"px bangers", "#ffffe7 "); 
            
        // container.addChild(text); 
        // container.x = (cellSize*6) - textFontSize/4; 
        // container.y = (cellSize*6) - textFontSize; 
        container.name = ran; 
        
        //container.shadow = new createjs.Shadow("#000000 ", 5, 5, 10);
        stage.addChild(container); 
        stage.update();
        
        createjs.Tween.get(image).set({alpha:1, scaleX:1, scaleY:1}).to({alpha:1, scaleX:1, scaleY:1}, 200).call(setTimeout);
        
        function setTimeout() {
            stage.removeChild(container);
        //Tween complete
        }
	}

	$('#dicePlayer1').click(function(){
		playAudio("DiceRollAudio");
		ran = Math.floor(Math.random() * 6) + 1;
		ranValueOnCanvas(ran);
		game();
	});
	
	$('#dicePlayer2').click(function(){
		playAudio("DiceRollAudio");
		ran = Math.floor(Math.random() * 6) + 1;
		ranValueOnCanvas(ran);
		game();
	});
	
	$('#dicePlayer3').click(function(){
		playAudio("DiceRollAudio");
		ran = Math.floor(Math.random() * 6) + 1;
		ranValueOnCanvas(ran);
		game();
	});
	
	$('#dicePlayer4').click(function(){
		playAudio("DiceRollAudio");
		ran = Math.floor(Math.random() * 6) + 1;
		ranValueOnCanvas(ran);
		game();
	});
};

$(document).ready(main);