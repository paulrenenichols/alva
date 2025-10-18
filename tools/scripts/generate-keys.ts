import { generateKeyPairSync } from 'crypto';
import { writeFileSync } from 'fs';

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
});

console.log('Generated JWT key pair:');
console.log('\n--- PUBLIC KEY ---');
console.log(publicKey);
console.log('\n--- PRIVATE KEY ---');
console.log(privateKey);

// Save to .env.example files
const publicKeyForEnv = publicKey.replace(/\n/g, '\\n');
const privateKeyForEnv = privateKey.replace(/\n/g, '\\n');

console.log('\n--- FOR .env FILES ---');
console.log(`JWT_PUBLIC_KEY=${publicKeyForEnv}`);
console.log(`JWT_PRIVATE_KEY=${privateKeyForEnv}`);
