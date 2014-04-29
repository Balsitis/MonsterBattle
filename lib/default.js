var stage;
var queue;
var loadingBar;

var monsterBattle = (function () {
	var module = {};
	return module;
})();

window.addEventListener('resize', onWindowResized, false);
window.addEventListener('orientationchange', onWindowResized, false);

$(document).ready(function () {
	stage = new createjs.Stage("gameCanvas");
	stage.area = document.getElementById('gameArea');
	stage.ratio = stage.canvas.width / stage.canvas.height;

	onWindowResized();

	loadingBar = new monsterBattle.LoadingBar(0, 0, stage.canvas.width, 100);
	stage.addChild(loadingBar);

	queue = new createjs.LoadQueue(true);
	queue.installPlugin(createjs.Sound);
	queue.addEventListener("progress", loadingBar.update);
	queue.addEventListener("complete", onGameLoaded);
	queue.loadManifest([{
		id: "roar", src: "sounds/roar.mp3"
	}, {
		id: "daisy", src: "images/image.png"
	}]);

	stage.update();
});


function wait(ms) {
	var d = new Date();
	var d2 = null;

	do { d2 = new Date(); }
	while (d2 - d < ms);
}

function onGameLoaded(event) {
	stage.removeChild(loadingBar);
	var bg = new createjs.Shape();
	bg.graphics.clear()
	bg.graphics.beginFill(monsterBattle.toRgb("#000000", .75)).drawRect(0, 0, stage.canvas.width, stage.canvas.height);
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
