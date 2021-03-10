export { Manager };


abstract class Manager {
	constructor() {
		// nothing to do here
	}

	abstract start(time: number): void;

	abstract update(time: number): void;

	abstract stop(time: number): void;
}
