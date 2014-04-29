monsterBattle.LoadingBar = function(x, y, width, height) {
	var loadProgressLabel = new createjs.Text("", "22px Verdana", "#000");
	loadProgressLabel.lineWidth = width;
	loadProgressLabel.textAlign = "center";
	loadProgressLabel.y = 60;
	loadProgressLabel.x = width / 2;

	var title = new createjs.Text("", "44px Verdana", "#000");
	title.lineWidth = width;
	title.textAlign = "center";
	title.y = 5;
	title.x = width / 2;
	title.text = "Prepare for Battle!";

	var loadingBar = new createjs.Shape();
	loadingBar.graphics.beginFill(monsterBattle.toRgb("#E42217", .50)).drawRect(0, 0, 1, height).endFill();

	var loadingBarContainer = new createjs.Container();
	loadingBarContainer.addChild(loadingBar, loadProgressLabel, title);
	loadingBarContainer.y = stage.canvas.height/2 - height/2;

	loadingBarContainer.update = function (event) {
		loadingBar.scaleX = queue.progress * width;
		loadProgressLabel.text = Math.round(queue.progress * 100) + "% Loaded";
		stage.update();
		wait(500);
	}

	return loadingBarContainer;
}
