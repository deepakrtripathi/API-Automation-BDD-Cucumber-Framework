import { ENV as _ENV,  logger, properties, testDataPropertiesPath as _testDataPropertiesPath,getRandomString  } from '../../config.mjs';
import { setMetaInfo, getMetaInfo } from '../features/step_definitions/hooks.mjs';
// Use this when you are using AM92
import {getCryptoEncryptionKey} from '../../config.mjs';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const env = _ENV
const testDataPropertiesPath = _testDataPropertiesPath
 
 
// Common method to log api request response after execution
export async function logResponses(url, payload, actResBody, response, token, key) {
    logger.info("ENVIRONMENT=>" + env + "\n");
    logger.info(url + " ===>REQUEST PAYLOAD===> \n" + JSON.stringify(payload));
    logger.info(url + " ===>RESPONSE STATUS===> \n" + response.status);
    logger.info(url + " ===>RESPONSE BODY===> \n" + JSON.stringify(actResBody));
    logger.info("\n\n\n");
 
    await setMetaInfoValues(url, payload, actResBody, response);
}
 
// this method stores the response body and staus for verification in the then block and logging
export async function setMetaInfoValues(url, payload, actResBody, response) {
    //For the Then verification and logging
    setMetaInfo("actResBody", JSON.parse(JSON.stringify(actResBody)));
 
    //For loggiging into the report
    setMetaInfo("url", url);
    setMetaInfo("requestPayload", payload);
}
 
// Fetch value from API Reponse and store in meta info for further use
export async function extractValueFromResponses(testData, actResBody, testDataKey) {
    if (testData.endPoint.includes('') && testData.method == 'POST')
        setMetaInfo("", actResBody['data']['']);  
}
 
// timeout for API to be executed
export function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
 
// set expected response in metainfo
export async function setExpectedResponseInfo(testData)
{
    setMetaInfo("expResBody", testData.expResBody);
    setMetaInfo("expResCode", testData.expResCode);
 
}
 
// Use this method to set encryption key when you use AM92
export async function setEncryptionKeys(publicKey)
{
    let cryptoEncryptionKey = getCryptoEncryptionKey(publicKey)
    setMetaInfo("encryptionKey", cryptoEncryptionKey.encryptionKey);
    setMetaInfo("cryptoKey", cryptoEncryptionKey.cryptoKey);
    logger.info(cryptoEncryptionKey.encryptionKey);
}
 
// This method will update pay load values before passing to api. You can add your variable name in between {} to replace it  
export async function updatePayloadValues(testData) {
    if (JSON.stringify(testData.reqBody).includes("{}"))
        testData.reqBody = JSON.parse(JSON.stringify(testData.reqBody).replace(/{}/g, getMetaInfo().get("")));
   
    return testData;
}
 
//check and replace API endpoint
export async function updateAPIEndpoint(testData, testDataKey) {
    let endpoint = testData.endPoint;
 
    if (endpoint.includes('{}')) {
        endpoint = endpoint.replace("{}", getMetaInfo().get(""));
    }
   
    return endpoint;
 
}
 
// Replace pay load values by property value from properties file
export async function replacePropertiesInPayload(payload)
{
    let stringifiedPayload = JSON.stringify(payload)
    let variableName = properties.readProp("", testDataPropertiesPath);
     
    if (stringifiedPayload.includes('{}'))
        stringifiedPayload = stringifiedPayload.replace(/{}/g, variableName);  
 
    return JSON.parse(stringifiedPayload)
 
}
 
// Replace values of property in properties file
export async function replaceInPropertiesFile()
{
    let variableName = getMetaInfo().get("")
    if(variableName != undefined && variableName != null && variableName != "")
    {
        await properties.writeProp("", variableName, testDataPropertiesPath);
    }
}
 
// Update Response values
export async function updateResponseValues(testData) {
    if (JSON.stringify(testData.expResBody).includes("{}"))
        testData.expResBody = JSON.parse(JSON.stringify(testData.expResBody).replace("{}", getMetaInfo().get("")));
    return testData;
}