export { Multiplier };



import { Stat } from "./stat.js";
import { Dice } from "./dice.js";
import { SideType } from "./fighter.js";
import { randomInt } from "./random.js";



class Multiplier {
	private name: string;
	
	private dice: Dice;
	private currentRollDelay: number;
	private lastRoll: number;

	private display: HTMLDivElement;
	private diceDisplay: HTMLSpanElement;

	constructor(name: string, stat: Stat, side: SideType) {
		this.name = name;

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
		
		const diceDisplay = <HTMLSpanElement|null> this.display.querySelector(".dice");
		if (diceDisplay == null) {
			throw new Error("Can’t find the display field for dice values in the template.")
		}
		this.diceDisplay = diceDisplay;
		
		this.dice = new Dice(this.diceDisplay, stat);
		
		if (side == "troop") {
			document.querySelector(".left")?.appendChild(this.display);
		} else {
			document.querySelector(".right")?.appendChild(this.display);
		}
	}

	start(time: number): void {
		this.currentRollDelay = 100;
		this.lastRoll = time + randomInt(0, 1000);
	}

	update(time: number) {
		if (time > this.lastRoll + this.currentRollDelay) {
			this.dice.roll();
			this.lastRoll = time;
			this.currentRollDelay *= 1.2;
		}
	}

	get value(): number {
		return this.dice.value;
	}
	
	get isRolling(): boolean {
		return this.currentRollDelay < 1000;
	}

}


