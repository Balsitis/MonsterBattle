var stage;
var queue;

window.addEventListener('resize', onWindowResized, false);
window.addEventListener('orientationchange', onWindowResized, false);

$(document).ready(function () {
	stage = new createjs.Stage("gameCanvas");
	stage.area = document.getElementById('gameArea');
	stage.ratio = stage.canvas.width / stage.canvas.height;

	//creating the progress label
	loadProgressLabel = new createjs.Text("", "18px Verdana", "black");
	loadProgressLabel.lineWidth = 200;
	loadProgressLabel.textAlign = "center";
	loadProgressLabel.x = stage.canvas.width / 2;
	loadProgressLabel.y = 50;
	stage.addChild(loadProgressLabel);

	//container that holds all the elements of the loading bar
	loadingBarContainer = new createjs.Container();

	//the height width and color of the loading bar
	loadingBarHeight = 20;
	loadingBarWidth = 300;
	loadingBarColor = createjs.Graphics.getRGB(0, 0, 0);

	//creating the loading bar   
	loadingBar = new createjs.Shape();
	loadingBar.graphics.beginFill(loadingBarColor).drawRect(0, 0, 1, loadingBarHeight).endFill();

	//creating the frame around the loading bar
	frame = new createjs.Shape();
	padding = 3;
	frame.graphics.setStrokeStyle(1).beginStroke(loadingBarColor).drawRect(-padding / 2, -padding / 2, loadingBarWidth + padding, loadingBarHeight + padding).endStroke();

	//adding the loading bar and the frame to our container and placing it on the desired position on the canvas
	loadingBarContainer.addChild(loadingBar, frame);
	loadingBarContainer.x = Math.round(stage.width / 2 - loadingBarWidth / 2);
	loadingBarContainer.y = 100;

	//adding the container with the elements to our stage
	stage.addChild(loadingBarContainer);
	
	queue = new createjs.LoadQueue(true);
	queue.installPlugin(createjs.Sound);
	queue.addEventListener("progress", onGameLoadProgress);
	queue.addEventListener("complete", onGameLoaded);
	queue.loadManifest([{
		id: "roar", src: "sounds/roar.mp3"
	}, {
		id: "daisy", src: "images/image.png"
	}]);

	stage.update();
});

function onGameLoadProgress(event)
{
	//changing the length of our loading bar accordingly
	loadingBar.scaleX = queue.progress * loadingBarWidth;
	//and the precentage in the loading label
	progresPrecentage = Math.round(queue.progress * 100);
	loadProgressLabel.text = progresPrecentage + "% Loaded";
	//updating the stage to draw the changes
	stage.update();

	console.log(event.loaded, event.total);
	wait(500);
}

function wait(ms) {
	var d = new Date();
	var d2 = null;

	do { d2 = new Date(); }
	while (d2 - d < ms);
}

function onGameLoaded(event) {
	var bg = new createjs.Shape();
	bg.graphics.clear()
	bg.graphics.beginFill("#222").drawRect(0, 0, stage.canvas.width, stage.canvas.height);
	stage.addChild(bg);

	var ball = new createjs.Shape();
	ball.addEventListener("click", onBallClicked);
	ball.graphics.beginFill("#000").drawCircle(0, 0, 50);
	ball.x = 50;
	ball.y = 200;
	stage.addChild(ball);
	createjs.Tween.get(ball, { loop: true }).to({ x: stage.canvas.width-50 }, 3000).to({ x: 50 }, 3000);

	createjs.Ticker.addEventListener("tick", onTick);

	onWindowResized();
}

function onBallClicked(event) {
	var bmp = new createjs.Bitmap(queue.getResult("daisy"));
	bmp.x = Math.random() * stage.canvas.width;
	bmp.y = Math.random() * stage.canvas.height;
	stage.addChild(bmp);

	createjs.Sound.play("roar");
}

function onWindowResized() {
	var newWidth = window.innerWidth;
	var newHeight = window.innerHeight;
	var newWidthToHeight = newWidth / newHeight;

	if (newWidthToHeight > stage.ratio) {
		newWidth = newHeight * stage.ratio;
	} else {
		newHeight = newWidth / stage.ratio;
	}

	stage.area.style.width = newWidth + 'px';
	stage.area.style.height = newHeight + 'px';
	stage.area.style.marginTop = (-newHeight / 2) + 'px';
	stage.area.style.marginLeft = (-newWidth / 2) + 'px';

	stage.canvas.style.width = newWidth;
	stage.canvas.style.height = newHeight;
}

function onTick(event) {
	stage.update();
}
