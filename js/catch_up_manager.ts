export { catchUpManager }


import { TICKDELAY } from "./main.js";
import { gameManager } from "./game_manager.js";


const UPDATESPEED = 240;


class CatchUpManager {

	ticks: number;

	bottomWindow: HTMLDivElement;

	loadingWindow: HTMLDivElement;
	loadingBar: HTMLProgressElement;

	constructor() {
		const loadingWindow = <HTMLDivElement|null> document.querySelector(".loading-window");
		if (loadingWindow == null) {
			throw new Error("Can’t find the loading window in the HTML document.");
		}
		this.loadingWindow = loadingWindow;

		const loadingBar = <HTMLProgressElement|null> document.querySelector(".loading-bar");
		if (loadingBar == null) {
			throw new Error("Can’t find the loading bar in the HTML document.")
		}
		this.loadingBar = loadingBar;
		
		const bottomWindow = <HTMLDivElement|null> document.querySelector(".bottom");
		if (bottomWindow == null) {
			throw new Error("Can’t find the bottom window in the HTML document.")
		}
		this.bottomWindow = bottomWindow;
		
		this.ticks = 0;
	}
	
	start() {
		this.loadingWindow.style.display = "";
		this.bottomWindow.style.visibility = "hidden";
		console.log(`Saved up seconds since the game was closed: ${gameManager.downTime/1000}`);
		
		this.ticks = Math.floor( gameManager.downTime / TICKDELAY );
		// this.ticks = 24 * 60 * 60 * 4;
		this.loadingBar.max = this.ticks;
		this.loadingBar.value = 0;

		gameManager.autoRoll = true;
		requestAnimationFrame(this.update.bind(this));
	}

	update() {
		for (let i = 0; i < UPDATESPEED && this.ticks > 0; i++) {
			gameManager.update();
			this.ticks--;
		}
		this.loadingBar.value += UPDATESPEED;

		if (this.ticks > 0) {
			requestAnimationFrame(this.update.bind(this));
		}
		else {
			this.stop();
		}
	}
	
	stop() {
		gameManager.autoRoll = false;
		this.loadingWindow.style.display = "none";
		this.bottomWindow.style.visibility = "";
	}
	
}

const catchUpManager = new CatchUpManager();
