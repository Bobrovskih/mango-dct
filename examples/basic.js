const MangoDct = require('../');

const dct = new MangoDct();

async function main() {
	const parameters = {
		lastDays: 31,
		utmSource: 'yandex.ru',
		utmMedium: 'cpc',
		utmCampaign: 'skidka50'
	};

	const calls = await dct.calls(parameters).catch(err => console.log(err.message));
	console.log('выгруженные звонки', calls);
}

main();
