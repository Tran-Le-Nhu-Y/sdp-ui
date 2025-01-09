import useBearStore from '../../zustand/store';

function BearCounter() {
	const bears = useBearStore((state) => state.bears);
	return <h1>{bears} around here ...</h1>;
}

function Controls() {
	const increasePopulation = useBearStore((state) => state.increase);
	return <button onClick={() => increasePopulation(1)}>one up</button>;
}

export default function TestPage() {
	return (
		<div>
			<BearCounter />
			<Controls />
		</div>
	);
}
