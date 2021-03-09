export { Square };


import { drawingArea } from "./drawing_area.js";


import { Coordinate } from "./coordinate.js";
import { Fighter, SideType } from "./fighter.js";
import { Sprite } from "./sprite.js"


const BASESIZE = 10;
const BASEHEALTH = 6 * BASESIZE;
const BASESPEED = 2;
const BASEDAMAGE = 5;
const BASERANGE = 45;
const BASEDELAY = 250;



const propertyTypeArray = ["Size"] as const;



class Square extends Fighter {
	
	static initialize(): void {
		Fighter.fighterProperties.set("Square", propertyTypeArray);
		Fighter.fighterConstructors.set("Square", ( (coord: Coordinate, side: SideType) => new Square(coord, side) ) );
	}

	constructor(coord: Coordinate, side: SideType) {
		const sprite = new Sprite(4);
		super(coord, sprite, BASESIZE, BASEHEALTH, BASESPEED, BASEDAMAGE, BASERANGE, BASEDELAY, side);
	}
	
	canReachTarget(): boolean  {
		const dx = Math.abs(this.coord.x - this.target.coord.x) -  (this.radius + this.target.radius) / 2;
		const dy = Math.abs(this.coord.y - this.target.coord.y) -  (this.radius + this.target.radius) / 2;
		return (dx < 0.1 * this.radius && dy < 0.1 * this.radius);
	}
		
	get health(): number {
		return 6 * this.size;
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
	
	get range() {
		return 1.1 * this.radius;
	}

	get radius() {
		return BASESIZE * Math.sqrt(this.size/2);
	}

	set health(value: number) {
		this.size = Math.max(0, value) / 6;
	}
		
	multiplyProperty(property: string, factor: number) {
		switch(property) {
			case "Size":
				this.size *= factor;
				break;
			default:
				throw new Error(`Can’t find property ${property} of class Square.`)
		}
	}

	draw(): void {
		this.sprite.draw(this.coord, this.radius, Fighter.color[this.side]);
		const ctx = drawingArea.context;
		// ctx.beginPath();
		// ctx.moveTo(this.x, this.y);
		// ctx.lineTo(this.target.x, this.target.y);
		// ctx.stroke();
	}
}



function fastSqrt(x: number) {
	return (x + 1); // linear approximation of sqrt(x) at x = 1
}



