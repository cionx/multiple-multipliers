import { gameManager } from "./game_manager.js";



main();



function main(): void {
	gameManager.checkForSave();
	gameManager.start();
	window.requestAnimationFrame(update);
}

function update(time: number): void {
	console.log(time);
	gameManager.update(time);
	requestAnimationFrame(update);
}
