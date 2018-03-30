const MangoDct = require('../');

const dct = new MangoDct();

async function main() {
	const parameters = {
		dateStart: '2017-06-01T00:00Z',
		dateEnd: '2017-06-30T00:00Z',

		callType: '1',
		isNew: '1',
		isQuality: '1'
	};

	const calls = await dct.calls(parameters);
	console.log('выгруженные звонки', calls);
}

main().catch(console.log);
