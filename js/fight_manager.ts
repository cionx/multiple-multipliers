export { fightManager };



import { Manager } from "./manager.js";
import { Fighter, Side } from "./fighter.js";
import { SwordFighter } from "./swordfighter.js";
import { Coordinate } from "./coordinate.js";
import { drawingArea } from "./drawing_area.js";
import { gameManager } from "./game_manager.js";
import { shopManager } from "./shop_manager.js";
import { multiplierManager } from "./multiplier_manager.js";
import { randomInt } from "./random.js";



class FightManager extends Manager {

	_fighters:  { [side in Side]: Fighter[] };

	constructor() {
		super();
	 	this._fighters = {
			"troop": [],
			"enemy": [],
		};
	}

	start(): void {
		this._fighters["troop"] = [];
		this._fighters["enemy"] = [];
		const troopNumber = multiplierManager.getMultiplier("troopNumber").value;
		this.addFighters(troopNumber, "troop");
		const enemyNumber = multiplierManager.getMultiplier("enemyNumber").value;
		this.addFighters(enemyNumber, "enemy");
		gameManager.update = this.update.bind(this);
	}

	update(time: number): void {
		this.removeDead();
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
		gameManager.update = shopManager.start.bind(shopManager);
	}

	removeDead(): void {
		for (const [side, list] of Object.entries(this._fighters)) {
			this._fighters[side as Side] =
				this._fighters[side as Side]
				.filter(fighter => fighter.isAlive);
		}
	}
	
	draw(): void {
		for (const fighter of this.fighters) {
			fighter.draw();
		}
	}

	private addFighters(amount: number, side: Side): void {
		// the spawn area is 100x300 on both sides
		// we condiser the upper left corner of this area
		const corner = (side == "troop" ? 0 : 1100);
		while (amount > 0) {
			const x = randomInt(corner, corner + 100);
			const y = randomInt(0, 300);
			this.addFighter(x, y, side);
			amount--;
		}
	}

	private addFighter(x: number, y: number, side: Side): void {
		const fighter = new SwordFighter( new Coordinate(x, y), side);
		this._fighters[side].push(fighter);
	}

	get fighters(): Fighter[] {
		return Object.values(this._fighters).flat();
	}
	
	targetsOf(type: Side): Fighter[] {
		switch(type) {
			case "troop":
				return this._fighters["enemy"];
			case "enemy":
				return this._fighters["troop"];
			default:
				throw new Error("Try to access a non-existing list of fighters.");
		}
	}

}



const fightManager = new FightManager();
