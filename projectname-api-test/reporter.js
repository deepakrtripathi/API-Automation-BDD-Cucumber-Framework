import { generate } from 'cucumber-html-reporter';
var env = process.argv[2]
// import { sendCucumberReportToSlack } from './slackService.js';
 
var options = {
        theme: 'bootstrap',
        jsonFile: 'test/reports/cucumber-results/projectname_api_report.json',
        output: 'test/reports/cucumber-results/projectname_api_report.html',
        reportSuiteAsScenarios: true,
        scenarioTimestamp: true,
        launchReport: true,
        metadata: {
            "Test Environment": env,
        }
    };
 
    generate(options);
    // sendCucumberReportToSlack("channelID", "test/reports/cucumber-results/projectname_api_report.html",env);