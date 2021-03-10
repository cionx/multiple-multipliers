export { statManager };


import { Stat } from "./stat.js";
import { Fighter, SideType, sideTypesArray, FighterType } from "./fighter.js";
import { FightManager } from "./fight_manager.js"


type StatList = Map<FighterType, {[property: string]: Stat}>;


class StatManager {
		
	public readonly statLists: Map<SideType, StatList>;
	
	constructor() {
		this.statLists = new Map();
	}
	
	initialize(): void {
		FightManager.initialize();
		
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
	
	adjustForCurrentLevel(level: number) {
		const statArray = this.statArray("enemy");
		for ( const stat of statArray) {
			stat.adjustForLevel(level);
		}
	}
	
	adjustForMaxLevel(level: number) {
		const statArray = this.statArray("troop");
		for ( const stat of statArray) {
			stat.adjustForLevel(level);
		}
	}

	private statArray(side: SideType): Stat[] {
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



const statManager = new StatManager();
