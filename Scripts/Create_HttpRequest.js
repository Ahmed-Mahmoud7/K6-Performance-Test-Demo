import http from 'k6/http';


export default function () {
    let URL = 'https://test-api.k6.io';
    const res = http.get(URL);
    console.log(res.status)
}