import { gameManager, levelManager, pointManager, updateManager } from "./game_manager.js";

export { RollbackManager };



class RollbackManager {

	private rollbackButton: HTMLButtonElement;

	constructor() {
		const rollbackButton = <HTMLButtonElement|null> document.querySelector(".rollback-button");
		if (rollbackButton == null) {
			throw new Error("Can’t find the rollback button in the HTML document.")
		}
		this.rollbackButton = rollbackButton;
		this.rollbackButton.addEventListener("click", this.rollback.bind(this));
		this.refreshDisplay;
	}

	update(): void {
		this.refreshDisplay();
	}

	rollback(): void {
		pointManager.rollback();
		levelManager.rollback();
		gameManager.update = updateManager.start.bind(updateManager);
	}

	refreshDisplay() {
		if (levelManager.currentMaxLevel >= this.nextLevel) {
			this.rollbackButton.disabled = false;
			this.rollbackButton.innerHTML = "Rollback";
		}
		else {
			this.rollbackButton.disabled = true;
		}
	}

	private get nextLevel(): number {
		return Math.floor(levelManager.previousMaxLevel / 10) * 10;
	}






}
