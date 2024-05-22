let appLogPath="./test/reports/app.log"
import '@babel/register';
import dotenv from "dotenv";
dotenv.config();
 
import logger, { constructor } from 'auto-helper-module/logger.js';
//Use this when you are using M92
import { encrypt,decrypt } from 'auto-helper-module/encryptdecrypt.js';
//Use this when you are using AM92
import { encrypt,decrypt,getCryptoEncryptionKey } from 'auto-helper-util-module/encryptdecrypt.mjs';
constructor({ level: "info" , path: appLogPath})
import commonFun from 'auto-helper-module/common.js';
import consolePrompt from 'auto-helper-module/consoleInput.js';
import properties from 'auto-helper-module/propertiesHandler.js';
import { generate } from "randomstring";
 
let ENV = process.env.ENV
let apiBaseUrl=''
 
let apiHandShakeUrl=''
let apiIsEncryptionRequired = false;
let X_API_KEY =''
let apiIsEncryptionMethodAM92 = false;
 
if(ENV == 'dev'){
  X_API_KEY = process.env.X_API_KEY_DEV;
  apiHandShakeUrl=process.env.API_HANDSHAKE_URL_DEV;
  apiBaseUrl=process.env.API_BASE_URL_DEV;
  apiIsEncryptionRequired = process.env.Encryption_Required_DEV;
  apiIsEncryptionMethodAM92 = process.env.IsEncryptionMethod_AM92_DEV;
}
// Add else if conditions for other environments and assign value on basis on .env
 
let testDataPropertiesPath  = "./test/fixtures/data-env.properties".replace('env', ENV);
let testDataFilePath="./test/fixtures/api-testdata-projectName-env.xlsx".replace('env', ENV);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
 
import { setDefaultTimeout } from '@cucumber/cucumber';
import { config } from 'chai';
setDefaultTimeout(120 * 1000);
 
// Generate random string for any key to be passed in API
function getRandomString(fieldName)
  {
    let randomString = ''
    if(fieldName == '')
    {  
      randomString =  generate({
        length: 14,
        charset: 'alphanumeric'
      })
    }
    return randomString;
  }
 
// Export all the constants to be used in other files  
const _apiHandShakeUrl = apiHandShakeUrl;
export { _apiHandShakeUrl as apiHandShakeUrl };
const _apiBaseUrl = apiBaseUrl;
export { _apiBaseUrl as apiBaseUrl };
const _apiIsEncryptionRequired = apiIsEncryptionRequired;
export { _apiIsEncryptionRequired as apiIsEncryptionRequired };
const _apiIsEncryptionMethodAM92 = apiIsEncryptionMethodAM92;
export { _apiIsEncryptionMethodAM92 as apiIsEncryptionMethodAM92 };
const _X_API_KEY = X_API_KEY;
export { _X_API_KEY as X_API_KEY };
const _appLogPath = appLogPath;
export { _appLogPath as appLogPath };
const _logger = logger;
export { _logger as logger };
const _encrypt = encrypt;
export { _encrypt as encrypt };
const _decrypt = decrypt;
export { _decrypt as decrypt };
const _testDataFilePath = testDataFilePath;
export { _testDataFilePath as testDataFilePath };
const _commonFun = commonFun;
export { _commonFun as commonFun };
const _ENV = ENV;
export { _ENV as ENV };
const _getRandomString = getRandomString;
export { _getRandomString as getRandomString };
const _consolePrompt = consolePrompt;
export { _consolePrompt as consolePrompt };
const _properties = properties;
export { _properties as properties };
const _testDataPropertiesPath = testDataPropertiesPath;
export { _testDataPropertiesPath as testDataPropertiesPath };
// Use this when you are using AM92
const _getCryptoEncryptionKey = getCryptoEncryptionKey;
export { _getCryptoEncryptionKey as getCryptoEncryptionKey };