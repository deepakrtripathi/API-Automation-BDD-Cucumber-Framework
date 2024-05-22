import { When } from '@cucumber/cucumber';
import { reqGet, reqPost } from '../../helpers/api-whenimpl.mjs';
let testDataValue;
let metainfo = new Map();
import { commonFun } from '../../../config.js';
import { getMetaInfo,setMetaInfo } from './hooks.mjs';
metainfo = getMetaInfo();
 
 
// Call API and pass test data and get response from the same
When('call the "{}" API using test data "{}"',  async (method, testDataKey) => {
  method == 'GET'? await reqGet(testDataValue,testDataKey) : await reqPost(testDataValue,testDataKey);
});