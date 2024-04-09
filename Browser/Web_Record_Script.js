import {sleep, group} from 'k6'
import http from 'k6/http'

export const options = {
    ext: {
        loadimpact: {
            projectID: 3690533
        }
    },
    thresholds: {},
    scenarios: {
        Scenario_1: {
            executor: 'ramping-vus',
            gracefulStop: '30s',
            stages: [
                {target: 20, duration: '1m'},
                {target: 20, duration: '3m30s'},
                {target: 0, duration: '1m'},
            ],
            gracefulRampDown: '30s',
            exec: 'scenario_1',
        },
    },
}

export function scenario_1() {
    let response

    const vars = {}

    group('page_1 - https://test.k6.io/my_messages.php', function () {
        response = http.get('https://test.k6.io/my_messages.php', {
            headers: {
                'upgrade-insecure-requests': '1',
                'sec-ch-ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
            },
        })

        vars['redir'] = response.html().find('input[name=redir]').first().attr('value')

        vars['csrftoken'] = response.html().find('input[name=csrftoken]').first().attr('value')

        sleep(12.7)
    })

    group('page_2 - https://test.k6.io/login.php', function () {
        response = http.post(
            'https://test.k6.io/login.php',
            {
                redir: `${vars['redir']}`,
                csrftoken: `${vars['csrftoken']}`,
                login: 'admin',
                password: '123',
            },
            {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    origin: 'https://test.k6.io',
                    'upgrade-insecure-requests': '1',
                    'sec-ch-ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"macOS"',
                },
            }
        )

        vars['redir2'] = response.html().find('input[name=redir]').first().attr('value')

        vars['csrftoken2'] = response.html().find('input[name=csrftoken]').first().attr('value')

        sleep(5.1)
    })

    group('page_3 - https://test.k6.io/login.php', function () {
        response = http.post(
            'https://test.k6.io/login.php',
            {
                redir: `${vars['redir2']}`,
                csrftoken: `${vars['csrftoken2']}`,
            },
            {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    origin: 'https://test.k6.io',
                    'upgrade-insecure-requests': '1',
                    'sec-ch-ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"macOS"',
                },
            }
        )
    })
}
