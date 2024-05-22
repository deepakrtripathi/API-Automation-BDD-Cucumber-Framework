const fs = require('fs');
const { WebClient,LogLevel } = require('@slack/web-api');
const archiver = require('archiver');

// Set up your Slack access token
const token = '';

const slackClient = new WebClient(token);
let reportsPath = './test/reports/cucumber-results'

async function sendCucumberReportToSlack(channel, reportPath, env) {
  try {
    // Create a zip file
    const zipFilePath = './report.zip';
    const zipOutput = fs.createWriteStream(zipFilePath);
    const zipArchive = archiver('zip');

    zipOutput.on('close', async () => {
      try {
        // Read the zip file data
        const zipFileData = await fs.promises.readFile(zipFilePath);

        // Upload the zip file to Slack
        const result = await slackClient.files.uploadV2({
          channel_id: channel,
          filename: 'projectname_api_report.zip',
          file: zipFileData,
          // initial_comment: 'GALAXY API Automation report for ' + env + ' Environment',
        });

        // Log the response
        console.log('Cucumber report (zipped) sent successfully to Slack channel');
       
      } catch (error) {
        console.error('Error sending Cucumber report (zipped) to Slack:', error);
      } finally {
        // Delete the temporary zip file
        fs.unlinkSync(zipFilePath);
        
      }
      
    });

    // Create the zip file and add the HTML report to it
    zipArchive.pipe(zipOutput);
    zipArchive.file(reportPath, { name: 'projectname_api_report.html' });
    zipArchive.finalize();
    // send notes and summary information to slack channel for count of total scenarios, passed, failed or skipped cases 
    setTimeout(async () => {
      await generateSummaryReport(channel, env)
      await sendMessageToSlackChannel(channel, "Note: Pls download and open the zip file to get into the detailed report");
      
    }, 7000); // Adjust the delay time as needed
    
  } catch (error) {
    console.error('Error creating and sending Cucumber report (zipped) to Slack:', error);
  }
}

async function sendMessageToSlackChannel(channel, message) {
  try {
    // Send a message to the specified channel
    const result = await slackClient.chat.postMessage({
      channel: channel,
      text: message,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${message}*`, 
            verbatim: false,
          }
        },
      ],
     
    });

    // Log the response
    console.log('Message sent successfully:', result.ts);
  } catch (error) {
    console.error('Error sending message to Slack:', error);
  }
}

async function sendSummaryReportToSlack(channel, feature, totalTests, passedTests, failedTests, skippedTests, env) {
  try {
   
    // Create the Slack message blocks
    const blocks = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Automation Summary Report on ${env} Environment*`,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Feature:*\n${feature}`,
          },
          {
            type: 'mrkdwn',
            text: `*Total Tests:*\n${totalTests}`,
          },
          {
            type: 'mrkdwn',
            text: `*Passed Tests:*\n${passedTests}`,
          },
          {
            type: 'mrkdwn',
            text: `*Failed Tests:*\n${failedTests}`,
          },
          {
            type: 'mrkdwn',
            text: `*Skipped Tests:*\n${skippedTests}`,
          },
        ],
      },
    ];

    // Send the Slack message
    const result = await slackClient.chat.postMessage({
      channel: channel,
      blocks: blocks,
    });
  } catch (error) {
    console.error('Error sending Cucumber report to Slack:', error);
  }
}

// Read cucumber report folder and files as we do while sending email to dbatqa from jenkins job(emailReporter.js) 
async function readReportsFiles(dir) {
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

// Fetch count for total scenario, passed, failed and skipped test cases and send to slack channel as we do while sending email to dbatqa from jenkins job(emailReporter.js)
async function generateSummaryReport(channel,env) {
  let testJson;
  let totalRetryCount;
  let sceCount;
  let scriptStatus = new Map();
  let summary = [];
  let ff;
  let fileList = await readReportsFiles(reportsPath)
  for (let m = 0; m < fileList.length; m++) {
      testJson = require(reportsPath + '/' + fileList[m])
      totalRetryCount = testJson.length;
      sceCount = testJson[0].elements.length
      ff = testJson[0].name
      let succ = 0;
      let fail = 0;
      let skip = 0;
      let counter=0;

      for (let k = 0; k < totalRetryCount; k++) {
          sceCount = testJson[k].elements.length

          for (let i = 0; i < sceCount; i++) {
              let stepsCount = testJson[k].elements[i].steps.length;
              let sceName = testJson[k].elements[i].tags[0].name;
              for (let j = 0; j < stepsCount; j++)  //it will give number of steps for a scenario
              {
                  if (testJson[k].elements[i].steps[j].result.status === 'passed') {
                      scriptStatus.set(sceName, "passed")
                  }
                  else {
                      scriptStatus.set(sceName, "failed")
                      break;
                  }
              }

              if (scriptStatus.get(sceName) == "passed" && counter==1) {
                  succ = succ + 1
              }
              else if (scriptStatus.get(sceName) == "failed" && counter==1) {
                  fail = fail + 1;
              }
              else if (scriptStatus.get(sceName) == "passed" && counter==0 && totalRetryCount==1) {
                  succ = succ + 1
              }
              else if (scriptStatus.get(sceName) == "failed" && counter==0 && totalRetryCount==1) {
                  fail = fail + 1;
              }
              else if (scriptStatus.get(sceName) == "passed" && counter==0 && totalRetryCount==2) {
                  succ = succ + 1
                  fail = fail - 1;
              }

          }
          counter=counter+1;
      }

      //let totalScenario = scriptStatus.size;
      let totalScenario = succ+fail+skip;
      scriptStatus.clear();
      summary[m] = { "ff": ff, "totalScenario": totalScenario, "sucCount": succ, "failCount": fail, "skipCount": skip }
   
      for (let i = 0; i < summary.length; i++) {
        // Send count for total scenarios, passed, failed or skipped cases
          sendSummaryReportToSlack(channel,summary[i].ff,summary[i].totalScenario,summary[i].sucCount,summary[i].failCount,summary[i].skipCount,env)
      }
  }
}

module.exports.sendCucumberReportToSlack = sendCucumberReportToSlack;