export { updateManager };



import { gameManager } from "./game_manager.js";
import { multiplierManager } from "./multiplier_manager.js";
import { messenger } from "./messenger.js";
import { Stat } from "./stat.js";



import { Manager } from "./manager.js";
import { Update } from "./update.js";



class UpdateManager extends Manager {

	window: HTMLDivElement;
	playButton: HTMLButtonElement;

	private static updateList: Update[];

	constructor() {
		super();
		
		const window = <HTMLDivElement|null> document.querySelector("div.shop-window");
		if (window == null) {
			throw new Error("Can’t find the shop window in the HTML document.")
		}
		this.window = window;

		const playButton = <HTMLButtonElement|null> document.querySelector(".play-button");
		if (playButton == null) {
			throw new Error("Can’t find the play button it the HTML document.")
		}
		this.playButton = playButton;
		playButton.addEventListener("click", this.stop.bind(this));
	}

	start(): void {
		gameManager.update = this.update.bind(this);
		this.window.style.display = "grid";
		this.playButton.disabled = false;
	}

	update(): void {
	}

	stop(): void {
		gameManager.update = multiplierManager.start.bind(multiplierManager);
		messenger.hide();
		this.window.style.display = "none";
		this.playButton.disabled = true;
	}
	
	initializeUpdates(): void {
		UpdateManager.updateList =
			Array.from(
				Stat.statList.values()
			)
			.map(stat =>
				new Update(stat)
			);
	}

	disablePlus(): void {
		for (const update of UpdateManager.updateList) {
			update.disablePlus();
		}
	}

	enablePlus(): void {
		for (const update of UpdateManager.updateList) {
			update.enablePlus();
		}
	}
}

const updateManager = new UpdateManager();
updateManager.initializeUpdates();
