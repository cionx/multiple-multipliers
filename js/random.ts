export { randomInt };



function randomInt(a: number, b: number): number {
	return Math.floor( a + Math.random() * (b - a) );
}
