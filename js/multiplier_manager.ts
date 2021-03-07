export { multiplierManager };



import { fightManager } from "./fight_manager.js";
import { Side } from "./fighter.js";
import { gameManager } from "./game_manager.js";
import { Manager } from "./manager.js";
import { Multiplier } from "./multiplier.js";
import { drawingArea } from "./drawing_area.js";


type ShortName = "troopNumber" | "enemyNumber";


class MultiplierManager extends Manager {
	_multipliers: Map<ShortName, Multiplier>;

	constructor() {
		super();
		this._multipliers = new Map([]);
		this.addMultiplier("troopNumber", "Fighters", "troop");
		this.addMultiplier("enemyNumber", "Fighters", "enemy");
	}

	start(time: number) {
		drawingArea.clear();
		for (const multiplier of this.multipliers) {
			multiplier.start(time);
		}
		gameManager.update = this.update.bind(this);
	}

	update(time: number) {
		const rollingDice =
			this.multipliers.filter( multiplier =>
				multiplier.isRolling
			);
		if (rollingDice.length == 0) {
			this.stop();
		}
		else {
			for (const multiplier of rollingDice) {
				multiplier.update(time);
			}	
		}
	}

	stop() {
		gameManager.update = fightManager.start.bind(fightManager);
	}

	addMultiplier(shortname: ShortName, name: string, side: Side) {
		this._multipliers.set(shortname, new Multiplier(name, side) );
	}

	getMultiplier(shortname: ShortName): Multiplier {
		const multiplier = this._multipliers.get(shortname);
		if (multiplier == undefined) {
			throw new Error("Try to access a nonexisting multiplier!")
		}
		return multiplier;
	}

	get multipliers(): Multiplier[] {
		return Array.from(this._multipliers.values());
	}
}


const multiplierManager = new MultiplierManager();
