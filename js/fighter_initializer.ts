export { FighterInitializer }


import {
	gameManager,
	fightManager,
	statManager,
	drawingArea,
	timer,
} from "./game_manager.js";


import { SideType } from "./fight_manager.js";
import { Manager } from "./manager.js";
import { randomInt } from "./random.js";
import { Fighter} from "./fighter.js";
import { Coordinate } from "./coordinate.js";


class FighterInitializer extends Manager {

	constructor() {
		super()
	}

	start() {
		fightManager.resetField();
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
					if (property == "Number" || !stat.unlocked) {
						continue;
					}
					for (const fighter of fighterArray) {
						fighter.multiplyProperty(property, stat.value);
					}
				}
				
				fightManager.addFighters(fighterArray, side);
			}
		}
	}

	stop() {
		timer.start();
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



