export { Square };


import { Coordinate } from "./coordinate.js";
import { Fighter, SideType } from "./fighter.js";
import { Sprite } from "./sprite.js"


const SIZETOHEALTH = 6;

const BASESIZE = 10;
const BASEHEALTH = SIZETOHEALTH * BASESIZE;
const BASESPEED = 2;
const BASEDAMAGE = 10;
const BASERANGE = 45;
const BASEDELAY = 250;



const propertyArray = <[string, number][]> [
	["Number", 1],
	["Size", 20],
	["Vampirism", 70],
];


class Square extends Fighter {

	size: number;
	vampirism: number;
	
	static initialize(): void {
		Fighter.fighterProperties.set("Square", propertyArray);
		Fighter.fighterConstructors.set("Square", ( (coord: Coordinate, side: SideType) => new Square(coord, side) ) );
	}

	constructor(coord: Coordinate, side: SideType) {
		const sprite = new SquareSprite();
		super(coord, sprite, BASESIZE, BASESIZE, BASEHEALTH, BASESPEED, BASEDAMAGE, BASERANGE, BASEDELAY, side);
		this.size = BASESIZE;
		this.vampirism = 0;
	}

	multiplyProperty(property: string, value: number) {
		switch(property) {
			case "Size":
				this.size *= value;
				break;
			case "Vampirism":
				this.vampirism += 1 - (0.98)**value;
				break;
			default:
				throw new Error(`Can’t find property ${property} of class Square.`)
		}
	}
	
	canReachTarget(): boolean  {
		const dx = Math.abs(this.coord.x - this.target.coord.x) -  (this.hRadius + this.target.hRadius) / 2;
		const dy = Math.abs(this.coord.y - this.target.coord.y) -  (this.vRadius + this.target.vRadius) / 2;
		return (dx < 0.1 * this.radius && dy < 0.1 * this.radius);
	}
	
	get width(): number {
		return this.radius;
	}

	get height(): number {
		return this.radius;
	}

	get health(): number {
		return SIZETOHEALTH * this.size;
	}

	protected hit() {
		const health = this.target.health;
		const actualDamage = Math.max(0, health - this.damage);

		this.target.health -= this.damage;
		this.health += this.vampirism * actualDamage;
	}
	
	get damage(): number {
		return BASEDAMAGE * (1 + Math.max(0, Math.log(this.size / BASESIZE)));
	}
	
	get speed(): number {
		if (this.size > 0) {
 			return BASESPEED * Math.min(3, fastSqrt(BASESIZE/this.size) );
		}
		else {
			return 0;
		}
	}
	
	get range(): number {
		return 1.2 * this.radius;
	}

	get radius(): number {
		return BASESIZE * (this.size)**(1/3);
	}
	
	get hRadius(): number {
		return this.radius;
	}
	
	get vRadius(): number {
		return this.radius;
	}

	set health(value: number) {
		this.size = Math.max(0, value) / SIZETOHEALTH;
	}

}


class SquareSprite extends Sprite {
	constructor() {
		super(4);
	}
}


function fastSqrt(x: number) {
	return (x + 1); // linear approximation of sqrt(x) at x = 1
}



