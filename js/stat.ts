export { Stat };



import { Fighter, FighterType, sideTypesArray } from "./fighter.js";
import { FightManager, SideType } from "./fight_manager.js";


type StatList = Map<FighterType, {[property: string]: Stat}>;


class Stat {

	readonly name: string;
	private _min: number;
	private _max: number;
	
	public static statLists: Map<SideType, StatList>;
	// entries are set after the class definition

	constructor(name: string) {
		this.name = name;
		this._min = 1;
		this._max = 1;
	}

	public static initialize() {
		FightManager.initialize();
		Stat.statLists = new Map();
		for (const side of sideTypesArray) {
			const statList = <StatList> new Map();
			for (const [typeName, propertyList] of Array.from(Fighter.fighterProperties)) {
				const propertyEnum = <{[property: string]: Stat}> {};
				propertyEnum["Number"] = new Stat(`${typeName} Number` );
				for (const property of propertyList) {
					propertyEnum[property] = new Stat(`${typeName} ${property}` );
				}
				statList.set(typeName, propertyEnum);
			}
			Stat.statLists.set(side, statList);
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




