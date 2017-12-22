const MangoDct = require('../src/index');

const token = process.env.token;
const wid = process.env.wid;

const DCT = new MangoDct(token, wid);

async function main(){
    let parameters = {
        dateStart: '2017-06-01T00:00Z',
        dateEnd: '2017-06-30T00:00Z'
    };
    let calls = await DCT.calls(parameters).catch(err => console.log(err));
    console.log('выгруженные звонки', calls);
}

main();
