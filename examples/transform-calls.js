const MangoDct = require('../src/mango-dct');

const dct = new MangoDct();
dct.transform({ callStatus: true });

async function main() {
	const parameters = {
		dateStart: '2017-07-01T00:00Z',
		dateEnd: '2017-07-30T00:00Z'
	};

	const calls = await dct.calls(parameters).catch(err => console.log(err.message));
	console.log('выгруженные звонки', calls);
}

main();
