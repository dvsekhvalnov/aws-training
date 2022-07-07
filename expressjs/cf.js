const aws = require('aws-sdk');
const { cloudfront } = require('./config');
const fs = require('fs').promises;

const {
    RawRsaKeyringNode,
    buildClient,
    CommitmentPolicy,
} = require('@aws-crypto/client-node');

async function decryptField(ciphertext) {
    const privateKey = await fs.readFile('./keys/private_key.pem');
    const publicKey = await fs.readFile('./keys/public_key.pem');

    const { encrypt, decrypt } = buildClient(
        CommitmentPolicy.FORBID_ENCRYPT_ALLOW_DECRYPT
    );

    const rsaKey = { privateKey, publicKey };
    const keyName = 'dvpro-private-pubkey';
    const keyNamespace = 'expressdemoapp';

    const keyring = new RawRsaKeyringNode({
        keyName,
        keyNamespace,
        rsaKey,
        oaepHash: 'sha256'
    });

    const { plaintext } = await decrypt(keyring, Buffer.from(ciphertext, 'base64'));

    return plaintext.toString();
}

async function signCookie(url) {
    const privateKey = await fs.readFile('./keys/private_key.pem');
    const signer = new aws.CloudFront.Signer(cloudfront.keyId, privateKey.toString());

    const fiveMin = 5*60*1000;

    const policy = {
        "Statement": [
            {
                "Resource": url,
                "Condition": {
                    "DateLessThan": {
                        "AWS:EpochTime": Math.floor((Date.now() + fiveMin) / 1000)
                    }
                    // "IpAddress": {
                    //     "AWS:SourceIp": "5.180.208.129"
                    // }
                }
            }
        ]
    };

    // sign a CloudFront cookie that expires 5 mins from now, canned policy
    return signer.getSignedCookie({
        policy: JSON.stringify(policy)
        // url,
        // expires: Math.floor((Date.now() + fiveMin) / 1000),
    });
}

async function signUrl(url) {
    const privateKey = await fs.readFile('./keys/private_key.pem');
    const signer = new aws.CloudFront.Signer(cloudfront.keyId, privateKey.toString());

    const twoMin = 120000;

    // sign a CloudFront URL that expires 2 mins from now, canned policy
    return signer.getSignedUrl({
        url,
        expires: Math.floor((Date.now() + twoMin)/1000),
    });

}

module.exports = { signUrl, signCookie, decryptField };