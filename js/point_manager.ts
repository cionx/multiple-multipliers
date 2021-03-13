export { PointManager, PointSaveFormat };


import { statManager, updateManager } from "./game_manager.js";


type PointSaveFormat = number;


class PointManager {
	
	private currentPoints: number;
	private pointDisplay: HTMLSpanElement;

	constructor() {
		this.currentPoints = 1;

		const pointDisplay = <HTMLSpanElement|null> document.getElementById("points-left");
		if (pointDisplay == null) {
			throw new Error("Can’t find the display field for the number of points in the HTML document.");
		}
		this.pointDisplay = pointDisplay;
		
		this.refreshDisplay();
	}

	rollback() {
		for (const stat of statManager.statArray("troop")) {
			this.points += Math.max(0, stat.min - 1);
			this.points += Math.max(0, stat.max - 1);
			stat.min = 1;
			stat.max = 1;
		}
		console.log(`Rollback: Reset to ${this.points} points.`)
	}

	getSave(): PointSaveFormat {
		return this.points;
	}

	loadSave(save: PointSaveFormat) {
		this.points = (save == undefined ? 0 : save);
	}
	
	get points() {
		return this.currentPoints;
	}

	set points(amount: number) {
		if (amount < 0) {
			throw new Error(`Can’t set the amount of available points to ${amount}!`);
		}
		this.currentPoints = amount;
		this.checkDisable();
		this.refreshDisplay();
	}

	checkDisable() {
		(this.points <= 0) ? updateManager.disablePlus() : updateManager.enablePlus();
	}

	refreshDisplay() {
		this.pointDisplay.innerHTML = String(this.points);
	}
}
