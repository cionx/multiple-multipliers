export { Sprite };



import { Coordinate } from "./coordinate.js";
import { drawingArea } from "./drawing_area.js";



class Sprite {
	private readonly _image: HTMLImageElement;

	constructor(filePath: string) {
		this._image = new Image();
		this._image.src = filePath;
	}

	draw(coord: Coordinate): void {
		drawingArea.context.drawImage(this.image, coord.x, coord.y);
	}

	get image(): HTMLImageElement {
		return this._image;
	}

	get width(): number {
		return this._image.width;
	}

	addClass(className: string) {
		this.image.classList.add(className);
	}
}
