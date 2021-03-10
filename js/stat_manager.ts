export { StatManager, StatSaveFormat };


import { Stat } from "./stat.js";
import { Fighter, SideType, sideTypesArray, FighterType, isFighterType } from "./fighter.js";
import { levelManager } from "./game_manager.js";


type StatList = Map<FighterType, {[property: string]: Stat}>;


type StatSaveFormat = {[type: string]: {[property: string]: [number, number]}};


class StatManager {
		
	public readonly statLists: Map<SideType, StatList>;
	
	constructor() {
		this.statLists = new Map();
	}
	
	getSave() {
		const statList = this.statLists.get("troop");
		if (statList == undefined) {
			throw new Error("Save problem: Can’t get the list of stats.");
		}
		const statArray = Array.from( statList.entries() );

		const save = <StatSaveFormat> {}

		for (const [fighterType, propertyEnum] of statArray) {

			const propertySaveEnum = <{[name: string]: [number, number]}> {};

			const propertyArray = Object.entries(propertyEnum);
			for (const [name, stat] of propertyArray) {
				propertySaveEnum[name] = [stat.min, stat.max];
			}

			save[fighterType] = propertySaveEnum;
		}

		return save;
	}
	
	loadSave(save: StatSaveFormat) {
		const statList = this.statLists.get("troop");
		if (statList == undefined) {
			throw new Error("Can’t get the stat list while loading a save.");
		}

		const statArray = Object.entries(save);
		for (const [fighterType, propertyEnum] of statArray) {
			if (!isFighterType(fighterType)) {
				console.log(`Can’t load save stats for "${fighterType}": Does not exist.`);
				continue;
			}
			const currentPropertyEnum = statList.get(fighterType);
			if (currentPropertyEnum == undefined) {
				console.log(`Can’t find current stats for ${fighterType} while loading a save.`);
				continue;
			}
			const propertyArray = Object.entries(propertyEnum);
			for (const [name, [min, max]] of propertyArray) {
				const stat = currentPropertyEnum[name];
				stat.min = min;
				stat.max = max;
			}
		}
	}
	
	initialize(): void {
		for (const side of sideTypesArray) {

			const statList = <StatList> new Map();

			for (const [typeName, propertyList] of Array.from(Fighter.fighterProperties)) {

				const propertyEnum = <{[property: string]: Stat}> {};
				for (const property of propertyList) {
					const [propertyName, unlockLevel] = property;
					propertyEnum[propertyName] = 
						new Stat(typeName, propertyName, unlockLevel, side);
				}
				statList.set(typeName, propertyEnum);
			}
			this.statLists.set(side, statList);

		}

	}
	
	adjustForCurrentLevel() {
		const statArray = this.statArray("enemy");
		for ( const stat of statArray) {
			stat.adjustForLevel(levelManager.currentLevel);
		}
	}
	
	adjustForMaxLevel() {
		const statArray = this.statArray("troop");
		for ( const stat of statArray) {
			stat.adjustForLevel(levelManager.currentMaxLevel);
		}
	}

	public statArray(side: SideType): Stat[] {
		const statList = this.statLists.get(side);
		if (statList == undefined) {
			throw new Error(`Can’t find the stats for ${side}.`);
		}
		const result =
			Array.from(
				statList
				.values()
			)
			.map ( propertyEnum =>
				Object.values( propertyEnum )
			)
			.flat();
		return result;
	}

	public totalStatArray(): Stat[] {
		let array = <Stat[]> [];
		for (const side of sideTypesArray) {
			array = array.concat( this.statArray(side) );
		}
		return array;
	}
}
