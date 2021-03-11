import { gameManager } from "./game_manager.js";


main();


let lastSave = 0;
const SAVEINTERVAL = 30000;


function main(): void {
	gameManager.initialize();
	gameManager.checkForSave();
	gameManager.start();
	window.requestAnimationFrame(update);
}

function update(time: number): void {
	if ( time > lastSave + SAVEINTERVAL ) {
		gameManager.save();
		lastSave = time;
	}
	gameManager.update(time);
	requestAnimationFrame(update);
}
