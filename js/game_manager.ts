export {
	gameManager,
	fightManager,
	statManager,
	diceManager,
	updateManager,
	levelManager,
	pointManager,
	drawingArea,
	fighterInitializer,
	enemyStatManager,
	rollbackManager,
	optionManager,
	messenger,
	timer
};


import { Manager } from "./manager.js";
import { FightManager } from "./fight_manager.js";
import { StatManager, StatSaveFormat } from "./stat_manager.js";
import { DiceManager } from "./dice_manager.js";
import { UpdateManager } from "./update_manager.js";
import { LevelManager, LevelSaveFormat } from "./level_manager.js";
import { PointManager, PointSaveFormat } from "./point_manager.js";
import { DrawingArea } from "./drawing_area.js";
import { FighterInitializer } from "./fighter_initializer.js";
import { EnemyStatManager } from "./enemy_stat_manager.js";
import { RollbackManager } from "./rollback_manager.js";
import { OptionsManager } from "./options_manager.js";
import { Messenger } from "./messenger.js";
import { Timer } from "./timer.js";


const fightManager = new FightManager();
const statManager = new StatManager();
const diceManager = new DiceManager();
const updateManager = new UpdateManager();
const levelManager = new LevelManager();
const pointManager = new PointManager();
const drawingArea = new DrawingArea();
const fighterInitializer = new FighterInitializer();
const enemyStatManager = new EnemyStatManager();
const rollbackManager = new RollbackManager();
const optionManager = new OptionsManager();
const messenger = new Messenger();
const timer = new Timer();


type SaveFormat = {
	"saveTime"      : number,
	"levelManager"  : LevelSaveFormat,
	"statManager"   : StatSaveFormat,
	"pointManager"  : PointSaveFormat,
}


class GameManager extends Manager {

	downTime: number;

	constructor() {
		super();
		this.downTime = 0;
	}
	
	initialize() {
		for (const manager of [
			fightManager,
			statManager,
			updateManager,
			levelManager,
			optionManager]
		) {
			manager.initialize();
		}
	}

	save(): void {
		let saveJSON = JSON.stringify(this.getSave());
		console.log(`Saving the game status: ${saveJSON}.`)
		localStorage.setItem("cionx_multiple-multipliers_save", saveJSON);
	}
	
	checkForSave() {
		let save = localStorage.getItem("cionx_multiple-multipliers_save");
		if (save == null) {
			console.log("No save file found.")
		}
		else {
			this.loadSave( JSON.parse(save) );
		}
	}

	getSave(): SaveFormat {
		const save = {
			"saveTime"    : Date.now(),
			"levelManager": levelManager.getSave(),
			"statManager" : statManager .getSave(),
			"pointManager": pointManager.getSave()
		};
		return save;
	}

	loadSave(save: SaveFormat) {
		console.log(`Loading the following save: ${JSON.stringify(save)}.`)
		
		levelManager.loadSave( save["levelManager"] );
		statManager .loadSave( save["statManager" ] );
		pointManager.loadSave( save["pointManager"] );

		const saveTime = save["saveTime"];
		if (saveTime == undefined) {
			this.downTime = 0;
			console.log("The save file does not contain a time stamp.");
		}
		else {
			const loadTime = Date.now();
			console.log(`Time stamp of last save: ${saveTime}`);
			console.log(`Current time stamp: ${loadTime}`);
			this.downTime = loadTime - saveTime;
		}
	}

	deleteSave() {
		console.log("Delete local storage.")
		localStorage.removeItem("cionx_multiple-multipliers_save");
	}

	start(): void {
		this.update = updateManager.start.bind(updateManager);
	}

	update(): void {
		// overwritten during the game
	}
	
	stop(): void {
	}

	set autoRoll(value: boolean) {
		updateManager.autoRoll = value;
	}

}



const gameManager = new GameManager();
