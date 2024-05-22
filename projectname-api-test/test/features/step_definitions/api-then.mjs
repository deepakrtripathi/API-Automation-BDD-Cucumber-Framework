import { Then } from '@cucumber/cucumber';
import { assert as _assert } from 'chai';
let assert = _assert;
let metainfo = new Map();
import { getMetaInfo } from './hooks.mjs';
metainfo = getMetaInfo();
let testDataValue;
import { valRes, checkKeyInReponseValue, validateResponseBodyExcluding, validateHTTPReponseCode } from '../../helpers/api-thenimpl.mjs';
let defaultExcludeArray = ['data','status','stackTrace']
 
// Validate API Reponse Body
Then('validate "{}" api response body for "{}"', async (validation_type, testDataKey) =>   {
 
    if (validation_type == 'complete'){
      valRes();
    }
    else if (validation_type == 'partial'){
      checkKeyInReponseValue();
    }
    else if(validation_type == 'partial-keys'){
        validateResponseBodyExcluding(defaultExcludeArray);
    }
});
 
// Validate partial reponse body
Then('validate partial response body for "{}"', async (testDataKey) => {
  checkKeyInReponseValue();
});
 
// Validate HTTP API Reponse Code
Then('validate HTTP response code for "{}"', async (testDataKey) => {
  validateHTTPReponseCode();
});