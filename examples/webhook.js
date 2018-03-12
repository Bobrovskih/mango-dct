const MangoDct = require('../');
const app = require('express')();

const dct = new MangoDct();

const webhook1 = dct.createWebhook('/mango-dct/webhook1');
const webhook2 = dct.createWebhook('/mango-dct/webhook2');
const webhook3 = dct.createWebhook('/mango-dct/webhook3');

webhook1.on('data', e => console.log('on webhook1', e));
webhook2.on('data', e => console.log('on webhook2', e));
webhook3.on('data', e => console.log('on webhook3', e));

dct.allHooks.on('data', e => console.log('on any webhook', e));

app.use(webhook1.handler);
app.use(webhook2.handler);
app.use(webhook3.handler);

app.use((req, res) => res.status(404).send({ error: 'not found' }));
app.listen(8080);
