export { Timer };


import { fightManager, gameManager } from "./game_manager.js";
import { TICKDELAY } from "./main.js";


const RUNTIME = 90000; // 2 minutes


class Timer {
	startTime: number;
	timeDisplay: HTMLSpanElement;
	ticksLeft: number;

	constructor() {
		this.startTime = 0;

		const timeDisplay = <HTMLSpanElement|null> document.querySelector(".timer");
		if (timeDisplay == null) {
			throw new Error("Can’t find the timer display in the HTML document.")
		}
		this.timeDisplay = timeDisplay;
		this.ticksLeft = 0;
	}

	start() {
		this.timeDisplay.style.display = "";
		this.ticksLeft = RUNTIME / TICKDELAY;
	}

	update() {
		if (this.ticksLeft <= 0) {
			gameManager.update = fightManager.stop.bind(fightManager);
		}
		this.ticksLeft--;
		this.refreshDisplay();
	}
	
	stop() {
		this.timeDisplay.style.display = "none";
	}

	refreshDisplay() {
		const timeLeft = Math.max(0, this.ticksLeft * TICKDELAY);
		const secondsLeft = Math.ceil(timeLeft / 1000);
		
		const seconds = secondsLeft % 60;
		const minutes = Math.floor(secondsLeft/60);

		this.timeDisplay.innerHTML = `${minutes}:${seconds<10?"0":""}${seconds}`;
	}
}
