import { gameManager } from "./game_manager.js";

export { OptionsManager };

class OptionsManager {
	
	optionsButton: HTMLButtonElement;
	optionsWindow: HTMLDivElement;

	isOpen: boolean;

	constructor() {

		const optionsButton = <HTMLButtonElement|null> document.querySelector(".options-button");
		if (optionsButton == null) {
			throw new Error("Can’t find the options button in the HTML document.")
		}
		this.optionsButton = optionsButton;
		
		const optionsWindow = <HTMLDivElement|null> document.querySelector(".options-window");
		if (optionsWindow == null) {
			throw new Error("Can’t find the options window in the HTML document.")
		}
		this.optionsWindow = optionsWindow;

		this.isOpen = false;

		this.optionsButton.addEventListener("click", this.toggle.bind(this));
	}


	initialization() {
		const resetButton = <HTMLButtonElement|null> document.querySelector(".reset-button");
		if (resetButton == null) {
			throw new Error("Can’t find the reset button in the HTML document.")
		}
		resetButton.addEventListener("click", gameManager.deleteSave.bind(gameManager));
	}

	start() {
		this.optionsWindow.style.display = "none";
		this.optionsButton.style.display = "";
	}

	toggle() {
		this.isOpen ? this.close() : this.open();
	}

	open() {
		this.optionsWindow.style.display = "";
		this.optionsButton.innerHTML = "Update";
		this.isOpen = true;
	}
	
	close() {
		this.optionsWindow.style.display = "none";
		this.optionsButton.innerHTML = "Options";
		this.isOpen = false;
	}
	
	stop() {
		this.close();
		this.optionsButton.style.display = "none";
	}
}
