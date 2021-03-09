export { Stat };



import { Fighter, FighterType } from "./fighter.js";
import { FightManager } from "./fight_manager.js";



class Stat {

	readonly name: string;
	private _min: number;
	private _max: number;
	
	public static statList: Map<[FighterType, string], Stat>;
	// entries are set after the class definition

	constructor(name: string) {
		this.name = name;
		this._min = 1;
		this._max = 1;
	}

	public static initialize() {
		FightManager.initialize();
		Stat.statList = new Map();
		for (const [typeName, propertyList] of Array.from(Fighter.fighterProperties)) {
			Stat.statList.set( [typeName, "number"], new Stat(`${typeName}: number` ) );
			for (const property of propertyList) {
				Stat.statList.set( [typeName, property], new Stat(`${typeName}: ${property}` ) );
			}
		}
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

	get min(): number {
		return this._min;
	}

	get max(): number {
		return this._max;
	}
	
	get isActive(): boolean {
		return (this.max <= 0);
	}
}




