export { Stat };


import { levelManager, statManager } from "./game_manager.js";


import { FighterType } from "./fighter.js";
import { SideType } from "./fight_manager.js";
import { Dice } from "./dice.js";
import { Update } from "./update.js";


class Stat {

	fighterType: FighterType;
	property: string;

	side: SideType;
	
	min: number;
	max: number;
	
	dice: Dice;
	updater: Update | null;

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

		this.min = 1;
		this.max = 1;
		
		this.dice = new Dice(this);
		this.updater = null;

		this._unlocked = false;
		this.unlockLevel = unlockLevel;
		
		this.adjustForLevel(levelManager.currentLevel);
	}

	private setValues(min: number, max: number): void {
		if (min > max) {
			throw Error("Can’t set the minimum larger than the maximum.");
		}
		if (min < 0) {
			throw Error("Can’t set the minimum to negative.")
		}
		this.min = min;
		this.max = max;
		statManager.adjustTypeBoxes();
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

	public setUpdater(updater: Update) {
		this.updater = updater;
	}

	public get name(): string {
		return `${this.fighterType} ${this.property}`;
	}
	
	public get value(): number {
		return (this.unlocked ? this.dice.value : 0);
	}
	
	public get isActive(): boolean {
		return (this.max <= 0);
	}

	public get unlocked(): boolean {
		return this._unlocked;
	}

	public adjustForLevel(level: number) {
		this._unlocked = (level >= this.unlockLevel);
		this.dice.visible = this._unlocked;
	}
}




