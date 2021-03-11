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
	messenger,
	timer
};


import { Manager } from "./manager.js";
import { FightManager } from "./fight_manager.js";
import { StatManager, StatSaveFormat } from "./stat_manager.js";
import { DiceManager } from "./dice_manager.js";
import { UpdateManager } from "./update_manager.js";
import { LevelManager, LevelSaveFormat } from "./level_manager.js";
import { PointManager } from "./point_manager.js";
import { DrawingArea } from "./drawing_area.js";
import { FighterInitializer } from "./fighter_initializer.js";
import { EnemyStatManager } from "./enemy_stat_manager.js";
import { RollbackManager } from "./rollback_manager.js";
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
const messenger = new Messenger();
const timer = new Timer();


type SaveFormat = {
	"levelManager": LevelSaveFormat,
	"statManager": StatSaveFormat
}


class GameManager extends Manager {

	constructor() {
		super();
	}
	
	initialize() {
		fightManager.initialize();
		statManager.initialize();
		updateManager.initializeUpdates();
		levelManager.initialize();
	}

	save(): void {
		let saveJSON = JSON.stringify(this.getSave());
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
			"levelManager": levelManager.getSave(),
			"statManager": statManager.getSave()
		};
		return save;
	}

	loadSave(save: SaveFormat) {
		levelManager.loadSave( save["levelManager"] );
		statManager.loadSave( save["statManager"] );
	}

	start(): void {
		this.update = updateManager.start.bind(updateManager);
	}

	update(time: number): void {
		// overwritten during the game
	}
	
	stop(): void {
	}

}



const gameManager = new GameManager();
