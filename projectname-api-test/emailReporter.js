var fs = require('fs')
require('dotenv').config();
const replace = require('replace-in-file');
let fileList = [];
let env = process.argv[2]
 
 
//read json files
async function readDir(dir) {
    let fileList = [];
    let i = 0;
    fs.readdirSync(dir).forEach(file => {
        if (file.includes('.json')) {
            fileList[i] = file;
            i = i + 1;
        }
    });
    return fileList;
}
 
let testJson;
let totalRetryCount;
let scriptStatus = new Map();
let summary = [];
let ff;
 
 
async function readFile() {
    fileList = await readDir('./test/reports/cucumber-results')
    for (let m = 0; m < fileList.length; m++) {
        testJson = require('./test/reports/cucumber-results/' + fileList[m])
        totalRetryCount = testJson.length;
     
 
        for (let k = 0; k < totalRetryCount; k++) {
            ff = testJson[k].name
            let succ = 0;
            let fail = 0;
            let skip = 0;
            // let counter=0;
            let totalScenario = testJson[k].elements.length
 
            for (let i = 0; i < totalScenario; i++) {
                let stepsCount = testJson[k].elements[i].steps.length;
                let sceName = testJson[k].elements[i].tags[0].name;
                for (let j = 0; j < stepsCount; j++)
                {
                    if (testJson[k].elements[i].steps[j].result.status === 'passed') {
                        scriptStatus.set(sceName, "passed")
                    }
                    else {
 
                        scriptStatus.set(sceName, testJson[k].elements[i].steps[j].result.status)
                        break;
                    }
                }
 
                if (scriptStatus.get(sceName) == "passed") {
                    succ = succ + 1
                }
                else if (scriptStatus.get(sceName) == "failed") {
                    fail = fail + 1;
                }
                else if (scriptStatus.get(sceName) == "skipped") {
                    skip = skip + 1;
                }
 
                // if (scriptStatus.get(sceName) == "passed" && counter==1) {
                //     succ = succ + 1
                // }
                // else if (scriptStatus.get(sceName) == "failed" && counter==1) {
                //     fail = fail + 1;
                // }
                // else if (scriptStatus.get(sceName) == "passed" && counter==0 && totalRetryCount==1) {
                //     succ = succ + 1
                // }
                // else if (scriptStatus.get(sceName) == "failed" && counter==0 && totalRetryCount==1) {
                //     fail = fail + 1;
                // }
                // else if (scriptStatus.get(sceName) == "passed" && counter==0 && totalRetryCount==2) {
                //     succ = succ + 1
                //     fail = fail - 1;
 
                // }
            }
            // counter=counter+1;
            scriptStatus.clear();
   
            summary[k] = { "ff": ff, "totalScenario": totalScenario, "sucCount": succ, "failCount": fail, "skipCount": skip }
   
        }
 
       
        let allFeaturesInfo = '';
 
        for (let i = 0; i < summary.length; i++) {
            let ff = "<td>"+summary[i].ff+"</td>";
            let totalScenario = "<td>"+summary[i].totalScenario+"</td>";
            let sucCount = "<td>"+summary[i].sucCount+"</td>";
            let failCount = "<td>"+summary[i].failCount+"</td>";
            let skipCount = "<td>"+summary[i].skipCount+"</td>";
 
            let featureInfo = "<tr>"+ff+totalScenario+sucCount+failCount+skipCount+"</tr>";
            allFeaturesInfo = allFeaturesInfo + featureInfo;
        }
 
        let regex_Rows = new RegExp("DetailsOfFeatures");
        let regex_env = new RegExp("ENV");
 
        const options = {
            files: 'summaryReport.html',
            from: [regex_Rows, regex_env],
            to: [allFeaturesInfo, env]
        };
 
        try {
            const results = await replace(options)
            console.log('Replacement results:', results);
        }
        catch (error) {
            console.error('Error occurred:', error);
        }
 
    }
}
 
readFile()