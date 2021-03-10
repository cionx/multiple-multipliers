export { diceManager };


import { fightManager } from "./fight_manager.js";
import { gameManager } from "./game_manager.js";
import { drawingArea } from "./drawing_area.js";


import { Manager } from "./manager.js";
import { Dice } from "./dice.js";
import { statManager } from "./stat_manager.js";


class DiceManager extends Manager {

	constructor() {
		super();
		statManager.initialize();
	}

	start(time: number) {
		drawingArea.clear();
		for (const dice of this.diceArray) {
			dice.start(time);
		}
		gameManager.update = this.update.bind(this);
	}

	update(time: number) {
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
				dice.update(time);
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


const diceManager = new DiceManager();
