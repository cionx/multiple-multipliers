export { EnemyStatManager };


import { diceManager, gameManager, levelManager, statManager } from "./game_manager.js";
import { Manager } from "./manager.js";


class EnemyStatManager extends Manager {

	constructor() {
		super();
	}
	
	start() {
		this.update();
	}

	update() {
		const statArray = statManager.statArray("enemy");
		const allowedStats = statArray.filter( stat => stat.unlocked );
		let points = this.points;

		for (const stat of allowedStats) {
			stat.min = 0;
			stat.max = 0;
		}

		while (points > 0) {
			for (const stat of allowedStats) {
				stat.max += (points > 0 ? 1 : 0);
				points--;
			}
			for (const stat of allowedStats) {
				stat.min += (points > 0 ? 1 : 0);
				points--;
			}
			for (const stat of allowedStats) {
				stat.max += (points > 0 ? 1 : 0);
				points--;
			}
		}

		this.stop();
	}

	stop() {
		gameManager.update = diceManager.start.bind(diceManager);
	}

	private get points(): number {
		// // start with 1
		// // then gain 1 point for levels 1, ..., 10,
		// // then gain 2 points for levels 11, ..., 20
		// // and so on ...
		// const level = levelManager.currentLevel;
		// const tens = Math.floor(level/10);
		// this.points =
		// 	1
		// 	+ 10 * (tens**2 + tens) / 2
		// 	+ (tens + 1) * (level % 10);
		// console.log(`Enemy points for level ${level}: ${this.points}`);

		const level = levelManager.currentLevel;
		if (level <= 10) {
			return level;
		}
		else if (level <= 50) {
			return 2 * level - 10;
		}
		else if (level <= 100) {
			return 3 * level - 60;
		}
		else if (level <= 150) {
			return 4 * level - 160;
		}
		else {
			return 5 * level - 310;
		}
	}

}
