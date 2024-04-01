import http from 'k6/http';


export default function () {
    let URL = 'https://test-api.k6.io';
    let pageTitle = 'Collection of HTTP and WebSocket APIs for experimentation with k6';
    const res = http.get(URL);
    console.log(res.status)
}