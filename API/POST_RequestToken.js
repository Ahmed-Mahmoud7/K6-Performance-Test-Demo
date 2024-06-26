import http from 'k6/http';

export default function () {

    const body = JSON.stringify({
        username: 'test_' + Date.now(),
        password: 'test'
    });

    const params = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    http.post('https://test-api.k6.io/user/register/', body, params);

    let res = http.post(
        'https://test-api.k6.io/auth/token/login/',
        JSON.stringify(
            {
                username: 'test_73725293736225',
                password: 'test'
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
}