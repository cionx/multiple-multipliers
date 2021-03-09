export { multiplierManager };


import { fightManager } from "./fight_manager.js";
import { FighterType, fighterTypesArray, SideType, sideTypesArray } from "./fighter.js";
import { gameManager } from "./game_manager.js";
import { drawingArea } from "./drawing_area.js";

import { Manager } from "./manager.js";
import { Multiplier } from "./multiplier.js";
import { Stat } from "./stat.js";


type MultiplierList = Map<FighterType, {[property: string]: Multiplier}>;


class MultiplierManager extends Manager {
	multiplierLists: Map<SideType, MultiplierList>;

	constructor() {
		super();
		Stat.initialize();

		this.multiplierLists = new Map();

		for (const side of sideTypesArray) {
			const multiplierList = <MultiplierList> new Map();

			const statList = Stat.statLists.get(side);
			if (statList == undefined) {
				throw new Error(`Can’t find the statList for ${side}.`);
			}

			const statArray = Array.from(statList.entries());
			for (const [fighterType, propertyEnum] of statArray) {
				
				const multiplierEnum = <{[property: string]: Multiplier}> {};

				const propertyArray = Object.entries(propertyEnum);
				for (const [property, stat] of propertyArray) {
					multiplierEnum[property] = new Multiplier(property, stat, side);
				}

				multiplierList.set(fighterType, multiplierEnum);
			}
			
			this.multiplierLists.set(side, multiplierList);
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
	
	// get multipliers(): Map<[FighterType, string, SideType], Multiplier>  {
		// return this._multipliers;
	// }
	
	private get multipliersArray(): Multiplier[] {
		const result =
			Array.from(
				this
				.multiplierLists
				.values()
			)
			.map( multiplierList =>
				Array.from(
					multiplierList.values()
				)
			)
			.flat()
			.map( propertyEnum =>
				Object.values(propertyEnum)
			)
			.flat();
		return result;
	}
}


const multiplierManager = new MultiplierManager();
