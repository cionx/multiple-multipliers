export { Fighter, SideType, FighterType, fighterTypesArray, sideTypesArray };


import { Coordinate } from "./coordinate.js"
import { fightManager } from "./fight_manager.js";
import { Sprite } from "./sprite.js";


const sideTypesArray = ["troop", "enemy"] as const;
type SideType = typeof sideTypesArray[number];

const fighterTypesArray = ["Square"] as const;
type FighterType = typeof fighterTypesArray[number];

abstract class Fighter {
	static fighterProperties = new Map<FighterType, [string, number][]>();
	static fighterConstructors = new Map<FighterType, ((coord: Coordinate, side: SideType) => Fighter)>();

	static readonly color = {
		troop: "lightskyblue",
		enemy: "whitesmoke"
	}

	coord: Coordinate
	sprite: Sprite;
	
	_size: number;
	
	_health: number;
	_speed: number;

	_damage: number;
	_range: number;
	_attackDelay: number;
	lastAttack: number;

	side: SideType;
	target: Fighter;


	static distance(fighter1: Fighter, fighter2: Fighter): number {
		return Coordinate.distance( fighter1.coord, fighter2.coord );
	}

	constructor(
			coord: Coordinate,
			sprite: Sprite,
			size: number,
			health: number,
			speed: number,
			damage: number,
			range: number,
			attackDelay: number,
			side: SideType
		) {
		this.coord = coord;
		this.sprite = sprite;
	
		this._size = size;
		
		this._health = health;
		this._speed = speed;
		
		this._damage = damage;
		this._range = range;
		this._attackDelay = attackDelay;
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
	}

	canReachTarget(): boolean  {
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

	get size() {
		return this._size;
	}
	
	get damage() {
		return this._damage;
	}

	get health() {
		return this._health;
	}

	get speed() {
		return this._speed;
	}

	get attackDelay() {
		return this._attackDelay;
	}
	
	get range() {
		return this._range;
	}

	abstract get radius(): number;

	set damage(damage: number) {
		this._damage = damage;
	}

	set health(health: number) {
		this._health = health;
	}

	set size(size: number) {
		this._size = size;
	}
	
	set x(x: number) {
		this.coord.x = x;
	}
	
	set y(y: number) {
	this.coord.y = y;
	}
	
	abstract multiplyProperty(property: string, factor: number): void;	

	abstract draw(): void;
}
