const express = require('express');
const bodyParser = require('body-parser');
//const fetch = require('node-fetch');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const CryptoJS = require('crypto-js');
const https = require('https');
const cors = require('cors');



const app = express();
const port = 3000;
app.use(cors());

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', (req,res)=>{
    res.sendFile(__dirname + 'public/index.html');
  })

const agent = new https.Agent({
    rejectUnauthorized: false,
});

app.post('/linktopay', (req, res) => {
    fetch('https://worldtimeapi.org/api/ip', { agent })
        .then(response => response.json())
        .then(data => {
            const timestamp = data.unixtime;
            const app_code = "SANTIAGOTEST-APP-SERVER";
            const app_key = "1dMcgczdFoCzXvNgfgVi49MzJHkm3H";
            const key_time = app_key + timestamp;
            const uniq_token = CryptoJS.SHA256(key_time);
            const str_union = `${app_code};${timestamp};${uniq_token}`;
            const token = Buffer.from(str_union).toString('base64');

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify(req.body),
                redirect: 'follow'
            };

            fetch("https://noccapi-stg.paymentez.com/linktopay/init_order/", requestOptions)
                .then(response => response.json())
                .then(result => {
                    const url = result.data.payment.payment_url;
                    res.redirect(url);
                })
                .catch(error => console.log('error', error));
        })
        .catch(error => {
            console.error('Error al obtener la hora: ', error);
        });
});

app.post('/order', (req, res) => {
    fetch('https://worldtimeapi.org/api/ip', { agent })
        .then(response => response.json())
        .then(data => {
            const timestamp = data.unixtime;
            const app_code = "SANTIAGOTEST-APP-SERVER";
            const app_key = "1dMcgczdFoCzXvNgfgVi49MzJHkm3H";
            const key_time = app_key + timestamp;
            const uniq_token = CryptoJS.SHA256(key_time);
            const str_union = `${app_code};${timestamp};${uniq_token}`;
            const token = Buffer.from(str_union).toString('base64');

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify(req.body),
                redirect: 'follow'
            };

            fetch("https://noccapi-stg.paymentez.com/order/", requestOptions)
                .then(response => response.json())
                .then(result => {
                    const url = result.transaction.bank_url;
                    res.redirect(url);
                })
                .catch(error => console.log('error', error));
        })
        .catch(error => {
            console.error('Error al obtener la hora: ', error);
        });
});

app.post('/checkout', (req, res) => {
    fetch('https://worldtimeapi.org/api/ip', { agent })
        .then(response => response.json())
        .then(data => {
            const timestamp = data.unixtime;
            const app_code = "SANTIAGOTEST-APP-SERVER";
            const app_key = "1dMcgczdFoCzXvNgfgVi49MzJHkm3H";
            const key_time = app_key + timestamp;
            const uniq_token = CryptoJS.SHA256(key_time);
            const str_union = `${app_code};${timestamp};${uniq_token}`;
            const token = Buffer.from(str_union).toString('base64');

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify(req.body),
                redirect: 'follow'
            };

            fetch("https://ccapi-stg.paymentez.com/v2/transaction/init_reference/", requestOptions)
                .then(response => response.json())
                .then(result => {
                    const reference = result.reference;
                    res.json({ reference: reference });
                })
                .catch(error => console.log('error', error));
        })
        .catch(error => {
            console.error('Error al obtener la hora: ', error);
        });
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
