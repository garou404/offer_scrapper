const indeed = "indeed.com/";
const linkedin = "www.linkedin.com/jobs/";
const job_teaser = "www.jobteaser.com/en/job-offers";

chrome.action.onClicked.addListener(async (tab) => {
    let token = await getAuthToken();

    fetchData(token);
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
    return new Promise((resolve, reject) => {
        chrome.identity.getAuthToken({interactive: true}, function(token) {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(token);
            }
        });
    });
};

async function fetchData(token) {
    const spreadsheetId = "1OeHySMPQ_8ny9XwoGzUA7m2lrDREE0IYolxbc1FxNqk";
    const sheetId = "crash_test";
    const range = "!A:L";
    const url = "https://sheets.googleapis.com/v4/spreadsheets/"
    
    let init = {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + token,
        },
    };
    const response = await fetch(
        url+spreadsheetId+"/values/"+sheetId+range,
        init
    );
    
    const result = await response.json();
    result.values;
    const data = sortValues(result.values);
    // addRow(result.values, "my_company", "software engineer developer director CEO", "Naves-Parmelan", token);    
}

function sortValues(data){
    const headers = data[0]; // ["Name", "Age", "City"]
    const rows = data.slice(1); // Everything except headers
    const objects = rows.map(row => 
        Object.fromEntries(row.map((value, index) => [headers[index], value]))
    );

    const filtered_data = objects
    .filter(obj => Object.keys(obj).length > 0)
    .filter(obj => (obj.company != '') & (obj.job != '') & (obj.link != ''));

    const sub_data = filtered_data.filter(x => x.sub == "TRUE").sort((a, b) => {
        const [dayA, monthA] = a.app.split("/").map(Number);
        const [dayB, monthB] = b.app.split("/").map(Number);
        return new Date(2024, monthA - 1, dayA) - new Date(2024, monthB - 1, dayB);
    });
    const todo_data = filtered_data.filter(x => x.todo == "TRUE").sort((a, b) => {
        const [dayA, monthA] = a.todo.split("/").map(Number);
        const [dayB, monthB] = b.todo.split("/").map(Number);
        return new Date(2024, monthB - 1, dayB) - new Date(2024, monthA - 1, dayA);
    });
    const dead_data = filtered_data.filter(x => x.dead == "TRUE");

    return [...sub_data, ...todo_data, ...dead_data];
}

async function addRow(data, company, position, location, token) {
    console.log(data);
    const today = new Date();
    const today_date = `${today.getDate()}/${today.getMonth() + 1}`;
    
    console.log(data.push(["", company, "", position, "FALSE", "FALSE", "TRUE", "", today_date, "", location]));

    const spreadsheetId = "1OeHySMPQ_8ny9XwoGzUA7m2lrDREE0IYolxbc1FxNqk";
    const sheetId = "crash_test";
    const range = "!A:L";
    const url = "https://sheets.googleapis.com/v4/spreadsheets/"
    
    const body = {
        values: data,
    };
    let init = {
        method: 'PUT',
        headers: {
            Authorization: 'Bearer ' + token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body),
    };

    const response = await fetch(
        url+spreadsheetId+"/values/"+sheetId+range+"?valueInputOption=USER_ENTERED",
        init,
    );
    
    const result = await response.json();
    console.log(result);
}

// https://developers.google.com/sheets/api/reference/rest

// POST /v4/spreadsheets/{spreadsheetId}:batchUpdate
// Applies one or more updates to the spreadsheet.

// GET /v4/spreadsheets/{spreadsheetId}
// Returns the spreadsheet at the given ID.

// GET /v4/spreadsheets/{spreadsheetId}/values/{range}
// Returns a range of values from a spreadsheet.

// PUT /v4/spreadsheets/{spreadsheetId}/values/{range}
// Sets values in a range of a spreadsheet.