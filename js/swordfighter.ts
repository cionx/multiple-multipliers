export { SwordFighter };


import { Coordinate } from "./coordinate.js";
import { Fighter, Side } from "./fighter.js";
import { Sprite } from "./sprite.js"


class SwordFighter extends Fighter {

	constructor(coord: Coordinate, side: Side) {
		const sprite = new Sprite("../graphics/stick-figure.png");
		super(coord, sprite, 5, 2, 1, 10, 1000, side);
	}
}
