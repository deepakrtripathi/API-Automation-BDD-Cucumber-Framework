import fetch from 'node-fetch';
import { ENV as _ENV, apiBaseUrl as _apiBaseUrl, apiIsEncryptionRequired, apiIsEncryptionMethodAM92, encrypt, decrypt, apiHandShakeUrl as _apiHandShakeUrl, X_API_KEY as _X_API_KEY, consolePrompt} from '../../config.mjs';
import { getMetaInfo, setMetaInfo } from '../features/step_definitions/hooks.mjs';
import { logResponses, extractValueFromResponses, timeout, setExpectedResponseInfo, updatePayloadValues, updateAPIEndpoint, replacePropertiesInPayload, replaceInPropertiesFile, updateResponseValues, setEncryptionKeys} from './commonFunctions.mjs';
 
const apiBaseUrl = _apiBaseUrl;
const isEncryptionRequired = apiIsEncryptionRequired;
const IsEncryptionMethodAM92 = apiIsEncryptionMethodAM92;
const handshake_url = _apiHandShakeUrl;
const X_API_KEY = _X_API_KEY;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
 
// This function is used when IsEncryptionMethodAM92 = true
export async function getPublicKeyFromHandshake() {
    // Fetch public key
    let baseHandshakeURL = apiBaseUrl + "handshake";
    const response = await fetch(baseHandshakeURL, {
        method: 'GET',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json'
        }
    });
 
    let body = await response.text();
    let actResBody = JSON.parse(body);
    setMetaInfo("publicKey", actResBody['data']['publicKey']);
    setEncryptionKeys(actResBody['data']['publicKey']);
    await logResponses(baseHandshakeURL, null, actResBody, response, null, null);
}
 
// Get token from handshake API and use in other API's as headers
export async function getToken() {
    const response = await fetch(handshake_url, {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json'
        }
    });
 
    let body = await response.text();
    let actResBody = JSON.parse(body);
    setMetaInfo("accessToken", actResBody['data']['token']);
    await logResponses(handshake_url, null, actResBody, response, null, null);
 
}
 
// Set common request headers for API
function setCommonHeaders(reqHeaders,testDataKey)
{
    reqHeaders.append("Accept","application/json, text/plain, */*")
    reqHeaders.append("x-api-key",X_API_KEY);
    if(getMetaInfo().get("accessToken") != null && getMetaInfo().get("accessToken") != undefined)
    {
        reqHeaders.append("x-access-token",getMetaInfo().get("accessToken"));
    }
    return reqHeaders;
}
 
// This function is used when IsEncryptionMethodAM92 = true
function setEncryptionHeaders(reqHeaders)
{
    reqHeaders.append("x-api-encryption-key",getMetaInfo().get("encryptionKey"));
    return reqHeaders;
}
 
//Set API Base URL according to test cases
export async function getApiUrl(testDataKey,endpoint) {
    let url = apiBaseUrl + endpoint;;
    if (endpoint.includes(""))
    {
        url = /*other API URL if any*/  + endpoint;
    }
   
   
    return url;
}
 
 // Call API with GET Method
export async function reqGet(testData,testDataKey) {
    testData = await updateResponseValues(testData);
    let endpoint = await updateAPIEndpoint(testData, testDataKey);
    await setExpectedResponseInfo(testData);
 
    let url = await getApiUrl(testDataKey,endpoint);
 
    let response = null;
    var reqHeaders = new fetch.Headers();
 
    reqHeaders = setCommonHeaders(reqHeaders,testDataKey);
    reqHeaders.append("Content-Type","application/json")
   
    if (isEncryptionRequired == 'true' && IsEncryptionMethodAM92 == 'true') {
        await getPublicKeyFromHandshake();
        reqHeaders = setEncryptionHeaders(reqHeaders);
    }
    response = await fetch(url, {
        headers: reqHeaders
    });
   
    let body = await response.text();
    let apiResponse = JSON.parse(body);
    let actResBody = apiResponse;
 
    if (isEncryptionRequired == 'true') {
        if(IsEncryptionMethodAM92 == "true")
        {
            if(apiResponse['data'] != undefined && apiResponse['data']['payload'] != undefined)
            {
                let encrypt_res_payload = apiResponse['data']['payload'];
                actResBody = decrypt(encrypt_res_payload,getMetaInfo().get("cryptoKey"));
            }
        }
        else
        {
            let xToken =  response.headers.get('x-access-token');
            if(apiResponse['data'] != undefined && apiResponse['data'] != null)
            {
                let encrypt_res_payload = apiResponse['data']['payload'];
                actResBody = decrypt(xToken,encrypt_res_payload);
            }
        }
    }
 
    await logResponses(url, null, actResBody, response, getMetaInfo().get("accessToken"), X_API_KEY);
    await extractValueFromResponses(testData, actResBody,testDataKey);
    setMetaInfo("actHTTPStatus", response.status);
}
 
// Call handshake, make encryption key and encrypt the payloads
export async function getEncryptedPayload(payload)
{
        await getPublicKeyFromHandshake();
        var encryptedObj = encrypt(payload,getMetaInfo().get("cryptoKey"));
        return encryptedObj;
}
 
 // Call API with POST Method
export async function reqPost(testData,testDataKey) {
    var token = await getToken();
    let endpoint = await updateAPIEndpoint(testData, testDataKey);
    await setExpectedResponseInfo(testData);
 
    //check API payload
    testData = await updatePayloadValues(testData);
 
    let url = await getApiUrl(testDataKey,endpoint);
 
    let payload = testData.reqBody;
    payload = await replacePropertiesInPayload(payload)
   
    let response = null;
    var reqPostBody = null;
    var reqHeaders = new fetch.Headers();
    reqHeaders = setCommonHeaders(reqHeaders,testDataKey);
    reqHeaders.append("Content-Type","application/json")
   
    let apiPayload = payload;
   
    // If Encryption is true call encrypt function of crypto library
    if (isEncryptionRequired == 'true') {
        if(IsEncryptionMethodAM92 == "true")
        {
            apiPayload = await getEncryptedPayload(payload);
            reqHeaders = setEncryptionHeaders(reqHeaders);
            reqPostBody = {"payload": apiPayload}
        }
        else
        {
            reqPostBody = encrypt(token,apiPayload)
        }
    }
    else
    {
        reqPostBody = apiPayload;
    }
   
    response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(reqPostBody),
        headers: reqHeaders
    });
 
    let body = await response.text();
    let apiResponse = JSON.parse(body);
    let actResBody = apiResponse;
    if (isEncryptionRequired == 'true') {
        if(apiResponse['data'] != undefined && apiResponse['data']['payload'] != undefined)
        {
            if(IsEncryptionMethodAM92 == "true")
            {
                let encrypt_res_payload = apiResponse['data']['payload'];
                actResBody = decrypt(encrypt_res_payload,getMetaInfo().get("cryptoKey"));
            }
            else
            {
                let xToken =  response.headers.get('x-access-token');
                let encrypt_res_payload = apiResponse['data']['payload'];
                actResBody = decrypt(xToken,encrypt_res_payload);
            }
        }
    }
 
    if (actResBody['data'] != undefined) {
        await extractValueFromResponses(testData, actResBody,testDataKey);
    }
   
    if (isEncryptionRequired == 'true') {
        setMetaInfo("actHTTPStatus", actResBody.statusCode);
    }
 
    else {
        setMetaInfo("actHTTPStatus", response.status);
    }
 
    await logResponses(url, payload, actResBody, response, getMetaInfo().get("accessToken"), X_API_KEY)
}