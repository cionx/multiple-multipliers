export { messenger };



import { gameManager } from "./game_manager.js";
import { updateManager } from "./update_manager.js";
import { Manager } from "./manager.js";
import { fightManager } from "./fight_manager.js";






class Messenger extends Manager {
	
	static readonly SCREENTIME = 4000;

	private startTime: number;
	private window: HTMLDivElement;

	constructor() {
		super();

		this.startTime = 0;
		
		const window = <HTMLDivElement|null> document.querySelector(".messenger-window");
		if (window == null) {
			throw new Error("Can’t find the message window in the HTML file.");
		}
		this.window = window;
	}
	
	start(time: number) {
		this.startTime = time;
		this.window.innerHTML = fightManager.resultString;
		gameManager.update = this.update.bind(this);
		this.window.style.display = "flex";
	}

	update(time: number) {
		if (time > this.startTime + Messenger.SCREENTIME) {
			this.stop();
		}
	}

	stop() {
		updateManager.start();
	}

	hide() {
		this.window.style.display = "none";
	}

}

const messenger = new Messenger();
