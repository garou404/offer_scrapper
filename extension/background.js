import { fetchData, addRow } from "./scripts/googleSheets.js";

const indeed = "indeed.com/";
const linkedin = "www.linkedin.com/jobs/";
const job_teaser = "www.jobteaser.com/en/job-offers";

const spreadsheetId = "1OeHySMPQ_8ny9XwoGzUA7m2lrDREE0IYolxbc1FxNqk";
const sheetId = "crash_test";
const range = "!A:L";
const url = "https://sheets.googleapis.com/v4/spreadsheets/"

chrome.action.onClicked.addListener(async (tab) => {
    if(tab.url.includes(job_teaser)){
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["scripts/job_teaser.js"]
        });
    }else if(tab.url.includes(linkedin)){
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["scripts/linkedin.js"]
        });
    }else if(tab.url.includes(indeed)) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["scripts/indeed.js"]
        });
    }
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === "send_scraped_data") {
        let data = await fetchData(spreadsheetId, sheetId, range, url);
        if(data){
            addRow(data, request.data, spreadsheetId, sheetId, range, url);
        }else{
            console.log("Failed to get data from google sheet");
        }
    }
});


