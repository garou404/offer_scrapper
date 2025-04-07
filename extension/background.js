import { fetchData, addRow } from "./scripts/googleSheets.js";

const indeed = "indeed.com/";
const linkedin = "www.linkedin.com/jobs/";
const job_teaser = "www.jobteaser.com/en/job-offers";

const spreadsheetId = "1OeHySMPQ_8ny9XwoGzUA7m2lrDREE0IYolxbc1FxNqk";
const sheetId = "crash_test2";
const range = "!A:L";
const url = "https://sheets.googleapis.com/v4/spreadsheets/"
let lastResult = null;

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === "send_scraped_data") {
        let data = await fetchData(spreadsheetId, sheetId, range, url);
        if(data){
            const msg = await addRow(data, request.data, spreadsheetId, sheetId, range, url);
            lastResult = msg;
            console.log("We send response: "+msg);
            sendResponse({data: msg});
        }else{
            console.log("Failed to get data from google sheet");
            sendResponse({data: "Error"});
        }
        return true;
    }else if(request.action === "trigger_script"){
        if(request.url.includes(job_teaser)){
            chrome.scripting.executeScript({
                target: { tabId: request.tab_id },
                files: ["scripts/job_teaser.js"]
            });
        }else if(request.url.includes(linkedin)){
            chrome.scripting.executeScript({
                target: { tabId: request.tab_id },
                files: ["scripts/linkedin.js"]
            });
        }else if(request.url.includes(indeed)) {
            chrome.scripting.executeScript({
                target: { tabId: request.tab_id },
                files: ["scripts/indeed.js"]
            });
        }
    }else if (request.action === "get_result") {
        console.log("receive get_res");
        sendResponse(lastResult);
    }
});


