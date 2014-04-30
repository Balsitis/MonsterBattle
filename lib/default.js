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
		id: "monster1", src: "images/monster.01.png"
	}, {
		id: "monster2", src: "images/monster.02.png"
	}, {
		id: "monster3", src: "images/monster.03.png"
	}]);

	stage.update();
});


function wait(ms) {
	//var d = new Date();
	//var d2 = null;

	//do { d2 = new Date(); }
	//while (d2 - d < ms);
}

function onGameLoaded(event) {
	stage.removeChild(loadingBar);

	var bg = new createjs.Shape();
	bg.graphics.clear()
	bg.graphics.beginFill(monsterBattle.toRgb("#000000", .75)).drawRect(0, 0, stage.canvas.width, stage.canvas.height);
	stage.addChild(bg);

	addMonster(1, 100);
	addMonster(2, 100);
	addMonster(3, 100);

	createjs.Ticker.addEventListener("tick", onTick);

	onWindowResized();
}

function addMonster(number, size) {
	var bmp = new createjs.Bitmap(queue.getResult("monster"+number));
	var imgRatio = size / bmp.getBounds().width;
	bmp.setTransform(number * size + number * 200, 0, imgRatio, imgRatio);
	bmp.addEventListener("click", onMonsterClicked);
	bmp.name = "monster" + number;
	stage.addChild(bmp);
}

function onMonsterClicked(event) {

	createjs.Sound.play("roar");

	var count = [];
	for (var i = 0; i <  stage.getNumChildren(); i++) {
		var child = stage.getChildAt(i);
		console.log(child.name, event.target.name);
		if (child.name != event.target.name && child.name && child.name.indexOf("monster") > -1) {
			count.push(child);
		}
	}

	for (var i = 0; i < count.length; i++) {
		stage.removeChild(count[i]);
	}

	createjs.Tween.get(stage.getChildByName(event.target.name)).to({
		scaleX: 1, scaleY: 1
	}, 1000);
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
