const MangoDct = require('../');
const app = require('express')();

const dct = new MangoDct();

const webhook1 = dct.createWebhook('/mango-dct/webhook1');

webhook1.hear({ callType: 1 }, e => console.log('just callType 1', e));
webhook1.hear({ callType: 1, duration: '10' }, e => console.log('callType:1, duration:10', e));

app.use(webhook1.handler);
app.use((req, res) => res.status(404).send({ error: 'not found' }));
app.listen(8080);
