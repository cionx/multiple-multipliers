export { TICKDELAY };


import { gameManager } from "./game_manager.js";
import { catchUpManager } from "./catch_up_manager.js";


let lastSave = 0;
let lastTick = 0;

const SAVEINTERVAL = 30000;
const TICKDELAY = 25;


main();


function main(): void {
	gameManager.initialize();
	gameManager.checkForSave();
	gameManager.start();
	requestAnimationFrame(catchUpManager.start.bind(catchUpManager));
	requestAnimationFrame(start);
}


function start(time: number) {
	lastTick = time;
	requestAnimationFrame(update);
}


function update(time: number): void {
	let ticks = Math.floor( (time - lastTick) / TICKDELAY );
	lastTick += ticks * TICKDELAY;
	while (ticks > 0) {
		gameManager.update();
		ticks--;
	}
	if ( time > lastSave + SAVEINTERVAL ) {
		gameManager.save();
		lastSave = time;
	}
	requestAnimationFrame(update);
}
