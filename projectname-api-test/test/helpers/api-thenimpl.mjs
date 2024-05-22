import { use, should, assert as _assert } from 'chai';
import chaiExclude from 'chai-exclude';
import chaiLike from 'chai-like';
import chaiThings from 'chai-things';
import chaiSubset from 'chai-subset'
use(chaiSubset);
use(chaiExclude);
should();
use(chaiLike)
use(chaiThings);
let assert = _assert;
 
import { getMetaInfo } from '../features/step_definitions/hooks.mjs';
 
// Validate all the values in expected and actual response are same or not
export function valRes() {
  assert.deepEqual(getMetaInfo().get('actResBody'), getMetaInfo().get('expResBody'), "Actual and Expected response body mismatch");
}
 
// Validate all the keys in expected and actual response are same or not
export function checkKeyInReponseValue() {
  assert.containSubset(getMetaInfo().get('actResBody'), getMetaInfo().get('expResBody'), "Actual and Expected response body mismatch");
}
 
// Validate HTTP Response code after API is executed is same with expected response code
export function validateHTTPReponseCode() {
  assert.deepEqual(getMetaInfo().get('actHTTPStatus'), getMetaInfo().get('expResCode'), "Incorrect response code");
}
 
// Validate response body by excluding some keys in response body
export function validateResponseBodyExcluding(props) {
  assert.deepEqualExcludingEvery(getMetaInfo().get('actResBody'), getMetaInfo().get('expResBody'), props, "Actual and Expected response body mismatch");
}