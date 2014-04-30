monsterBattle.toRgb = function (hex, alpha) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		var rgb = result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
		return createjs.Graphics.getRGB(rgb.r, rgb.g, rgb.b, alpha);
}
