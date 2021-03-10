export { Coordinate };


import { drawingArea } from "./game_manager.js";


class Coordinate {
	x: number;
	y: number;

	static distance(p: Coordinate, q: Coordinate) {
		return Math.sqrt( (p.x - q.x)**2 + (p.y - q.y)**2 );
	}
	
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	// moveTowards(p: Coordinate, speed: number) {
	// 	const dx = p.x - this.x;
	// 	const dy = p.y - this.y;

	// 	const probabilityY =  ( Math.abs(dy) / ( Math.abs(dx) + Math.abs(dy) ) );
		
	// 	bernoulli(probabilityY)
	// 		? this.y += Math.sign(dy) * speed
	// 		: this.x += Math.sign(dx) * speed;
	// }

	moveTowards(p: Coordinate, speed: number) {
		const width = drawingArea.width;
		

		const dx = p.x - this.x;
		const dy = p.y - this.y;
		
		const normalize = Math.sqrt( dx**2 + dy**2 );

		const mx = speed * dx / normalize;
		const my = speed * dy / normalize;

		this.x += mx;
		this.y += my;

		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
	}

}
