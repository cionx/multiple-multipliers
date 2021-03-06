export { Multiplier };



import { Side } from "./fighter.js";
import { randomInt } from "./random.js";



class Multiplier {
	private name: string;
	
	private maxValue: number;
	private _value: number;
	
	private currentRollDelay: number;
	private lastRoll: number;

	private display: HTMLDivElement;
	private valueDisplay: HTMLSpanElement;

	constructor(name: string, side: Side) {
		this.name = name;

		this._value = 1;
		this.maxValue = 2;

		this.currentRollDelay = 0;
		this.lastRoll = 0;
		
		const template = <HTMLTemplateElement|null> document.getElementById("multiplier-template");
		if (template == null) {
			throw new Error("Can’t find the template for dice displays it the HTML document.")
		}

		this.display = <HTMLDivElement> template.content.cloneNode(true);
		
		const nameDisplay = <HTMLSpanElement|null> this.display.querySelector(".multiplier-name");
		if (nameDisplay == null) {
			throw new Error("Can’t find the display field for dice names in the template.")
		}
		nameDisplay.innerHTML = this.name;
		
		const valueDisplay = <HTMLSpanElement|null> this.display.querySelector(".multiplier-value");
		if (valueDisplay == null) {
			throw new Error("Can’t find the display field for dice values in the template.")
		}
		this.valueDisplay = valueDisplay;
		
		if (side == "troop") {
			document.querySelector(".left")?.appendChild(this.display);
		} else {
			document.querySelector(".right")?.appendChild(this.display);
		}
	}

	start(time: number): void {
		this.value = 0;
		this.currentRollDelay = 100;
		this.lastRoll = time + randomInt(0, 1000);
	}

	update(time: number) {
		if (time > this.lastRoll + this.currentRollDelay) {
			this.value = randomInt(1, 6);
			console.log(this._value);
			this.lastRoll = time;
			this.currentRollDelay *= 1.2;
		}
	}

	get value(): number {
		return this._value;
	}
	
	get isRolling(): boolean {
		return this.currentRollDelay < 1000;
	}

	set value(value: number) {
		this._value = value;
		this.refreshDisplay();
	}
	
	refreshDisplay() {
		this.valueDisplay.innerHTML = String(this.value);
	}

}


