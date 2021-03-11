export { DrawingArea };


import { Coordinate } from "./coordinate";


const SQRT3 = Math.sqrt(3);


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

	drawRectangleFromCenter(coord: Coordinate, width: number, height: number, color: string) {
		this.context.fillStyle = color;
		this.context.fillRect(coord.x - width/2, coord.y - height/2, width, height);
	}

	drawTriangleFromCenter(coord: Coordinate, size: number, color: string) {
		const ctx = this.context;
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.moveTo(
			coord.x,
			coord.y - (SQRT3/2 - 1/(2 * SQRT3)) * size
			);
		ctx.lineTo(
			coord.x + SQRT3/4 * size, 
			coord.y + size/(2 * SQRT3)
		);
		ctx.lineTo(
			coord.x - SQRT3/4 * size, 
			coord.y + size/(2 * SQRT3)
		);
		ctx.fill();
	}

	get width(): number {
		return this.canvas.width;
	}
	
	get height(): number {
		return this.canvas.height;
	}
}
