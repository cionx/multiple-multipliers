export { UpdateManager };


import { gameManager, statManager, messenger, enemyStatManager, drawingArea, timer, optionManager } from "./game_manager.js";


import { FighterType } from "./fighter.js";
import { Manager } from "./manager.js";
import { Update } from "./update.js";
import { TICKDELAY } from "./main.js";


type UpdateList = Map<FighterType, {[property: string]: Update}>;


const AUTOSTARTDELAY = 5000;


class UpdateManager extends Manager {

	window: HTMLDivElement;
	playButton: HTMLButtonElement;

	private autostartTimer: number;
	private autostartCheckbox: HTMLInputElement;
	
	private updateList: UpdateList;
	
	constructor() {
		super();
		this.autostartTimer = 0;
		
		const window = <HTMLDivElement|null> document.querySelector("div.shop-window");
		if (window == null) {
			throw new Error("Can’t find the shop window in the HTML document.")
		}
		this.window = window;

		const autostartCheckbox = <HTMLInputElement|null> document.getElementById("autostart-checkbox");
		if (autostartCheckbox == null) {
			throw new Error("Can’t find the autostart checkbox in the HTML document.")
		}
		this.autostartCheckbox = autostartCheckbox;
		this.autostartCheckbox.checked = false;

		const playButton = <HTMLButtonElement|null> document.querySelector(".play-button");
		if (playButton == null) {
			throw new Error("Can’t find the play button it the HTML document.")
		}
		this.playButton = playButton;
		playButton.addEventListener("click", this.stop.bind(this));
		
		this.updateList = new Map();
	}

	start(): void {
		timer.stop();
		optionManager.start();
		this.refreshDisplay();
		this.window.style.display = "";
		this.playButton.disabled = false;
		this.autostartTimer = AUTOSTARTDELAY / TICKDELAY;
		gameManager.update = this.update.bind(this);
	}

	update(): void {
		if (this.autoRoll && this.autostartTimer <= 0) {
			this.stop();
		}
		else {
			this.autostartTimer--;
		}
	}

	stop(): void {
		optionManager.stop();
		drawingArea.clear();
		gameManager.update = enemyStatManager.start.bind(enemyStatManager);
		messenger.hide();
		this.window.style.display = "none";
		this.playButton.disabled = true;
	}

	initialize(): void {
		const statList = statManager.statLists.get("troop");
		if (statList == null) {
			throw Error("Can’t load the stats for troops.")
		}
		const statArray = Array.from( statList.entries() );
		for (const [fighterType, propertyEnum] of statArray) {
			const updateEnum = <{[property: string]: Update}> {};
			const propertyArray = Object.entries(propertyEnum);
			for (const [property, stat] of propertyArray) {
				updateEnum[property] = new Update(stat);
			}
			this.updateList.set(fighterType, updateEnum);
		}
	}

	private get updateArray(): Update[] {
		const result =
		Array.from(
			this
			.updateList
			.values()
		)
		.map( propEnum =>
			Object.values(propEnum)
		)
		.flat();
		return result;
	}

	disablePlus(): void {
		for (const update of this.updateArray) {
			update.disablePlus();
		}
	}

	enablePlus(): void {
		for (const update of this.updateArray) {
			update.enablePlus();
		}
	}
	
	get autoRoll(): boolean {
		return this.autostartCheckbox.checked;
	}
	
	set autoRoll(value: boolean) {
		this.autostartCheckbox.checked = value;
	}
	
	refreshDisplay() {
		for (const update of this.updateArray) {
			update.refreshDisplay();
		}
	}

}
