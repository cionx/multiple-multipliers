import { gameManager } from "./game_manager.js";



main();



let lastSave = 0;



function main(): void {
	gameManager.checkForSave();
	gameManager.start();
	window.requestAnimationFrame(update);
}

function update(time: number): void {
	gameManager.update(time);
	requestAnimationFrame(update);
}
