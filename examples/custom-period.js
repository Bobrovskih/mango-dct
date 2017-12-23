const MangoDct = require('../src/index');

let DCT = new MangoDct();

async function main() {
    let parameters, calls;

    parameters = {
        dateStart: '2017-06-01T00:00Z',
        dateEnd: '2017-06-30T00:00Z',

        callType: '1',
        isNew: '1',
        isQuality: '1'
    };

    calls = await DCT.calls(parameters).catch(err => console.log(err.message));
    console.log('выгруженные звонки', calls);
}

main();
