export { Messenger };


import { gameManager, fightManager, levelManager } from "./game_manager.js";
import { TICKDELAY } from "./main.js";


import { Manager } from "./manager.js";


class Messenger extends Manager {
	
	static readonly SCREENTIME = 3000;

	private ticksLeft: number;
	private window: HTMLDivElement;

	constructor() {
		super();

		this.ticksLeft = 0;
		
		const window = <HTMLDivElement|null> document.querySelector(".messenger-window");
		if (window == null) {
			throw new Error("Can’t find the message window in the HTML file.");
		}
		this.window = window;
	}
	
	start() {
		this.ticksLeft = Messenger.SCREENTIME / TICKDELAY;
		this.window.innerHTML = fightManager.resultString;
		gameManager.update = this.update.bind(this);
		this.window.style.display = "flex";
	}

	update() {
		if (this.ticksLeft <= 0) {
			this.stop();
		}
		this.ticksLeft--;
	}

	stop() {
		gameManager.update = levelManager.start.bind(levelManager);
	}

	hide() {
		this.window.style.display = "none";
	}

}

