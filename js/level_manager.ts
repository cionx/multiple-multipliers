export {levelManager};


import { gameManager } from "./game_manager.js";
import { fightManager } from "./fight_manager.js";
import { messenger } from "./messenger.js";


import { Manager } from "./manager.js";
import { pointManager } from "./point_manager.js";
import { statManager } from "./stat_manager.js";


class LevelManager extends Manager {
	
	private _currentLevel: number;
	private _currentMaxLevel: number;
	private _previousMaxLevel: number;

	private decreaseButton: HTMLButtonElement;
	private levelDisplay: HTMLSpanElement;
	private increaseButton: HTMLButtonElement;

	constructor() {
		super();
		this._currentLevel = 1;
		this._currentMaxLevel = 1;
		this._previousMaxLevel = 1;

		const decreaseButton = <HTMLButtonElement|null> document.querySelector(".level-back-button");
		if (decreaseButton == null) {
			throw new Error("Can’t find the level-back button in the HTML document.");
		}
		this.decreaseButton = decreaseButton;

		const increaseButton = <HTMLButtonElement|null> document.querySelector(".level-forward-button");
		if (increaseButton == null) {
			throw new Error("Can’t find the level-forward button in the HTML document.");
		}
		this.increaseButton = increaseButton;

		const levelDisplay = <HTMLSpanElement|null> document.querySelector(".level-display");
		if (levelDisplay == null) {
			throw new Error("Can’t find the level display field in the HTML document.");
		}

		this.increaseButton.addEventListener("click", this.increaseCurrentLevel.bind(this));
		this.decreaseButton.addEventListener("click", this.decreaseCurrentLevel.bind(this));

		this.levelDisplay = levelDisplay;
		this.refreshDisplay();
	}


	initialize() {
		this.refreshDisplay();
	}

	start() {
		const t = fightManager.alliesOf("troop").length;
		const e = fightManager.alliesOf("enemy").length;

		if (t > 0 && e <= 0 && this.currentLevel == this.currentMaxLevel) {
			this.increaseCurrentMaxLevel();
			this.increaseCurrentLevel();
			pointManager.points++;
		}
		gameManager.update = this.update.bind(this);
	}

	update() {
		this.stop();
	}

	stop() {
		gameManager.update = messenger.start.bind(messenger);
	}

	increaseCurrentLevel() {
		if( this.currentLevel < this.currentMaxLevel ) {
			this.currentLevel++;
		}
		statManager.adjustForCurrentLevel(this.currentLevel);
		this.refreshDisplay();
	}
	
	decreaseCurrentLevel() {
		if( this.currentLevel > 1) {
			this.currentLevel--;
		}
		statManager.adjustForCurrentLevel(this.currentLevel);
		this.refreshDisplay();
	}

	increaseCurrentMaxLevel() {
		statManager.adjustForMaxLevel(this.currentMaxLevel);
		this.currentMaxLevel++;
	}
	
	private get currentLevel(): number {
		return this._currentLevel;
	}
	
	private set currentLevel(level: number) {
		if (level > this.currentMaxLevel) {
			throw new Error("Can’t raise the current level above the allowed maximal level.");
		}
		if (level <= 0) {
			throw new Error("Can’t set the current level non-positive.")
		}
		this._currentLevel = level;
	}
	
	private get currentMaxLevel(): number {
		return this._currentMaxLevel;
	}

	private set currentMaxLevel(level: number) {
		this._currentMaxLevel = level;
		if (this.currentMaxLevel > this.totalBestLevel) {
		}
	}

	private get totalBestLevel(): number {
		return this._previousMaxLevel;
	}

	private set totalBestLevel(level: number) {
		if (level < this.totalBestLevel) {
			throw new Error("Can’t decrease the total best level!");
		}
		this._previousMaxLevel = level;
	}

	refreshDisplay(): void {
		this.levelDisplay.innerHTML = String(this.currentLevel);
		this.decreaseButton.disabled = (this.currentLevel <= 1);
		this.increaseButton.disabled = (this.currentLevel >= this.currentMaxLevel);
	}
}



const levelManager = new LevelManager();
