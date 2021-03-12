export { Manager };


abstract class Manager {
	constructor() {
		// nothing to do here
	}

	abstract start(): void;

	abstract update(): void;

	abstract stop(): void;
}
