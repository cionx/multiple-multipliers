// export { Triangle };


// import { Coordinate } from "./coordinate.js";
// import { Fighter, SideType } from "./fighter.js";
// import { Sprite } from "./sprite.js";


// const SIZETOHEALTH = 3;

// const BASESIZE = 15;
// const BASEHEALTH = SIZETOHEALTH * BASESIZE;
// const BASESPEED = 1.5;
// const BASEDAMAGE = 20;
// const BASERANGE = 200;
// const BASEDELAY = 1000;


// const propertyArray = <[string, number][]> [
// 	["Number", 1],
// 	["Size", 40]
// ];

// class Triangle extends Fighter {
	
// 	static initialize(): void {
// 		Fighter.fighterProperties.set("Triangle", propertyArray);
// 		Fighter.fighterConstructors.set("Triangle", ( (coord: Coordinate, side: SideType) => new Triangle(coord, side) ) );
// 	}

// 	constructor(coord: Coordinate, side: SideType) {
// 		const sprite = new TriangleSprite();
// 		super(coord, sprite, BASESIZE, BASEHEALTH, BASESPEED, BASEDAMAGE, BASERANGE, BASEDELAY, side);
// 	}

// 	multiplyProperty(property: string, factor: number) {
// 		switch(property) {
// 			case "Size":
// 				this.size *= factor;
// 				break;
// 			default:
// 				throw new Error(`Can’t find property ${property} of class Triangle.`)
// 		}
// 	}

// 	get health(): number {
// 		return 3 * this.size;
// 	}
	
// 	get range() {
// 		return BASERANGE + 10 * (this.size / BASESIZE);
// 	}

// 	get radius(): number {
// 		return 5 * this.size;
// 	}
	
// 	set health(value: number) {
// 		this.size = Math.max(0, value) / SIZETOHEALTH;
// 	}

// }

// class TriangleSprite extends Sprite {
// 	constructor() {
// 		super(3);
// 	}

// 	draw(coord: Coordinate, size: number, color: string) {
// 		this.drawTriangle(coord, size, color);
// 	}
// }
