export { randomInt, bernoulli };



function randomInt(a: number, b: number): number {
	return Math.floor( a + Math.random() * (b - a) );
}

function bernoulli(probability: number): boolean {
	return Math.random() <= probability;
}
