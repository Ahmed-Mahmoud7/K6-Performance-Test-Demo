import http from 'k6/http';
import {check} from 'k6';
import {htmlReport} from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import {textSummary} from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

// This will export to HTML as filename "result.html" AND also stdout using the text summary


export function handleSummary(data) {
    return {
        "result.html": htmlReport(data),
        stdout: textSummary(data, {indent: " ", enableColors: true}),
    };
}

export default function () {

    const credentials = {
        username: 'test_' + Date.now(),
        password: 'secret_' + Date.now(),
    }

    http.post(
        'https://test-api.k6.io/user/register/',
        JSON.stringify(credentials),
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    let res = http.post(
        'https://test-api.k6.io/auth/token/login/',
        JSON.stringify(
            {
                username: credentials.username,
                password: credentials.password
            }
        ),
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    const accessToken = res.json().access;
    console.log(accessToken);

    http.get(
        'https://test-api.k6.io/my/crocodiles/',
        {
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        }
    );

    res = http.post(
        'https://test-api.k6.io/my/crocodiles/',
        JSON.stringify(
            {
                name: 'Random croc',
                sex: 'M',
                date_of_birth: '1900-10-28'
            }
        ),
        {
            headers: {
                Authorization: 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            }
        }
    );
    const newCrocodileId = res.json().id;

    res = http.get(
        `https://test-api.k6.io/my/crocodiles/${newCrocodileId}/`,
        {
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        }
    );

    check(res, {
        'status is 200': (r) => r.status === 200,
        'crocodile id': (r) => r.json().id === newCrocodileId
    });

    res = http.put(
        `https://test-api.k6.io/my/crocodiles/${newCrocodileId}/`,
        JSON.stringify(
            {
                name: 'Updated Random croc',
                sex: 'M',
                date_of_birth: '1900-10-28'
            }
        ),
        {
            headers: {
                Authorization: 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            }
        }
    );

}