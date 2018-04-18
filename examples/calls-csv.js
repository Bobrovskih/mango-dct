const MangoDct = require('../');

const dct = new MangoDct();

async function main() {
	const parameters = {
		lastDays: 31,
		csv: 'C:/_/mango-dct/downloads/report.csv',
	};

	const calls = await dct.calls(parameters);
	console.log('выгруженные звонки', calls);
}

main().catch(console.log);
