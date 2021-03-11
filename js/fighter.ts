export { Fighter, SideType, FighterType, fighterTypesArray, sideTypesArray, isFighterType };


import { fightManager } from "./game_manager.js";


import { Coordinate } from "./coordinate.js"
import { Sprite } from "./sprite.js";


const sideTypesArray = ["troop", "enemy"] as const;
type SideType = typeof sideTypesArray[number];

const fighterTypesArray = ["Square", "Rectangle"] as const;
type FighterType = typeof fighterTypesArray[number];

function isFighterType(name: string): name is FighterType {
  const contains =
		fighterTypesArray
		.map (type =>
			String(type)
		)
		.includes(
			name
		);
	return contains;
}

abstract class Fighter {
	static fighterProperties = new Map<FighterType, [string, number][]>();
	static fighterConstructors = new Map<FighterType, ((coord: Coordinate, side: SideType) => Fighter)>();

	static readonly color = {
		troop: "lightskyblue",
		enemy: "whitesmoke"
	}

	coord: Coordinate
	sprite: Sprite;
	
	_width: number;
	_height: number;
	
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
			width: number,
			height: number,
			health: number,
			speed: number,
			damage: number,
			range: number,
			attackDelay: number,
			side: SideType
		) {
		this.coord = coord;
		this.sprite = sprite;
	
		this._width = width;
		this._height = height;
		
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
		let minDistD = Infinity;
		let targetD = null;
		let minDistY = Infinity;
		let targetY = null;


		for (const enemy of enemies) {
			const distY = Math.abs(this.y - enemy.y);
			const distD = Fighter.distance(this, enemy);
			if (distD < minDistD) {
				minDistD = distD;
				targetD = enemy;
			}
			if (distY < minDistY) {
				minDistY = distY;
				targetY = enemy;
			}
		}

		if (targetD == null || targetY == null) {
			throw new Error("Fighter can’t find a target!");
		}
		
		if (minDistY < minDistD && minDistY > 200) {
			this.target = targetY;
		}
		else {
			this.target = targetD;
		}

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
			this.hit();
			this.lastAttack = time;
		}
	}
	
	protected hit() {
		this.target.health -= this.damage;
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

	get width() {
		return this._width;
	}
	
	get height() {
		return this._height
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

	abstract get hRadius(): number;

	abstract get vRadius(): number;

	set damage(damage: number) {
		this._damage = damage;
	}

	set health(health: number) {
		this._health = health;
	}

	set width(width: number) {
		this._width = width;
	}
	
	set height(height: number) {
		this._height = height;
	}
	
	set x(x: number) {
		this.coord.x = x;
	}
	
	set y(y: number) {
	this.coord.y = y;
	}
	
	abstract multiplyProperty(property: string, factor: number): void;	

	draw(): void {
		this.sprite.drawRectangle(this.coord, this.width, this.height, Fighter.color[this.side]);
	}
}
