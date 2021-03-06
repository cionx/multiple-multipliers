export { Fighter, Side };



import { Coordinate } from "./coordinate.js"
import { fightManager } from "./fight_manager.js";
import { Sprite } from "./sprite.js";


type Side = "troop" | "enemy";


abstract class Fighter {
	coord: Coordinate
	sprite: Sprite;
	
	health: number;
	speed: number;

	damage: number;
	range: number;
	attackDelay: number;
	lastAttack: number;

	side: Side;
	target: Fighter;


	static distance(fighter1: Fighter, fighter2: Fighter): number {
		return Coordinate.distance( fighter1.coord, fighter2.coord );
	}

	constructor(
			coord: Coordinate,
			sprite: Sprite,
			health: number,
			speed: number,
			damage: number,
			range: number,
			attackDelay: number,
			side: Side
		) {
		this.coord = coord;
		this.sprite = sprite;
		
		this.health = health;
		this.speed = speed;
		
		this.damage = damage;
		this.range = range;
		this.attackDelay = attackDelay;
		this.lastAttack = attackDelay;
		
		this.side = side;
		this.target = this; // dirty hack
	}
	
	get isAlive(): boolean {
		return this.health > 0;
	}

	start() {
		this.update = this.chooseTarget;
	}
	
	update(time: number): void {
		this.start(); // starts the action loop
	}

	private chooseTarget() {
		const enemies = fightManager.targetsOf(this.side);
		let minDist = Infinity;
		let target = null;

		for (const enemy of enemies) {
			const dist = Fighter.distance(this, enemy);
			if (dist < minDist) {
				minDist = dist;
				target = enemy;
			}
		}

		if (target == null) {
			throw new Error("Fighter can’t find a target!");
		}
		
		this.target = target;
		this.update = this.move;
	}
	
	private move(time: number) {
		if (this.canReachTarget()) {
			this.update = this.attack;
			this.lastAttack = time;
		}
		else {
			this.coord.moveTowards(this.target.coord, this.speed);
		}
	}
	
	private attack(time: number): void {
		if (!this.canReachTarget()) {
			this.update = this.chooseTarget;
			return;
		}
		if (time >= this.lastAttack + this.attackDelay) {
			this.target.health -= this.damage;
			this.lastAttack = time;
		}
	}

	private canReachTarget(): boolean  {
		return Fighter.distance(this, this.target) <= this.range;
	}
	
	draw(): void {
		this.sprite.draw(this.coord);
	}

}
