export { MovingObject };


import { Coordinate } from "./coordinate";


class MovingObject {
	private _position: Coordinate;
	private _velocity: Coordinate;
	private _mass: number;
	private _force: Coordinate;

	private lastMove: number;


	constructor(
		position: Coordinate,
		velocity: Coordinate,
		mass: number,
		force: Coordinate,
		time: number
	) {
		this._position = position;
		this._velocity = velocity;
		this._mass = mass;
		this._force = force;
		this.lastMove = time;
	}

	update(time: number) {
		const dt = time - this.lastMove;

		this.velocity.x += this.force.x / this.mass * dt;
		this.velocity.y += this.force.y / this.mass * dt;
		this.position.x += this.velocity.x * dt;
		this.position.y += this.velocity.y * dt;
	}

	public addForce(direction: Coordinate, strength: number  ) {
		this.force.x += direction.x * strength;
		this.force.y += direction.y * strength;
	}

	private get position(): Coordinate {
		return this._position;
	}
	private set position(value: Coordinate) {
		this._position = value;
	}

	private get velocity(): Coordinate {
		return this._velocity;
	}
	private set velocity(value: Coordinate) {
		this._velocity = value;
	}

	private get mass(): number {
		return this._mass;
	}
	private set mass(value: number) {
		this._mass = value;
	}

	private get force(): Coordinate {
		return this._force;
	}
	private set force(value: Coordinate) {
		this._force = value;
	}
	
}
