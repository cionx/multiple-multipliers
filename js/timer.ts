export { Timer };


import { fightManager, gameManager } from "./game_manager.js";


const RUNTIME = 90000; // 2 minutes


class Timer {
	startTime: number;
	timeDisplay: HTMLSpanElement;

	constructor() {
		this.startTime = 0;

		const timeDisplay = <HTMLSpanElement|null> document.querySelector(".timer");
		if (timeDisplay == null) {
			throw new Error("Can’t find the timer display in the HTML document.")
		}
		this.timeDisplay = timeDisplay;
	}

	start(time: number) {
		this.timeDisplay.style.display = "";
		this.startTime = time;
	}

	update(time: number) {
		if (time >= this.startTime + RUNTIME) {
			gameManager.update = fightManager.stop.bind(fightManager);
		}
		this.refreshDisplay(time);
	}
	
	stop() {
		this.timeDisplay.style.display = "none";
	}

	refreshDisplay(time: number) {
		const timeLeft = Math.max(0, this.startTime + RUNTIME - time);
		const secondsLeft = Math.ceil(timeLeft / 1000);
		
		const seconds = secondsLeft % 60;
		const minutes = Math.floor(secondsLeft/60);

		this.timeDisplay.innerHTML = `${minutes}:${seconds<10?"0":""}${seconds}`;
	}
}
