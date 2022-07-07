import { decryptField } from './cf.js';

// import {
//     RawRsaKeyringNode,
//     buildClient,
//     CommitmentPolicy,
// } from '@aws-crypto/client-node'

// import fs from 'fs'

// const { encrypt, decrypt } = buildClient(
//     CommitmentPolicy.FORBID_ENCRYPT_ALLOW_DECRYPT
// );

// const keyName = 'dvpro-private-pubkey';
// const keyNamespace = 'expressdemoapp';
// const privateKey = fs.readFileSync('./keys/private_key.pem');
// const publicKey = fs.readFileSync('./keys/public_key.pem');

// const rsaKey = { privateKey, publicKey };

// const keyring = new RawRsaKeyringNode({
//     keyName,
//     keyNamespace,
//     rsaKey,
//     oaepHash: 'sha256'
// });

// const { result } = await encrypt(keyring, 'hey world', {
//     encryptionContext: {
//         stage: 'demo',
//         purpose: 'simple demonstration app',
//         origin: 'us-west-2',
//     },
// })

// console.log("result = ", result.toString('base64'));


const ciphertext = `AYABeGOMXiXDpgxXUS5FIpxDe7kAAAABAA5leHByZXNzZGVtb2FwcAAUZHZwcm8tcHJpdmF0ZS1wdWJrZXkBAINvYJ3BQwr6odi9vhwRC5/sOetgtHUsoA
t2s86ILSWYlZhgLzxTGL5+f0xPMKpmcFVu+yOYvYWNlYPIJMBgt3N6CAqW0YkpimggMR+tKYJytfYj1qliZzV6n6F5TeIqsdPy4oJUJDyXHQVjHR51w/pDnAMqZGO0Z4zpAmuoi/uVVHsQ+Vc/NcA+q
T42wN/9iPLTWHb9N+Z4fGXIErkqcgzM64b1/3SON/CFtLepl0AJzGACGWeYTxzjZVrmZxQHLjJmdkrUOU6l1iaKnKORwQDiO4Ews7hX7HgKblIxsqy7LW8axZxwzdX+bal1nC/af5h9fPiUe/UF1D+g
pzpGjSYCAAAAAAwAABAAAAAAAAAAAAAAAAAAF/wrntubownT1Vl+yRAzyf////8AAAABAAAAAAAAAAAAAAABAAAAAvTLQ9C9c/DtTB20pgFNCjI/ug==`;

// const { plaintext, messageHeader } = await decrypt(keyring, Buffer.from(ciphertext, 'base64'));
// const { plaintext, messageHeader } = await decrypt(keyring, result);

console.log("fullName = ", await decryptField(`AYABeGOMXiXDpgxXUS5FIpxDe7kAAAABAA5leHByZXNzZGVtb2FwcAAUZHZwcm8tcHJpdmF0ZS1wdWJrZXkBAINvYJ3BQwr6odi9vhwRC5/sOetgtHUsoA
t2s86ILSWYlZhgLzxTGL5+f0xPMKpmcFVu+yOYvYWNlYPIJMBgt3N6CAqW0YkpimggMR+tKYJytfYj1qliZzV6n6F5TeIqsdPy4oJUJDyXHQVjHR51w/pDnAMqZGO0Z4zpAmuoi/uVVHsQ+Vc/NcA+q
T42wN/9iPLTWHb9N+Z4fGXIErkqcgzM64b1/3SON/CFtLepl0AJzGACGWeYTxzjZVrmZxQHLjJmdkrUOU6l1iaKnKORwQDiO4Ews7hX7HgKblIxsqy7LW8axZxwzdX+bal1nC/af5h9fPiUe/UF1D+g
pzpGjSYCAAAAAAwAABAAAAAAAAAAAAAAAAAAF/wrntubownT1Vl+yRAzyf////8AAAABAAAAAAAAAAAAAAABAAAAAvTLQ9C9c/DtTB20pgFNCjI/ug==`));

console.log("email = ", await decryptField(`AYABeP9gM7rSDGaPBVATOr8WQN
AAAAABAA5leHByZXNzZGVtb2FwcAAUZHZwcm8tcHJpdmF0ZS1wdWJrZXkBAJpNeUNe+r4Bwvzfs4xmPl6s2ewl1fozSEGV9CF0kMNdOkES36alJvAX+Bz/ZrQMI/zlI/YDqIhQSMksNducB0kVI18lS
6K7I2fduTWKviRRvxO2C3eeJ09XwyRGyIP1eMJ+5gPP66dJAnehZUXzhSEvqibm6A4c9mX1QZvayBn3L347B5BLvI2NYCLu6n7eGM9jzO42+De7jYtR+Ccufo1as5sAnYvAhwYa2XWeSKLbYsEY6jAL
tcgyUchN+DiXWl1iWgt84RWwNRyHQ3stvFY8OKpqxL5V/wyn7ZSEjsku/okQ/Pb3Wq6uEt6nj5LQgFDrt/NLirWa+NflPBtcPtICAAAAAAwAABAAAAAAAAAAAAAAAAAATEPsUBtJDHtOs/oQXPIqA//
///8AAAABAAAAAAAAAAAAAAABAAAACUg6C0IBv1sA35KwkhjhjQbmbZNqyBTBZrM=`));

console.log("email = ", await decryptField(`AYABeLI2PAPLc4PrxRiiZxbJc/YAAAABAA5leHByZXNzZGVtb2FwcAAUZHZwcm8tcHJpdmF0ZS1wd
WJrZXkBABmc4IrQMQmyqOhK5z9nyAw2L3IOuK3I9UjwToKUvRnJEdUXqCxErko5gWZb2AUcK9IPMC1K5PZ5H2W7kQWF2TYV8glMcyi0MRS8GWYCXbykYUpKZ71bW40H8sXN3CvAoDpbcYaqTTbJlbHI
JaIJO9hmnMcTUTm6icjkcq1pnVoCHygCGnD5A38lwmVN9uHLGCTuT2xztUj8Ela///fD0Zl9UVXyYB6oyZ8oJ0sH/rIuQfW6fl3PnpWla3t4tum5Zupm2QWCsrh0TUL8czrxRiqN3R50pIp8/hbz98g
f8gTr/j23Jit8pB+zdgM4ntFhLU5lI8AX7ddIcbecFDpRppsCAAAAAAwAABAAAAAAAAAAAAAAAAAABJJRZnvb9gAEqUVfRexehv////8AAAABAAAAAAAAAAAAAAABAAAABTlCPxEH/Qufc1Q7U60wgu
C3QFOw+g==`));
