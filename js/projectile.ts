export { Projectile }


import { fightManager } from "./game_manager.js";


import { Coordinate } from "./coordinate.js"
import { Fighter, SideType } from "./fighter.js";
import { Sprite } from "./sprite.js";


const ACCURACY = 20;
const BASESPEED = 20;


class Projectile {

	coord: Coordinate;
	target: Coordinate;

	damage: number;
	splashRange: number;
	
	side: SideType;

	size: number;
	sprite: ProjectileSprite;
	

	constructor(
		coord: Coordinate,
		target: Coordinate,
		damage: number,
		splashRange: number,
		side: SideType
	) {
		this.coord = new Coordinate(coord.x, coord.y);
		this.target = target;
		this.damage = damage;
		this.splashRange = splashRange;
		
		this.side = side;
		
		this.size = 5 + Math.sqrt(this.damage);
		this.sprite = new ProjectileSprite();
	}

	update(): void {
		this.start();
	}

	start(): void {
		this.update = this.move;
	}

	stop(): void {
		fightManager.removeProjectile(this);
	}

	move(): void {
		if (this.canReachTarget()) {
			this.update = this.explode;
		}
		else {
			this.coord.moveTowards(this.target, this.speed);
		}
	}
	
	canReachTarget(): boolean {
		return Coordinate.distance(this.coord, this.target) <= ACCURACY;
	}

	explode() {
		const targetList = fightManager.targetsOf(this.side);
		const targetsInSplash =
			targetList
			.filter(fighter =>
				Coordinate.distance(this.coord, fighter.coord)
				<=
				this.splashRange
			);
		for (const fighter of targetsInSplash) {
			fighter.health -= this.damage;
		}	
		this.update = this.stop;	
	}

	get speed(): number {
		return BASESPEED;
	}

	draw() {
		this.sprite.draw(this.coord, this.size);
	}
}

class ProjectileSprite extends Sprite {

	constructor() {
		super(4);
	}
	
	draw(coord: Coordinate, size: number) {
		this.drawSquare(coord, size, "black");
	}

}
