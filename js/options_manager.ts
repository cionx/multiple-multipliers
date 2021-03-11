import { gameManager } from "./game_manager.js";

export { OptionsManager };

class OptionsManager {
	
	audio: HTMLAudioElement;
	
	muteButton: HTMLButtonElement;
	volumeSlider: HTMLInputElement;

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

		this.audio = document.getElementsByTagName("audio")[0];

		const volumeSlider = <HTMLInputElement|null> document.querySelector(".volume-slider");
		if (volumeSlider == null) {
			throw new Error("Can’t find the volume slider in the HTML document.")
		}
		this.volumeSlider = volumeSlider;
		this.volumeSlider.addEventListener("input", this.adjustVolume.bind(this));

		const muteButton = <HTMLButtonElement|null> document.querySelector(".mute-button");
		if (muteButton == null) {
			throw new Error("Can’t find the mute button in the HTLM document.");
		}
		this.muteButton = muteButton;
		this.muteButton.addEventListener("click", this.toggleMute.bind(this));

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
		this.optionsButton.innerHTML = "Updates";
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

	adjustVolume() {
		const value = this.volumeSlider.valueAsNumber;
		this.audio.volume = value/100;
	}

	toggleMute() {
		this.audio.muted = !this.audio.muted;
		this.muteButton.innerHTML = (this.audio.muted ? "Unmute" : "Mute");
	}
}
