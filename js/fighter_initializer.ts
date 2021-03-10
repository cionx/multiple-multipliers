export { fighterInitializer }


import { fightManager, SideType } from "./fight_manager.js";
import { gameManager } from "./game_manager.js";
import { drawingArea } from "./drawing_area.js";


import { Manager } from "./manager.js";
import { randomInt } from "./random.js";
import { Fighter} from "./fighter.js";
import { Coordinate } from "./coordinate.js";
import { statManager } from "./stat_manager.js";


class FighterInitializer extends Manager {

	constructor() {
		super()
	}

	start() {
		fightManager.resetFighters();
		gameManager.update = this.update.bind(this);
	}

	update() {
		this.generateFighters();
		this.stop();
	}

	generateFighters() {

		const statListsArray = Array.from( statManager.statLists.entries() );

		for (const [side, statList] of statListsArray) {

			const statArray =
				Array.from(
					statList.entries()
				);

			for (const [fighterType, propertyEnum] of statArray) {

				const constructor = Fighter.fighterConstructors.get(fighterType);
				if (constructor == undefined) {
					throw new Error(`Can’t find the constructor for ${fighterType}`);
				}
				const amount = propertyEnum["Number"].value;
				
				const fighterArray =
					Array(amount)
					.fill(null)
					.map( _ =>
						constructor(this.generateRandomCoord(side), side)
					);
				
				const propertyArray = Object.entries(propertyEnum);
				for (const [property, stat] of propertyArray) {
					if (property == "Number") {
						continue;
					}
					for (const fighter of fighterArray) {
						fighter.multiplyProperty(property, stat.value);
					}
				}
				
				fightManager.addFighters(fighterArray, side);
			}
		}

		// const multipliers =
		// 	<[FighterType, string, Multiplier][]>
		// 	Array.from(
		// 		multiplierManager
		// 		.multipliers
		// 		.entries()
		// 	)
		// 	.filter(list =>
		// 		list[0][2] == side
		// 	)
		// 	.map(list => {
		// 		const [[type, property, side], multiplier] = list;
		// 		return [type, property, multiplier];
		// 	});
		
		// const fighters = new Map<FighterType, Fighter[]>();

		// for (const [type, property, multiplier] of multipliers ) {
		// 	if (property == "number") {
		// 		const constructor = Fighter.fighterConstructors.get(type);
		// 		if (constructor == undefined) {
		// 			throw new Error(`Can’t access the constructor for ${type}`);
		// 		}
		// 		const fighterArray =
		// 			Array(multiplier.value)
		// 			.fill(null)
		// 			.map( () =>
		// 				constructor( this.generateRandomCoord(side), side )
		// 			);
		// 		fighters.set(type, fighterArray);
		// 	}
		// }

		// for (let i = 0; i < multipliers.length; i++) {
		// 	console.log(i, multipliers[i]);
		// 	const [type, property, multiplier] = multipliers[i];
		// 	console.log(property);
		// 	if (property == "number") {
		// 		continue;
		// 	}
		// 	const fighterArray = fighters.get(type);
		// 	if (fighterArray == undefined) {
		// 		throw new Error(`Have to fighters of type ${type} to set property ${property} for.`);
		// 	}
		// 	for (const fighter of fighterArray) {
		// 		fighter.multiplyProperty(property, multiplier.value); 
		// 	}
		// }

		// fightManager
		// .addFighters(
		// 	Array.from(
		// 		fighters.values()
		// 	)
		// 	.flat(),
		// 	side);
	}

	stop() {
		gameManager.update = fightManager.update.bind(fightManager);
	}


	generateRandomCoord(side: SideType) {
		const width = drawingArea.width;
		const height = drawingArea.height;

		const corner = (side == "troop" ? 0.05 : 0.85);
		const x = randomInt(corner * width, (corner + 0.1) * width);
		const y = randomInt(0.1 * height, 0.9 * height);
		return new Coordinate(x, y);
	}

}



const fighterInitializer = new FighterInitializer();
