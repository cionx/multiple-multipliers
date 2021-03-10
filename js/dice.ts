export { Dice, MAXFACES };


import { Stat } from "./stat.js";
import { randomInt } from "./random.js";
import { SideType } from "./fight_manager.js";


const MAXFACES = 50;


class Dice {
	
	private _value: number;
	private readonly stat: Stat;
	
	private readonly display: HTMLDivElement;
	private readonly valueDisplay: HTMLSpanElement;

	private currentRollDelay: number;
	private lastRoll: number;

	constructor (stat: Stat) {
		this._value = 1;
		this.stat = stat;
		
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
		nameDisplay.innerHTML = stat.property;
		
		const valueDisplay = <HTMLSpanElement|null> this.display.querySelector(".dice");
		if (valueDisplay == null) {
			throw new Error("Can’t find the display field for dice values in the template.")
		}
		this.valueDisplay = valueDisplay;
		
		if (this.stat.side == "troop") {
			document.querySelector(".left")?.appendChild(this.display);
		} else {
			document.querySelector(".right")?.appendChild(this.display);
		}
		
		this.refreshDisplay();
	}

	start(time: number): void {
		this.currentRollDelay = 100;
		this.lastRoll = time + randomInt(0, 1000);
	}
	
	update(time: number) {
		if (time > this.lastRoll + this.currentRollDelay) {
			this.roll();
			this.lastRoll = time;
			this.currentRollDelay *= 1.2;
		}
	}

	reset(): void {
		this._value = 1;
	}

	roll(): void {
		this.value = randomInt(this.stat.min, this.stat.max + 1);
		this.refreshDisplay();
	}

	get value(): number {
		return this._value;
	}

	set value(value: number) {
		this._value = value;
	}
	
	get isRolling(): boolean {
		return this.currentRollDelay < 1000;
	}
	
	refreshDisplay() {
		this.valueDisplay.innerHTML = String(this.value);
	}
}
