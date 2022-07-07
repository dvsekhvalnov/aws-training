const AWS = require('aws-sdk');
const fetch = require('node-fetch');
const express = require('express');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const { query } = require('./services/db');
const { redis } = require('./services/redis');
const { memcached } = require('./services/memcached');
const { signUrl, signCookie, decryptField } = require('./cf');

const config = require('./config');
const s3Routes = require('./s3-routes');
const snsRoutes = require('./sns-routes');
const onHeaders = require('on-headers');
const morgan = require('morgan');

const sqs = require('./sqs');
const kinesis = require('./kinesis');
const { askForFriend } = require('./reqresp');

const port = process.env.PORT || 3000;

const app = express();
app.use(cookieParser());
app.use(express.json({ limit: '50mb', type: ['application/json', 'text/plain'] }));
app.use(express.urlencoded({ extended: true }))

AWS.config.update({ region: config.region });

morgan.token('hostname', function getHostname(req) {
    return req.get('Host');
});

morgan.token('protocol', function getHostname(req) {
    return req.protocol;
});

app.use(morgan(':method :protocol://:hostname:url :status'));
app.use(express.static('public'));

app.get('/test', (req, resp) => {
     console.log(console.dir(req.cookies));
    let cookies = '';

    if (req.cookies) {
        cookies = '<ul>';
        for (const cookieName of Object.keys(req.cookies)) {
            cookies += `<li>${cookieName} = ${req.cookies[cookieName]}</li>`
        }

        cookies += '</ul';
    }

    let html =
    `
        <html>
            <body>
                <h1>Hey AWS</h1>
                <h3>Got some cookies:</h3>
                ${cookies}
            </body>
        </html>
    `;
    resp.send(html);
});

app.get('/booknow', async (req, res) => {
    const url = await signUrl('https://content.premium.excode.pro/van-2.jpg');
    res.redirect(url);
});

app.get('/gopremium', async (_, res) => {
    const cfCookies = await signCookie('https://content.premium.excode.pro/*');
    console.log('cfCookies = ', cfCookies);

    const now = Date.now();

    for (let cookieName in cfCookies) {
        res.cookie(cookieName, cfCookies[cookieName], {
            expires: new Date(now + 24*60*60*1000),
            domain: 'premium.excode.pro'
        });
    }

    res.header('Access-Control-Allow-Origin', '*');
    res.redirect('/premium.html');
});

app.post('/startbooking', async (req, res) => {
    const { fullName, email, size } = req.body;

    const n = await decryptField(fullName);
    const m = await decryptField(email);
    const s = await decryptField(size);

    console.log("Starting to book for: %s, email: %s, group: %s", n, m, s);

    res.redirect('/gopremium');
});

app.get('/session', (req, resp) =>  {
    let now = Date.now();
    resp.cookie('express-aws', now, { expires: new Date(now + 900000) });
    resp.send("opened session");
});

app.get('/state', (req, resp) =>  {
    fs.readFile("./img.txt", "utf8", (_, data) => {
        resp.cookie('express-aws', data, { expires: new Date(Date.now() + 900000) });
        resp.send("opened stateful session");
    });
});

app.get('/logout', (req, res) => {
    res.clearCookie('express-aws');
    res.send('App cookies cleared');
});

app.get('/myfriend', async (req, res) => {
    const friend = await askForFriend();

    res.json(friend);
});

app.get('/whoami', (req, res) => {
    if('nocache' in req.query) {
        onHeaders(res, function() {
            this.removeHeader('ETag')
        });
    }

    console.log("request");
    return res.json({
        now: Date.now(),
        host: req.hostname,
        port: req.port,
        path: req.path,
        url: req.originalUrl,
        headers: req.headers,
        query: req.query
    });
});

app.get('/v2/metadata', (_, resp) => {
    resp.json({
        "Cluster": "ecs-eu-central-demoec2",
        "TaskARN": "arn:aws:ecs:eu-central-1:123331553797:task/ecs-eu-central-demoec2/8c5ccf71f0b748bfa2b4a7381adfe256",
        "Family": "NginxAlpine",
        "Revision": "2",
        "DesiredStatus": "RUNNING",
        "KnownStatus": "RUNNING",
        "Containers": [
            {
                "DockerId": "3c0e6260d9fbc6d4e1a70d87cc97d118654cd86af0edca76be84a675d96a49f1",
                "Name": "nginx-alpine",
                "DockerName": "ecs-NginxAlpine-2-nginx-alpine-bc95add6f3f8a99e1300",
                "Image": "nginx:alpine",
                "ImageID": "sha256:b1c3acb28882519cf6d3a4d7fe2b21d0ae20bde9cfd2c08a7de057f8cfccff15",
                "Labels": {
                    "com.amazonaws.ecs.cluster": "ecs-eu-central-demoec2",
                    "com.amazonaws.ecs.container-name": "nginx-alpine",
                    "com.amazonaws.ecs.task-arn": "arn:aws:ecs:eu-central-1:123331553797:task/ecs-eu-central-demoec2/8c5ccf71f0b748bfa2b4a7381adfe256",
                    "com.amazonaws.ecs.task-definition-family": "NginxAlpine",
                    "com.amazonaws.ecs.task-definition-version": "2"
                },
                "DesiredStatus": "RUNNING",
                "KnownStatus": "RUNNING",
                "Limits": {
                    "CPU": 2,
                    "Memory": 0
                },
                "CreatedAt": "2022-06-17T12:54:27.251043208Z",
                "StartedAt": "2022-06-17T12:54:28.187029014Z",
                "Type": "NORMAL",
                "Networks": [
                    {
                        "NetworkMode": "awsvpc",
                        "IPv4Addresses": [
                            "172.31.32.10"
                        ]
                    }
                ]
            },
            {
                "DockerId": "7a8fb9de8474fa566427848691d4180fad1e8c8608e9467c84bb6188bc4acf15",
                "Name": "~internal~ecs~pause",
                "DockerName": "ecs-NginxAlpine-2-internalecspause-a4d6a4eeb3aa99e1b401",
                "Image": "amazon/amazon-ecs-pause:0.1.0",
                "ImageID": "",
                "Labels": {
                    "com.amazonaws.ecs.cluster": "ecs-eu-central-demoec2",
                    "com.amazonaws.ecs.container-name": "~internal~ecs~pause",
                    "com.amazonaws.ecs.task-arn": "arn:aws:ecs:eu-central-1:123331553797:task/ecs-eu-central-demoec2/8c5ccf71f0b748bfa2b4a7381adfe256",
                    "com.amazonaws.ecs.task-definition-family": "NginxAlpine",
                    "com.amazonaws.ecs.task-definition-version": "2"
                },
                "DesiredStatus": "RESOURCES_PROVISIONED",
                "KnownStatus": "RESOURCES_PROVISIONED",
                "Limits": {
                    "CPU": 2,
                    "Memory": 0
                },
                "CreatedAt": "2022-06-17T12:54:24.845019644Z",
                "StartedAt": "2022-06-17T12:54:25.793658658Z",
                "Type": "CNI_PAUSE",
                "Networks": [
                    {
                        "NetworkMode": "awsvpc",
                        "IPv4Addresses": [
                            "172.31.32.10"
                        ]
                    }
                ]
            }
        ],
        "Limits": {
            "CPU": 0.25,
            "Memory": 512
        },
        "PullStartedAt": "2022-06-17T12:54:25.958086407Z",
        "PullStoppedAt": "2022-06-17T12:54:27.23614346Z",
        "AvailabilityZone": "eu-central-1b"
    });
});

app.get('/taskhealth', async (_, resp) => {
    const res = await fetch('http://169.254.170.2/v2/metadata');
    // const res = await fetch('http://localhost:3000/v2/metadata');
    const metadata = await res.json();

    const normalContainers = metadata.Containers.filter(container => container.Type === 'NORMAL');

    resp.json({
        status: metadata.KnownStatus,
        meta: {
            az: metadata.AvailabilityZone,
            ip: normalContainers[0].Networks[0].IPv4Addresses
        }
    });
});

app.get('/health', async (_, resp) => {
    const res = await Promise.all([
        fetch('http://169.254.169.254/latest/meta-data/placement/availability-zone'),
        fetch('http://169.254.169.254/latest/meta-data/instance-id'),
        fetch('http://169.254.169.254/latest/meta-data/public-hostname')
    ]);

    const meta = await Promise.all([res[0].text(), res[1].text(), res[2].text()]);

    resp.json({
        status: "ok",
        meta: {
            az: meta[0],
            id: meta[1],
            hostname: meta[2]
        }
    });
});

app.get('/top10', async (_, res) =>  {
    try {
        const players = await query('SELECT * FROM players order by overall desc limit 10;');
        res.json(players || []);
    }
    catch (error) {
        console.log("Error = ", error);
        res.status(500).json({
            message: error.message
        });
    }


});

app.get('/redis/player/:id', async (req, res) => {
    const { id } = req.params;

    try {

        const cached = await redis.hGetAll(`player:${id}`);
        if (cached && Object.keys(cached).length > 0) {
            return res.json({
                data: cached,
                cache: {
                    hit: true,
                    source: 'redis'
                }
            });
        }

        const player = await query('SELECT * FROM players where player_id=?', [id]);

        if (player && player.length === 1) {
            const pid = `player:${id}`;
            await redis.hSet(pid, player[0]);
            await redis.expire(pid, config.cache.ttl);

            res.json({
                data: player[0],
                cache: {
                    hit: false
                }
            });
        }
        else  {
            res.status(404).json({ message: 'NOT_FOUND' })
        }
    }
    catch (error) {
        console.log("Error = ", error);
        res.status(500).json({
            message: error.message
        });
    }
});

app.get('/memcached/player/:id', async (req, res) => {
    const { id } = req.params;

    try {

        const cached = await memcached.get(`player:${id}`);
        if (cached && cached.value) {
            const data = JSON.parse(cached.value.toString('utf8'));

            return res.json({
                data,
                cache: {
                    hit: true,
                    source: 'memcached'
                }
            });
        }

        const player = await query('SELECT * FROM players where player_id=?', [id]);

        if (player && player.length === 1) {
            const pid = `player:${id}`;
            await memcached.set(pid, JSON.stringify(player), {
                expires: config.cache.ttl
            });

            res.json({
                data: player[0],
                cache: {
                    hit: false
                }
            });
        }
        else  {
            res.status(404).json({ message: 'NOT_FOUND' })
        }
    }
    catch (error) {
        console.log("Error = ", error);
        res.status(500).json({
            message: error.message
        });
    }
});

app.use('/s3', s3Routes);
app.use('/sns', snsRoutes);

app.listen(port, () =>  {
    console.log(`Started on :${port}`);
    console.log(process.env);
});

sqs.start();
console.log('SQS Poller started');

kinesis.start();