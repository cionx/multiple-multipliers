export { fightManager, FightManager, SideType };



import { Fighter, SideType } from "./fighter.js";
import { Square } from "./square.js";
import { drawingArea } from "./drawing_area.js";
import { gameManager } from "./game_manager.js";
import { Manager } from "./manager.js";
import { messenger } from "./messenger.js";
import { fighterInitializer } from "./fighter_initializer.js";
import { levelManager } from "./level_manager.js";



class FightManager extends Manager {

	_fighters:  { [side in SideType]: Fighter[] };

	constructor() {
		super();
	 	this._fighters = {
			"enemy": [],
			"troop": [],
		};
	}

	static initialize() {
		Square.initialize();
	}

	start(): void {
		fighterInitializer.start();
	}

	update(time: number): void {
		this.removeDead();
		this.checkCollision();
		this.checkBorder();
		for (const list of Object.values(this._fighters)) {
			if (list.length == 0) {
				gameManager.update = this.stop.bind(this);
				return;
			}
		}
		drawingArea.clear();
		for (const fighter of this.fighters) {
			fighter.update(time);
		}
		this.draw();
	}
	
	stop(): void {
		gameManager.update = levelManager.start.bind(levelManager);
	}

	removeDead(): void {
		for (const [side, list] of Object.entries(this._fighters)) {
			this._fighters[side as SideType] =
				this._fighters[side as SideType]
				.filter(fighter => fighter.isAlive);
		}
	}
	
	// TODO: COLLISION CHECKING

	draw(): void {
		for (const fighter of this.fighters) {
			fighter.draw();
		}
	}

	/* GETTER AND SETTER */

	public resetFighters() {
		this._fighters["troop"] = [];
		this._fighters["enemy"] = [];
	}

	public addFighters(fighters: Fighter[], side: SideType): void {
		for (const fighter of fighters) {
			this._fighters[side].push(fighter);
		}
	}

	get fighters(): Fighter[] {
		return Object.values(this._fighters).flat();
	}

	alliesOf(type: SideType): Fighter[] {
		return this._fighters[type];
	}
	
	targetsOf(type: SideType): Fighter[] {
		switch(type) {
			case "troop":
				return this._fighters["enemy"];
			case "enemy":
				return this._fighters["troop"];
			default:
				throw new Error("Try to access a non-existing list of fighters.");
		}
	}
	
	get resultString(): string {
		const t = this._fighters.troop.length;
		const e = this._fighters.enemy.length;
		
		if(t == 0) {
			if (e == 0) {
				return "It’s a tie!";
			}
			else {
				return "You lost."
			}
		}
		else {
			if (e == 0) {
				return "You won!"
			}
			else {
				return "It’s a tie!"
			}
		}
		
	}

	public checkCollision(): void {
		const fighters = this.fighters;
		const amount = fighters.length;
		for (let i = 0; i < amount; i++) {
			for (let j = 0; j < amount; j++) {
				this.adjustCollision(fighters[i], fighters[j]);
			}
		}
	}

	private adjustCollision(first: Fighter, second: Fighter): void {
		const colX = (first.radius +  second.radius) / 2 - Math.abs(first.x - second.x);
		const colY = (first.radius +  second.radius) / 2 - Math.abs(first.y - second.y);

		if (colX > 20 && colY > 20) { // allow some overlap
			if (colX >= colY) {
				const dx = 0.5 * Math.sign(first.x - second.x) * colX / 2;
				first.coord.x += dx;
				second.coord.x -= dx;
			}
			else {
				const dy = 0.5 * Math.sign(first.y - second.y) * colY / 2;
				first.y += dy;
				second.y -= dy;
			}
		}
	}

	checkBorder() {
		const width = drawingArea.width;
		const height = drawingArea.height;

		for (const fighter of this.fighters) {
			const x = fighter.x;
			const y = fighter.y;
			const r = fighter.radius;

			if (x - r < 0) {
				fighter.x = r;
			}
			else if (x + r > width) {
				fighter.x = width - r;
			}
			
			if (y - r < 0) {
				fighter.y = r;
			}
			else if (y + r > height) {
				fighter.y = height - r;
			}
		}
	}

}



const fightManager = new FightManager();
