const MangoDct = require('../src/index');

let dct = new MangoDct();

async function main() {
    let parameters, calls;

    parameters = {
        lastDays: 31,
        utmSource: 'yandex.ru',
        utmMedium: 'cpc',
        utmCampaign: 'skidka50'
    };

    calls = await dct.calls(parameters).catch(err => console.log(err.message));
    console.log('выгруженные звонки', calls);
}

main();
