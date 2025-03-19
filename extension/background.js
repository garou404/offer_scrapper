const indeed = "indeed.com/";
const linkedin = "www.linkedin.com/jobs/";
const job_teaser = "www.jobteaser.com/en/job-offers";

chrome.action.onClicked.addListener(async (tab) => {
    console.log("TOKEN - TOKEN - TOKEN - TOKEN - TOKEN - TOKEN - TOKEN");
    console.log(getAuthToken());
    console.log(tab.url);
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

function getAuthToken() {
    chrome.identity.getAuthToken({interactive: true}, function(token) {
        console.log(token);
        return token;
    });
};
    // "content_scripts": [
    //     {
    //         "js": ["scripts/job_teaser.js"],
    //         "matches": [
    //             "https://www.jobteaser.com/*",
    //             "https://www.jobteaser.com/en/job-offers/*"
    //         ],
    //         "all_frames": true
    //     },
    //     {
    //         "js": ["scripts/linkedin.js"],
    //         "matches": [
    //             "https://www.linkedin.com/jobs/*"
    //         ]
    //     },
    //     {
    //         "js": ["scripts/indeed.js"],
    //         "matches": [
    //             "https://*.indeed.com/*"
    //         ]
    //     }
    // ] 