export { updateManager };


import { gameManager } from "./game_manager.js";
import { diceManager } from "./dice_manager.js";
import { messenger } from "./messenger.js";
import { levelManager } from "./level_manager.js";


import { FighterType } from "./fighter.js";
import { Manager } from "./manager.js";
import { Update } from "./update.js";
import { statManager } from "./stat_manager.js";


type UpdateList = Map<FighterType, {[property: string]: Update}>;


class UpdateManager extends Manager {

	window: HTMLDivElement;
	playButton: HTMLButtonElement;

	private static updateList: UpdateList;

	static get updateArray(): Update[] {
		const result =
		Array.from(
			UpdateManager
			.updateList
			.values()
		)
		.map( propEnum =>
			Object.values(propEnum)
		)
		.flat();
		return result;
	}

	constructor() {
		super();
		
		const window = <HTMLDivElement|null> document.querySelector("div.shop-window");
		if (window == null) {
			throw new Error("Can’t find the shop window in the HTML document.")
		}
		this.window = window;

		const playButton = <HTMLButtonElement|null> document.querySelector(".play-button");
		if (playButton == null) {
			throw new Error("Can’t find the play button it the HTML document.")
		}
		this.playButton = playButton;
		playButton.addEventListener("click", this.stop.bind(this));
	}

	start(): void {
		levelManager.initialize();
		this.window.style.display = "grid";
		this.playButton.disabled = false;
		gameManager.update = this.update.bind(this);
	}

	update(): void {
	}

	stop(): void {
		gameManager.update = diceManager.start.bind(diceManager);
		messenger.hide();
		this.window.style.display = "none";
		this.playButton.disabled = true;
	}
	
	initializeUpdates(): void {
		const statList = statManager.statLists.get("troop");
		if (statList == null) {
			throw Error("Can’t load the stats for troops.")
		}
		UpdateManager.updateList = new Map();
		const statArray = Array.from( statList.entries() );
		for (const [fighterType, propertyEnum] of statArray) {
			const updateEnum = <{[property: string]: Update}> {};
			const propertyArray = Object.entries(propertyEnum);
			for (const [property, stat] of propertyArray) {
				updateEnum[property] = new Update(stat);
			}
			UpdateManager.updateList.set(fighterType, updateEnum);
		}
	}

	disablePlus(): void {
		for (const update of UpdateManager.updateArray) {
			update.disablePlus();
		}
	}

	enablePlus(): void {
		for (const update of UpdateManager.updateArray) {
			update.enablePlus();
		}
	}
}

const updateManager = new UpdateManager();
updateManager.initializeUpdates();
