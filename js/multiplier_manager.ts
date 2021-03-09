export { multiplierManager };



import { fightManager } from "./fight_manager.js";
import { FighterType, SideType } from "./fighter.js";
import { gameManager } from "./game_manager.js";
import { drawingArea } from "./drawing_area.js";

import { Manager } from "./manager.js";
import { Multiplier } from "./multiplier.js";
import { Stat } from "./stat.js";


class MultiplierManager extends Manager {
	private _multipliers: Map<[FighterType, string, SideType], Multiplier>;

	constructor() {
		super();
		Stat.initialize();
		this._multipliers = new Map();
		for (const [[typeName, property], stat] of Stat.statList) {
			this.addMultiplier(typeName, property, stat, "troop");
			this.addMultiplier(typeName, property, stat, "enemy");
		}
	}

	start(time: number) {
		drawingArea.clear();
		for (const multiplier of this.multipliersArray) {
			multiplier.start(time);
		}
		gameManager.update = this.update.bind(this);
	}

	update(time: number) {
		const rollingDice =
			this
			.multipliersArray
			.filter( multiplier =>
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

	addMultiplier(typeName: FighterType, property: string, stat: Stat, side: SideType) {
		this._multipliers.set( [typeName, property, side], new Multiplier(property, stat, side) );
	}

	// getMultiplier(shortname: ShortName): Multiplier {
	// 	const multiplier = this._multipliers.get(shortname);
	// 	if (multiplier == undefined) {
	// 		throw new Error("Try to access a nonexisting multiplier!")
	// 	}
	// 	return multiplier;
	// }

	// get multipliers(): Multiplier[] {
	// 	return Array.from(this._multipliers.values());
	// }
	
	get multipliers(): Map<[FighterType, string, SideType], Multiplier>  {
		return this._multipliers;
	}
	
	private get multipliersArray(): Multiplier[] {
		return Array.from( this._multipliers.values() );
	}
}


const multiplierManager = new MultiplierManager();
