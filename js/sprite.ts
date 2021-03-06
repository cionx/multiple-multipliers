export { Sprite };



import { Coordinate } from "./coordinate.js";
import { drawingArea } from "./drawing_area.js";



class Sprite {
	private readonly image: HTMLImageElement;

	constructor(filePath: string) {
		this.image = new Image();
		this.image.src = filePath;
	}

	draw(coord: Coordinate): void {
		drawingArea.context.drawImage(this.image, coord.x, coord.y);
	}
}
