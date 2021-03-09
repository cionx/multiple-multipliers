export { Sprite };



import { Coordinate } from "./coordinate.js";
import { drawingArea } from "./drawing_area.js";



class Sprite {

	private sides: number

	constructor(sides: number) {
		this.sides = sides;
	}

	draw(coord: Coordinate, size: number, color: string): void {
		drawingArea.drawSquareFromCenter(coord, size, "black");
		drawingArea.drawSquareFromCenter(coord, Math.min(0.9*size, size-10), color);
	}
}
