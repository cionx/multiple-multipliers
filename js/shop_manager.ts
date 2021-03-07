export { shopManager };



import { Manager } from "./manager.js";
import { gameManager } from "./game_manager.js";
import { multiplierManager } from "./multiplier_manager.js";



class ShopManager extends Manager {

	window: HTMLDivElement;
	playButton: HTMLButtonElement;

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

	start() {
		gameManager.update = this.update.bind(this);
		this.window.style.display = "flex";
		this.playButton.disabled = false;
	}

	update() {
	}

	stop() {
		gameManager.update = multiplierManager.start.bind(multiplierManager);
		this.window.style.display = "none";
		this.playButton.disabled = true;
	}

}


const shopManager = new ShopManager();
