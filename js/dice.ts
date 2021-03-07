export { Dice };



import { Sprite } from "./sprite.js";
import { randomInt } from "./random.js";



const MAXFACES = 6;



class Dice {
	
	private _value: number;
	private _faces: number;
	private diceDisplay: HTMLSpanElement;

	constructor (diceDisplay: HTMLSpanElement) {
		this._value = 1;
		this._faces = 6;
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
		this._value = 0;
	}

	roll(): void {
		let newValue = this.value;
		while (newValue == this.value) {
			newValue = randomInt(1, this._faces + 1);
		}
		this.value = newValue;
		this.refreshDisplay();
	}

	get value(): number {
		return this._value;
	}
	
	get faces(): number {
		return this._faces;
	}

	set value(value: number) {
		this._value = value;
	}

	set faces(newFaces: number) {
		if (this.faces <= MAXFACES) {
			this._faces = newFaces
		}
		else {
			throw new Error(`Can’t set the amount of faces to ${newFaces}: the maximum is ${MAXFACES}.`);
		}
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
