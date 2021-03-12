export { DiceManager };


import { gameManager, fightManager, statManager, drawingArea } from "./game_manager.js";

import { Manager } from "./manager.js";
import { Dice } from "./dice.js";


class DiceManager extends Manager {

	constructor() {
		super();
	}

	start() {
		for (const dice of this.diceArray) {
			dice.start();
		}
		gameManager.update = this.update.bind(this);
	}

	update() {
		const rollingDice =
			this
			.diceArray
			.filter( dice =>
				dice.isRolling
			);
		if (rollingDice.length == 0) {
			this.stop();
		}
		else {
			for (const dice of rollingDice) {
				dice.update();
			}	
		}
	}

	stop() {
		gameManager.update = fightManager.start.bind(fightManager);
	}
	
	get diceArray(): Dice[] {
		
		const result =
			statManager
			.totalStatArray()
			.map( stat =>
				stat.dice
			);
		return result;
	}
}
