export { MovingObject };


import { Coordinate } from "./coordinate";


class MovingObject {
	private position: Coordinate;
	private velocity: Coordinate;
	private mass: number;
	private force: Coordinate;

	constructor(
		position: Coordinate,
		velocity: Coordinate,
		mass: number,
		force: Coordinate,
		time: number
	) {
		this.position = position;
		this.velocity = velocity;
		this.mass = mass;
		this.force = force;
	}

	update() {
	}

	public addForce(direction: Coordinate, strength: number  ) {
		this.force.x += direction.x * strength;
		this.force.y += direction.y * strength;
	}
	
}
