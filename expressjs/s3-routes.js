const express = require('express');
const { S3Client, SelectObjectContentCommand, ListObjectsCommand, PutObjectCommand, GetObjectCommand, HeadObjectCommand, GetObjectTaggingCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const cfg = require('./config');
const multer = require('multer');

const uploads = multer();
const s3 = new S3Client(cfg.s3);

const router = express.Router();

const key256Bit = Buffer.from('QHOrAB5PZqfzey8MXhhJsp9aS+T0YWzH4CDTPNarwEU=', 'base64');
const key256BitMd5 = Buffer.from('lP7DEk034RUbswesDfPoag==', 'base64');

router.get('/list/:prefix', async (req, res) => {
    const response = await s3.send(new ListObjectsCommand({
        Bucket: cfg.s3.bucket,
        Prefix: req.params.prefix
    }));

    const catalog = [];

    for (const obj of response.Contents) {
        catalog.push(obj.Key);
    }

    return res.json(catalog);
});

router.post('/upload/:key*', uploads.single('object'), async (req, res) => {
    const key = req.params.key + req.params[0];

    const uploadResponse = await s3.send(new PutObjectCommand({
        Body: req.file.buffer,
        Bucket: cfg.s3.bucket,
        Key: key,
        ContentType: 'image/jpeg',
        SSECustomerAlgorithm: 'AES256',
        SSECustomerKey: key256Bit,
        SSECustomerKeyMD5: key256BitMd5
    }));

    return res.json({
        status: "ok"
    });
});

router.post('/presign/:key*', async (req, res) => {
    const key = req.params.key + req.params[0];

    const url = await getSignedUrl(s3, new GetObjectCommand({
        Bucket: cfg.s3.bucket,
        Key: key,
        SSECustomerAlgorithm: 'AES256',
        SSECustomerKey: key256Bit,
        SSECustomerKeyMD5: key256BitMd5
    }),
    { expiresIn: 3600 });

    return res.json({
        status: "ok",
        url
    });

});

router.get('/metadata/:key*', async (req, res) => {
    const key = req.params.key + req.params[0];

    const response = await s3.send(new HeadObjectCommand({
        Bucket: cfg.s3.bucket,
        Key: key
    }));

    return res.json({
        response
    });
});

router.get('/tags/:key*', async (req, res) => {
    const key = req.params.key + req.params[0];

    const response = await s3.send(new GetObjectTaggingCommand({
        Bucket: cfg.s3.bucket,
        Key: key
    }));

    return res.json({
        response
    });
});

router.get('/select', async (req, res) => {
    const sql = req.query.query;

    const params = {
        Bucket: 'dvpro.analytics',
        Key: 'star-wars-fictional-locations.json',
        ExpressionType: 'SQL',
        Expression: sql,
        InputSerialization: {
            JSON: {
                Type: 'Document'
            }
        },
        OutputSerialization: {
            JSON: {
                RecordDelimiter: '\n'
            }
        }
    };

    const command = new SelectObjectContentCommand(params);
    const response = await s3.send(command);
    // const response = await s3.selectObjectContent(params);

    const events = response.Payload;

    for await (const event of events) {
        if (event.Records) {
            // event.Records.Payload is a buffer containing
            // a single record, partial records, or multiple records
            res.write(new TextDecoder().decode(event.Records.Payload));
        } else if (event.Stats) {
            console.log(`Processed ${event.Stats.Details.BytesProcessed} bytes`);
        } else if (event.End) {
            console.log('SelectObjectContent completed');
        }
    }

    res.end();
});

router.delete('/delete/:bucket/:key*', async (req, res) => {
    const key = req.params.key + req.params[0];
    const bucket = req.params.bucket;

    const response = await s3.send(new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
        VersionId: 'Eq2cf22K8HJcQX.mC6bPt.whD6KkkPAo',
        // BypassGovernanceRetention: true
    }));

    return res.json({
        response
    });
});

module.exports = router;