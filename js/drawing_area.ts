import { Coordinate } from "./coordinate";


export { drawingArea };


class DrawingArea {

	canvas: HTMLCanvasElement;
	context: CanvasRenderingContext2D;

	constructor() {
		const canvas = <HTMLCanvasElement | null> document.querySelector(".drawing-area");
		if (canvas == null) {
			throw new Error("Can’t find the drawing canvas in the HTML file.");
		}
		this.canvas = canvas;

		this.canvas.width = 1920;
		this.canvas.height = 1080;

		const context =  canvas.getContext("2d");
		if (context == null) {
			throw new Error("Can’t get the context of the drawing canvas.");
		}
		this.context = context;
	}

	clear(): void {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	drawSquareFromCenter(coord: Coordinate, size: number, color: string) {
		this.context.fillStyle = color;
		this.context.fillRect(coord.x - size/2, coord.y - size/2, size, size);
	}

	get width(): number {
		return this.canvas.width;
	}
	
	get height(): number {
		return this.canvas.height;
	}
}



const drawingArea = new DrawingArea();
