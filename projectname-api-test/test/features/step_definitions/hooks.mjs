
import { BeforeAll, AfterAll, After} from '@cucumber/cucumber';

import { commonFun, testDataFilePath } from '../../../config.mjs';
let metainfo = new Map();


BeforeAll( () => {
  var rows = commonFun.readFileXls(testDataFilePath)
  metainfo.set("excelRows", rows);
});

AfterAll( () => {
  metainfo.clear();
});

After( function () {
  var url = metainfo.get('url');
  var requestPayload = metainfo.get('requestPayload');
  var expectedResponseStatus = metainfo.get('expResCode');
  var actualResponseStatus = metainfo.get('actHTTPStatus');
  var expectedResponseBody = metainfo.get('expResBody');
  var actualResponseBody = metainfo.get('actResBody');

  this.attach('{"url                    ": "'+ url +'"}', 'text/plain');
  this.attach('{"requestPayload         ": "'+ JSON.stringify(requestPayload) +'"}', 'application/json');
  this.attach('{"expectedResponseStatus ": "'+ expectedResponseStatus +'"}', 'text/plain');
  this.attach('{"actualResponseStatus   ": "'+ actualResponseStatus +'"}', 'text/plain');
  this.attach('{"expectedResponseBody   ": "'+ JSON.stringify(expectedResponseBody) +'"}', 'application/json');
  this.attach('{"actualResponseBody     ": "'+ JSON.stringify(actualResponseBody) +'"}', 'application/json');
});


export function getMetaInfo() {
  return metainfo;
}
export function setMetaInfo(key, value) {
  metainfo.set(key, value);
}


