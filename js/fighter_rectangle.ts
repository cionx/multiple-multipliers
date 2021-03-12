export { Rectangle };


import { Coordinate } from "./coordinate.js";
import { Fighter, SideType } from "./fighter.js";
import { fightManager } from "./game_manager.js";
import { Projectile } from "./projectile.js";
import { Sprite } from "./sprite.js";


const SIZETOHEALTH = 3;
const SIZETOWIDTH = 1;
const SIZETOHEIGHT = 2;

const BASESIZE = 15
const BASEWIDTH = SIZETOWIDTH * BASESIZE;
const BASEHEIGHT = SIZETOHEIGHT * BASESIZE;
const BASEHEALTH = SIZETOHEALTH * BASESIZE;
const BASESPEED = 1.8;
const BASEDAMAGE = 10;
const BASESPLASH = 50;
const BASERANGE = 700;
const BASEDELAY = 2500;


const propertyArray = <[string, number][]> [
	["Number", 50],
	["Size", 50],
	["Splash", 70]
];


const SQRT2 = Math.sqrt(2);


class Rectangle extends Fighter {

	static initialize(): void {
		Fighter.fighterProperties.set("Rectangle", propertyArray);
		Fighter.fighterConstructors.set("Rectangle", ( (coord: Coordinate, side: SideType) => new Rectangle(coord, side) ) );
	}
	
	size: number;
	splashRange: number;

	
	constructor(coord: Coordinate, side: SideType) {
		const sprite = new RectangleSprite();
		super(coord, sprite, BASEWIDTH, BASEHEIGHT, BASEHEALTH, BASESPEED, BASEDAMAGE, BASERANGE, BASEDELAY, side);

		this.size = BASESIZE;
		this.splashRange = BASESPLASH;
	}

	multiplyProperty(property: string, factor: number) {
		switch(property) {
			case "Size":
				this.size *= factor;
				break;
			case "Splash":
				this.splashRange += Math.sqrt(factor) * 10;
				break;
			default:
				throw new Error(`Can’t find property ${property} of class Rectangle.`)
		}
	}

	hit() {
		const projectile =
			new Projectile(
				this.coord,
				this.target.coord,
				this.damage,
				this.splashRange,
				this.side
			);
		fightManager.addProjectile(projectile);
	}	

	get health(): number {
		return SIZETOHEALTH * this.size;
	}
	
	get damage(): number {
		return BASEDAMAGE * (this.size / BASESIZE)
	}
	
	get range(): number {
		return BASERANGE + 10 * (this.size / BASESIZE);
	}

	get attackDelay(): number {
		return BASEDELAY + 40 * (this.size / BASESIZE);
	}

	get hRadius(): number {
		return BASESIZE * Math.sqrt(this.size) / 5;
	}

	get vRadius(): number {
		return (SIZETOHEIGHT / SIZETOWIDTH) * this.hRadius;
	}

	get width(): number {
		return this.hRadius;
	}
	
	get height(): number {
		return this.vRadius;
	}
	
	set health(value: number) {
		this.size = Math.max(0, value) / SIZETOHEALTH;
	}

}

class RectangleSprite extends Sprite {
	constructor() {
		super(3);
	}
}
