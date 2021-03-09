export { Dice, MAXFACES };



import { Sprite } from "./sprite.js";
import { Stat } from "./stat.js";
import { randomInt } from "./random.js";



const MAXFACES = 50;



class Dice {
	
	private _value: number;
	private readonly stat: Stat;
	private readonly diceDisplay: HTMLSpanElement;

	constructor (diceDisplay: HTMLSpanElement, stat: Stat) {
		this._value = 1;
		this.stat = stat;
		// this.sprites = 
		// 	Array(MAXFACES + 1)
		// 	.fill(0)
		// 	.map( (_, i) =>
		// 		new Sprite(`./graphics/dice-${i}.png`)
		// 	);
		// for (const sprite of this.sprites) {
		// 	sprite.addClass("dice");
		// }
		this.diceDisplay = diceDisplay;
		this.refreshDisplay();
	}

	reset(): void {
		this._value = 1;
	}

	roll(): void {
		let newValue = this.value;
		// while (newValue == this.value) {
			newValue = randomInt(this.stat.min, this.stat.max + 1);
		// }
		this.value = newValue;
		this.refreshDisplay();
	}

	get value(): number {
		return this._value;
	}

	set value(value: number) {
		this._value = value;
	}
	
	refreshDisplay() {
		this.diceDisplay.innerHTML = String(this.value);
	// 	const display = this.resultDisplay;
	// 	for (const child of display.children) {
	// 		display.removeChild(child);
	// 	}
	// 	display.appendChild( this.sprites[this.value].image );
	}
}
