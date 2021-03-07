export { Fighter, Side };



import { Coordinate } from "./coordinate.js"
import { drawingArea } from "./drawing_area.js";
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
			const dist = Math.abs(this.y - enemy.y);
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
			this.chooseTarget();
		}
	}
	
	private attack(time: number): void {
		if (!this.canReachTarget() || !this.target.isAlive) {
			this.update = this.chooseTarget;
			return;
		}
		if (time >= this.lastAttack + this.attackDelay) {
			this.target.health -= this.damage;
			this.lastAttack = time;
		}
		console.log(this.target.health);
	}

	private canReachTarget(): boolean  {
		return Fighter.distance(this, this.target) <= this.range;
	}

	get isAlive(): boolean {
		return this.health > 0;
	}

	get x(): number {
		return this.coord.x;
	}
	
	get y(): number {
		return this.coord.y;
	}
	
	draw(): void {
		this.sprite.draw(this.coord);
		const ctx = drawingArea.context;
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.target.x, this.target.y);
		ctx.stroke();
	}
	
	drawHealthBar(): void {
		const width = this.sprite.width;
		drawingArea.drawHealth(this.x, this.y, width, this.health);
	}
}
