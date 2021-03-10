export { Stat };


import { FighterType } from "./fighter.js";
import { SideType } from "./fight_manager.js";
import { Dice } from "./dice.js";


class Stat {

	fighterType: FighterType;
	property: string;

	side: SideType;
	
	private _min: number;
	private _max: number;
	dice: Dice;

	private _unlocked: boolean;
	private readonly unlockLevel: number;

	constructor(
		fighterType: FighterType,
		property: string,
		unlockLevel: number,
		side: SideType
	) {
		this.fighterType = fighterType;
		this.property = property;
		this.side = side;
		this._min = 1;
		this._max = 1;
		this.dice = new Dice(this);
		this._unlocked = false;
		this.unlockLevel = unlockLevel;
		
		
	}

	private setValues(min: number, max: number): void {
		if (min > max) {
			throw Error("Can’t set the minimum larger than the maximum.");
		}
		if (min < 0) {
			throw Error("Can’t set the minimum to negative.")
		}
		this._min = min;
		this._max = max;
	}

	public increaseMin(): void {
		this.setValues( this.min + 1, this.max);
	}

	public decreaseMin(): void {
		this.setValues( this.min - 1, this.max);
	}
	
	public increaseMax(): void {
		this.setValues( this.min, this.max + 1);
	}

	public decreaseMax(): void {
		this.setValues( this.min, this.max - 1);
	}

	public get name(): string {
		return `${this.fighterType} ${this.property}`;
	}

	public get min(): number {
		return this._min;
	}

	public get max(): number {
		return this._max;
	}
	
	public get value(): number {
		return this.dice.value;
	}
	
	public get isActive(): boolean {
		return (this.max <= 0);
	}

	public get unlocked(): boolean {
		return this.unlocked;
	}

	public adjustForLevel(level: number) {
		this._unlocked = (level >= this.unlockLevel);
	}
}




