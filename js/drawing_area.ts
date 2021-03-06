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

		this.canvas.width = 1200;
		this.canvas.height = 600;

		const context =  canvas.getContext("2d");
		if (context == null) {
			throw new Error("Can’t get the context of the drawing canvas.");
		}
		this.context = context;
	}

	clear() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}



const drawingArea = new DrawingArea();
