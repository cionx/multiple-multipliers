export { PointManager };


import { statManager, updateManager } from "./game_manager.js";


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
			this.points += (stat.min - 1);
			this.points += (stat.max - 1);
			stat.min = 1;
			stat.max = 1;
		}
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
