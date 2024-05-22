

//class commonFun 
  import { existsSync } from 'fs';
  import { parse } from 'node-xlsx';


   function formatDate(date) {
       let d = new Date(date),
         month = '' + (d.getMonth()+1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    let hour = d.getHours();
    let minute = d.getMinutes();
    let second = d.getSeconds();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day, hour, minute, second].join('-');
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function monthName(mon) {
return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Nov', 'Dec'][mon];
}



function  getPinCode(str) {

        try {
            var re = /[0-9]{6}/;
            str = str.replace(/\s/g, '');
            // get the index of the dash
            var dash = str.indexOf('-');
            // remove everything before the dash
            str = str.substring(dash);
            // execute the pattern match
            var m = re.exec(str);
            // this is your answer
            //console.log(m[0]);
            return m[0];
        }
        catch (Exception) {
        }
    }

    function  getTestData(excelRows, testDataKey) {
        for (let i = 1; i < excelRows[0].data.length; i++) {
          if (excelRows[0].data[i][0] == testDataKey) {
            let testData = {
              'method': excelRows[0].data[i][1],
              'endPoint': excelRows[0].data[i][2], 'expResCode': excelRows[0].data[i][4],
              'expResBody': JSON.parse(excelRows[0].data[i][5]), 'reqBody': JSON.parse(excelRows[0].data[i][3])
            }
            return testData;
          }
        }
      }
      

      function readFileXls(filename) {
  if (existsSync(filename)) {
    return parse(filename)
  }
  return null
}

const _readFileXls = readFileXls;
export { _readFileXls as readFileXls };
const _getTestData = getTestData;
export { _getTestData as getTestData };



//}


//export default new commonFun();





