export { Sprite };


import { drawingArea } from "./game_manager.js";


import { Coordinate } from "./coordinate.js";


class Sprite {

	private sides: number

	constructor(sides: number) {
		this.sides = sides;
	}

	draw(coord: Coordinate, size: number, color: string): void {
		drawingArea.drawSquareFromCenter(coord, size, "black");
		const smallerSize = Math.max(0, Math.min(0.9 * size, size-10));
		drawingArea.drawSquareFromCenter(coord, smallerSize, color);
	}
}
