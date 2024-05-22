let env; //test enviornemt
let feature; //feature file
let suite; //cucumber tags
let featureFilePaths = [];
 
try {
 
    /* it will expect arguments in proper order like
    "npm run test dev sanity.feature Runonly" //it will execute only for single tag Runonly for feature sanity.feature
    "npm run test dev sanity.feature all" //it will execute  for all tags for feature sanity.feature
    "npm run test dev sanity.feature 'tc:CL3||MB','tc:CL4||MB' " //it will execute  for multiple tags for feature sanity.feature
     "npm run test dev 'total-control-MB.feature','total-control-IB.feature' Runonlyy" //2 feature file will be get executed
     but if u want to execute more feature files you have to make changes in this file
     "npm run test" //it will pick default config from this file
     "node_modules/.bin/wdio ./wdio.conf.js  --spec=test/features/cross-selling-IB.feature:578" //it will support this ..but
     you have to change default env here as env is not passed in rerun.sh
    */
    env = process.argv[2]
    feature = process.argv[3];
    suite = process.argv[4];
    process.env.ENV = env;
   
    /* default configuration here if arguments not passed .Ex. npm run test
or for "node_modules/.bin/wdio ./wdio.conf.js  --spec=test/features/cross-selling-IB.feature:578"
*/
   
 
    let newfeature = feature.split(",")
 
    for (let i = 0; i < newfeature.length; i++) {
        featureFilePaths.push("test/features/"+newfeature[i])
    }
 
    if (Array.isArray(newfeature) && !process.argv[2].includes("spec")) {
        feature = newfeature[0]
        // maxInstance = newfeature.length
    }
    else {
        feature = feature
        // maxInstance = 1
    }
 
    let newsuite = suite.split(",")
 
    if (Array.isArray(newsuite) && suite !== 'all') {
 
        suite = ''
        for (let i = 0; i < newsuite.length; i++) {
            suite = suite + " @" + newsuite[i] + " or "
        }
        suite = suite.slice(0, -3);
    }
    else if (suite === "all") {
        suite = "not @" + suite
    }
 
    else {
        suite = "@" + suite
    }
 
}
catch {
    console.log("there is some error with arguments passed to npm run test")
}
 
console.log("env: " + env)
console.log("feature: " + feature)
console.log("suite: " + suite)
 
const pretty_format = {"theme":{"feature keyword":["magenta","bold"],"scenario keyword":["magenta","bold"],"step keyword":["bold", "magenta"], "step message": ["grey"], "tag": ["green"]}}
 
export default {
    publishQuiet: true,
    paths: featureFilePaths,
    tags: `${suite}`,
    format: ['json:test/reports/cucumber-results/projectname_api_report.json', '@cucumber/pretty-formatter'],
    formatOptions: pretty_format
  }