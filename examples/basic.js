const MangoDct = require('../src/index');

let DCT = new MangoDct();

async function main() {
    let parameters, calls;

    parameters = {
        lastDays: 31,
        utmSource: 'yandex.ru',
        utmMedium: 'cpc',
        utmCampaign: 'skidka50'
    };

    calls = await DCT.calls(parameters).catch(err => console.log(err.message));
    console.log('выгруженные звонки', calls);
}

main();
