export { SwordFighter };


import { Coordinate } from "./coordinate.js";
import { Fighter, Side } from "./fighter.js";
import { Sprite } from "./sprite.js"


const BASEHEALTH = 50;
const BASESPEED = 5;
const BASEDAMAGE = 2;
const BASERANGE = 45;
const BASEDELAY = 250;




class SwordFighter extends Fighter {

	constructor(coord: Coordinate, side: Side) {
		const sprite = new Sprite("../graphics/stick-figure.png");
		super(coord, sprite, BASEHEALTH, BASEDAMAGE, BASESPEED, BASERANGE, BASEDELAY, side);
	}
}
