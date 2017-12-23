## Библиотека для API  динамического коллтрекинга от MANGO OFFICE

### Установка
`npm install mango-dct`


### Требования
NodeJS версии 8 или более

### Токен
Токен можно задать через переменную `process.env.token`</br>
Или передать первый аргумент в конструктор 
`new MangoDct('your-token-here', 'your-widget-id');`

### ID виджета
ID виджета можно задать через переменную `process.env.wid`</br>
Или передать второй аргумент в конструктор 
`new MangoDct('your-token-here', 'your-widget-id');`

### Пример использования


```javascript
const MangoDct = require('mango-dct');
const dct = new MangoDct();

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
```


## класс MangoDct
Создание нового экземпляра
```javascript
new MangoDct('your-token-here', 'your-widget-id');
```

| Аргумент  | Тип  | Описание|
| ------------ | ------------ |------------ |
| token  | String   |  Токен  |
| wid  | String   |  id виджета  |

### Метод calls

```js
MangoDct.calls({lastDays:'31', utmSource:'yandex.ru'}); // => Promise<any[]>
```

| Аргумент  | Тип  | Описание|
| ------------ | ------------ |------------ |
| options  | Object   |  Объект содержит фильтры выгрузки  |





