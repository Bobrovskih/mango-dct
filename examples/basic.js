const MangoDct = require('../');

const dct = new MangoDct();

async function main() {
	const parameters = {
		lastDays: 31,
		utmSource: 'yandex.ru',
		utmMedium: 'cpc',
		utmCampaign: 'skidka50'
	};

	const calls = await dct.calls(parameters);
	console.log('выгруженные звонки', calls);
}

main().catch(console.log);
