export { gameManager };



import { Manager } from "./manager.js";
import { fightManager } from "./fight_manager.js";
import { shopManager } from "./shop_manager.js";



type gameState = "fight" | "shop" | "message";



class GameManager extends Manager {

	constructor() {
		super();
	}
	
	checkForSave(): void {
		// currently nothing to do here
	}

	start(): void {
		this.update = shopManager.start.bind(shopManager);
	}

	update(time: number): void {
		// overwritten during the game
	}
	
	stop(): void {
	}

}



const gameManager = new GameManager();
