import http from 'k6/http';
import {check} from 'k6';

export default function () {
    let BASE_URL = "https://test-api.k6.io";
    let EndPoint = "/public/crocodiles/" ; 
    let CrocId = 7;
    let res = http.get(BASE_URL + EndPoint);

  //  res = http.get(BASE_URL + EndPoint + CrocId);
    res = http.get(`https://test-api.k6.io/public/crocodiles/${CrocId}/`);

    console.log(res.json().name);

    check(res, {
        'status is 200': (r) => r.status === 200,
        'Crocodile is Sobek': (r) => r.json().name === 'Sobek'
    });

}