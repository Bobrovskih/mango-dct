const MangoDct = require('../index');
const app = require('express')();
const dct = new MangoDct();

const webhook1 = dct.webhooks.create('/mango-dct/webhook');
const webhook2 = dct.webhooks.create('/mango-dct/webhook2');
const webhook3 = dct.webhooks.create('/cheza');


// dct.webhook.on('data', params => console.log('dct on 1', params));
// dct.webhook.on('data', params => console.log('dct on 2', params));

webhook1.on('data', params => console.log('webhook1 on', params));

app.use(webhook1);
app.use(webhook2);
app.use(webhook3);


app.use((req, res) => res.send({ success: true }));
app.listen(8080);
