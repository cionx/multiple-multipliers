export { LevelManager, LevelSaveFormat };


import {
	gameManager,
	fightManager,
	updateManager,
	statManager,
	pointManager,
	rollbackManager
} from "./game_manager.js";


import { Manager } from "./manager.js";


type LevelSaveFormat = {[name: string]: number};


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
		this._previousMaxLevel = 10;

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
		gameManager.update = updateManager.start.bind(updateManager);
	}

	getSave(): LevelSaveFormat {
		let save = <LevelSaveFormat>
		{
			"currentLevel": this._currentLevel,
			"currentMaxLevel": this._currentMaxLevel,
			"previousMaxLevel": this._previousMaxLevel
		};
		return save;
	}
	
	loadSave(save: LevelSaveFormat) {
		// How to tell TypeScript that these values may be undefined?
		this._currentLevel = save["currentLevel"];
		this._currentMaxLevel = save["currentMaxLevel"];
		this._previousMaxLevel = save["previousMaxLevel"];
		this.refreshDisplay();
	}

	rollback() {
		this.previousMaxLevel = Math.max(this.previousMaxLevel, this.currentMaxLevel);
		this.currentLevel = 1;
		this.currentMaxLevel = 1;
		this.refreshDisplay();
	}
		
	increaseCurrentLevel() {
		if( this.currentLevel < this.currentMaxLevel ) {
			this.currentLevel++;
		}
		this.refreshDisplay();
	}
	
	decreaseCurrentLevel() {
		if( this.currentLevel > 1) {
			this.currentLevel--;
		}
		this.refreshDisplay();
	}

	increaseCurrentMaxLevel() {
		this.currentMaxLevel++;
		this.refreshDisplay();
	}
	
	public get currentLevel(): number {
		return this._currentLevel;
	}
	
	public get currentMaxLevel(): number {
		return this._currentMaxLevel;
	}
	
	public get previousMaxLevel(): number {
		return this._previousMaxLevel;
	}
	
	public set currentLevel(level: number) {
		if (level > this.currentMaxLevel) {
			throw new Error("Can’t raise the current level above the allowed maximal level.");
		}
		if (level <= 0) {
			throw new Error("Can’t set the current level non-positive.")
		}
		this._currentLevel = level;
	}

	public set currentMaxLevel(level: number) {
		this._currentMaxLevel = level;
	}

	public set previousMaxLevel(level: number) {
		if (level < this.previousMaxLevel) {
			throw new Error("Can’t decrease the previous maximal level!");
		}
		this._previousMaxLevel = level;
	}

	refreshDisplay(): void {
		this.levelDisplay.innerHTML = String(this.currentLevel);
		this.decreaseButton.disabled = (this.currentLevel <= 1);
		this.increaseButton.disabled = (this.currentLevel >= this.currentMaxLevel);
		statManager.adjustForCurrentLevel();
		statManager.adjustForMaxLevel();
		rollbackManager.update();
	}
}
