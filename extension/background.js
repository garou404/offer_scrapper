import { fetchData, addRow } from "./scripts/googleSheets.js";

const indeed = "indeed.com/";
const linkedin = "www.linkedin.com/jobs/";
const job_teaser = "www.jobteaser.com/en/job-offers";

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
        let data = await fetchData();
        addRow(data, request.data.link, request.data.company, request.data.position, request.data.location);
    }
    //     let result = await appendToSheet(request.data);
    //     sendResponse({ success: true, result });
    // }
});


