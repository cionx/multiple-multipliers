export { Update };


import { updateManager } from "./update_manager.js";
import { pointManager } from "./point_manager.js";

import { Stat } from "./stat.js";
import { MAXFACES } from "./dice.js";


class Update {
	private stat: Stat;

	private displayBox: HTMLDivElement;
	private nameDisplay: HTMLSpanElement;
	private minMinusButton: HTMLButtonElement;
	private minPlusButton: HTMLButtonElement;
	private minDisplay: HTMLSpanElement;
	private maxDisplay: HTMLSpanElement;
	private maxMinusButton: HTMLButtonElement;
	private maxPlusButton: HTMLButtonElement;


	constructor(stat: Stat) {
		this.stat = stat;
		
		const template = <HTMLTemplateElement|null> document.querySelector(".update-window-template");
		if (template == null) {
			throw new Error("Can’t find the template for update boxes it the HTML document.");
		}
		const displayBox = <HTMLDivElement> template.content.cloneNode(true);
		this.displayBox = displayBox;

		const nameDisplay = <HTMLSpanElement> displayBox.querySelector(".update-name");
		if (nameDisplay == null) {
			throw new Error("Can’t find the update name display field in the template.");
		}
		this.nameDisplay = nameDisplay;
		
		const minDisplay = <HTMLSpanElement> displayBox.querySelector(".update-value-min");
		if (minDisplay == null) {
			throw new Error("Can’t find the update min-value display field in the template.");
		}
		this.minDisplay = minDisplay;
		
		const maxDisplay = <HTMLSpanElement> displayBox.querySelector(".update-value-max");
		if (maxDisplay == null) {
			throw new Error("Can’t find the update max-value display field in the template.");
		}
		this.maxDisplay = maxDisplay;
		
		const minMinusButton = <HTMLButtonElement> displayBox.querySelector(".update-min-minus");
		if (minMinusButton == null) {
			throw new Error("Can’t find the update minimum plus button in the template.");
		}
		this.minMinusButton = minMinusButton;

		const minPlusButton = <HTMLButtonElement> displayBox.querySelector(".update-min-plus");
		if (minPlusButton == null) {
			throw new Error("Can’t find the update minimum plus button in the template.");
		}
		this.minPlusButton = minPlusButton;
		
		const maxMinusButton = <HTMLButtonElement> displayBox.querySelector(".update-max-minus");
		if (maxMinusButton == null) {
			throw new Error("Can’t find the update maximum plus button in the template.");
		}
		this.maxMinusButton = maxMinusButton;

		const maxPlusButton = <HTMLButtonElement> displayBox.querySelector(".update-max-plus");
		if (maxPlusButton == null) {
			throw new Error("Can’t find the update maximum plus button in the template.");
		}
		this.maxPlusButton = maxPlusButton;

		this.nameDisplay.innerHTML = this.stat.name;

		this.minMinusButton.addEventListener("click", this.decreaseMin.bind(this));
		this.minPlusButton.addEventListener("click", this.increaseMin.bind(this));
		this.maxMinusButton.addEventListener("click", this.decreaseMax.bind(this));
		this.maxPlusButton.addEventListener("click", this.increaseMax.bind(this));
		
		this.refreshDisplay();

		updateManager.window.appendChild(displayBox);
	}

	refreshDisplay(): void {
		const min = this.stat.min;
		const max = this.stat.max;
		this.minDisplay.innerHTML = String(min);
		this.maxDisplay.innerHTML = String(max);
		this.refreshButtons();
	}

	refreshButtons(): void {
		this.minPlusButton.disabled = (this.stat.min + 1 > this.stat.max);
		this.maxMinusButton.disabled = (this.stat.min + 1 > this.stat.max);
		this.minMinusButton.disabled = (this.stat.min <= 0);
		this.maxPlusButton.disabled = (this.stat.max >= MAXFACES);
		this.minPlusButton.disabled ||= (pointManager.points <= 0);
		this.maxPlusButton.disabled ||= (pointManager.points <= 0);
	}
	
	disablePlus(): void {
		this.minPlusButton.disabled = true;
		this.maxPlusButton.disabled = true;
	}
	
	enablePlus(): void {
		this.refreshButtons();
	}

	// /* CHOOSE THESE FUNCTIONS DEPENDING ON THE VERSION */

	public increaseMin(): void {
		this.stat.increaseMin();
		pointManager.points--;
		this.refreshDisplay();
	}

	public decreaseMin(): void {
		this.stat.decreaseMin();
		pointManager.points++;
		this.refreshDisplay();
	}

	public increaseMax(): void {
		this.stat.increaseMax();
		pointManager.points--;
		this.refreshDisplay();
	}

	public decreaseMax(): void {
		this.stat.decreaseMax();
		pointManager.points++;
		this.refreshDisplay();
	}
}
