import http from 'k6/http';
import {check} from 'k6';


export default function () {
    let URL = 'https://test-api.k6.io';
    let pageTitle = 'Collection of HTTP and WebSocket APIs for experimentation with k6';
    const res = http.get(URL);
    console.log(res.status)
    check(res, {
        'status is 200': (r) => r.status === 200,
        'page is startpage': (r) => r.body.includes(pageTitle)
    });
}