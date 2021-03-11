export { Sprite };


import { drawingArea } from "./game_manager.js";


import { Coordinate } from "./coordinate.js";


abstract class Sprite {

	private sides: number

	constructor(sides: number) {
		this.sides = sides;
	}

	drawSquare(coord: Coordinate, size: number, color: string): void {
		this.drawRectangle(coord, size, size, color);
	}
	
	drawRectangle(coord: Coordinate, width: number, height: number, color: string): void {
		drawingArea.drawRectangleFromCenter(coord, width, height, "black");
		const borderWidth = 5;
		const smallerWidth = Math.max(0, width - borderWidth);
		const smallerHeight = Math.max(0, height - borderWidth);
		drawingArea.drawRectangleFromCenter(coord, smallerWidth, smallerHeight, color);
	}
	
	drawTriangle(coord: Coordinate, size: number, color: string): void {
		drawingArea.drawTriangleFromCenter(coord, size, "black");
		const smallerSize = Math.max(0, Math.min(0.8 * size, size-20));
		drawingArea.drawTriangleFromCenter(coord, smallerSize, color);
	}
}
