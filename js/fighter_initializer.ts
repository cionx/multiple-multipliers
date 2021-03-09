export { fighterInitializer }


import { fightManager, SideType } from "./fight_manager.js";
import { gameManager } from "./game_manager.js";
import { drawingArea } from "./drawing_area.js";


import { Manager } from "./manager.js";
import { randomInt } from "./random.js";
import { Fighter, FighterType } from "./fighter.js";
import { multiplierManager } from "./multiplier_manager.js";
import { Coordinate } from "./coordinate.js";
import { Multiplier } from "./multiplier.js";


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

		const multiplierListsArray =
			Array.from(
				multiplierManager.multiplierLists
			);

		for (const [side, multiplierList] of multiplierListsArray) {

			const multiplierArray =
				Array.from(
					multiplierList.entries()
				);

			for (const [fighterType, multiplierEnum] of multiplierArray) {

				const constructor = Fighter.fighterConstructors.get(fighterType);
				if (constructor == undefined) {
					throw new Error(`Can’t find the constructor for ${fighterType}`);
				}
				const amount = multiplierEnum["Number"].value;
				
				const fighterArray =
					Array(amount)
					.fill(null)
					.map( _ =>
						constructor(this.generateRandomCoord(side), side)
					);
				
				const multiplierPairs = Object.entries(multiplierEnum);
				for (const [property, multiplier] of multiplierPairs) {
					if (property == "Number") {
						continue;
					}
					for (const fighter of fighterArray) {
						fighter.multiplyProperty(property, multiplier.value);
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
