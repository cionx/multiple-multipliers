export { Dice };


import { Stat } from "./stat.js";
import { randomInt } from "./random.js";
import { TICKDELAY } from "./main.js";


// const MAXFACES = 50;


class Dice {
	
	private _value: number;
	private readonly stat: Stat;
	
	private valueDisplay: HTMLSpanElement;

	private currentRollDelay: number;
	private tickDelay;

	constructor (stat: Stat) {
		this._value = 1;
		this.stat = stat;
		
		this.currentRollDelay = 0;
		this.tickDelay = 0;
			
		const template = <HTMLTemplateElement|null> document.querySelector(".multiplier-template");
		if (template == null) {
			throw new Error("Can’t find the template for dice displays it the HTML document.")
		}
	
		const instance = <DocumentFragment> template.content.cloneNode(true);

		for (const child of instance.children) {
			child.classList.add(stat.side);
			child.classList.add(stat.fighterType);
			child.classList.add(stat.property);
		}
			
		const nameDisplay = <HTMLSpanElement|null> instance.querySelector(".multiplier-name");
		if (nameDisplay == null) {
			throw new Error("Can’t find the display field for dice names in the template.")
		}
		nameDisplay.innerHTML = stat.property;
		
		const valueDisplay = <HTMLSpanElement|null> instance.querySelector(".dice");
		if (valueDisplay == null) {
			throw new Error("Can’t find the display field for dice values in the template.")
		}
		this.valueDisplay = valueDisplay;

		const sideString = (stat.side == "troop" ? "left" : "right");
		const typeContainer =
			<HTMLDivElement|null>
			document.querySelector(`.${sideString} .type-container.${stat.fighterType}`);
		typeContainer?.appendChild(instance);
	
		this.refreshDisplay();
	}

	start(): void {
		this.currentRollDelay = 200/TICKDELAY;
		this.tickDelay = this.currentRollDelay;
	}
	
	
	update() {
		if (this.tickDelay <= 0) {
			this.roll();
			this.currentRollDelay *= 1.2;
			this.tickDelay = this.currentRollDelay;
		}
		else {
			this.tickDelay--;
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
		return this.currentRollDelay < 1000 / TICKDELAY;
	}

	set visible(visibility: boolean) {
		const displayString = (visibility ? "" : "none");
		const side = this.stat.side;
		const fighterType = this.stat.fighterType;
		const property = this.stat.property;
		const elements = document.getElementsByClassName(`${side} ${fighterType} ${property}`);
		for (const element of elements) {
			(element as HTMLElement).style.display = displayString;
		}
	}
	
	refreshDisplay() {
		this.valueDisplay.innerHTML = String(this.value);
	}
}
