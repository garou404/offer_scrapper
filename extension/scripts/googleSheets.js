const headers = ["link", "company", "prio", "position", "sub", "dead", "todo", "app", "add", "apllication plateform", "location", "note"];

// Function to get the authentication token
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

// Function to get the data from the google sheet
async function fetchData(spreadsheetId, sheetId, range, url) {
    console.log("fetchData"); 
    let token = await getStoredToken();
  
    if (!token) {
        console.log("no stored token");
        token = await getAuthToken();
        storeToken(token);
    }

    // API call
    const response = await fetch(
        url+spreadsheetId+"/values/"+sheetId+range,
        {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + token,
            },
        }
    );
    
    const res = await response.json();
    // if error 401 generate token again
    if(res.error?.code == 401 && res.error?.status == "UNAUTHENTICATED"){
        token = await getAuthToken();
        storeToken(token);
        const response = await fetch(
            url+spreadsheetId+"/values/"+sheetId+range,
            {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            }
        );
        const res = await response.json();
    }
    console.log(`GET request ${res}`);
    return res.values;
}

// Function to filter and sort the objects 
function sortValues(data){
    
    // check if first line is header
    let rows  = data[0][0] == "link" ? data.slice(1) : data;

    const objects = rows.map(row => 
        Object.fromEntries(row.map((value, index) => [headers[index], value]))
    );

    // filter empty values
    const filtered_data = objects
    .filter(obj => Object.keys(obj).length > 0)
    .filter(obj => (obj.company != '') & (obj.position != '') & (obj.link != ''));

    // select submitted rows and sort by date when submitted
    const sub_data = filtered_data.filter(x => x.sub == "TRUE").sort((a, b) => {
        const [dayA, monthA] = a.app.split("/").map(Number);
        const [dayB, monthB] = b.app.split("/").map(Number);
        return new Date(2024, monthA - 1, dayA) - new Date(2024, monthB - 1, dayB);
    });
    // select todo rows and sort by date when added
    const todo_data = filtered_data.filter(x => x.todo == "TRUE").sort((a, b) => {
        const [dayA, monthA] = a.add.split("/").map(Number);
        const [dayB, monthB] = b.add.split("/").map(Number);
        return new Date(2024, monthB - 1, dayB) - new Date(2024, monthA - 1, dayA);
    });
    // select dead rows
    const dead_data = filtered_data.filter(x => x.dead == "TRUE");

    return [...sub_data, ...todo_data, ...dead_data];
}

// Function to add a row to the google sheet
async function addRow(data, new_row, spreadsheetId, sheetId, range, url) {

    let token = await getStoredToken();
    if (!token) {
      token = await getAuthToken();
      storeToken(token);
    }

    
    if(new_row.link.startsWith("https://www.linkedin.com")){
        let job_id;
        if(new_row.link.startsWith("https://www.linkedin.com/jobs/view/")){
            job_id = new_row.link.split("/jobs/view/")[1]?.split("/")[0] || null;
        }else{
            const urlObj = new URL(new_row.link);
            job_id = urlObj.searchParams.get("currentJobId");
        }
        // We check if row is already in our data
        const row_already_added = data.filter(x => 
            x[0].includes(job_id) &&
            x[0].includes("https://www.linkedin.com")
        ).length;
        if(row_already_added) return;
    }
    
    // Create and add new row
    const today = new Date();
    const today_date = `${today.getDate()}/${today.getMonth() + 1}`;    
    data.push([new_row.link, new_row.company, "", new_row.position, "FALSE", "FALSE", "TRUE", "", today_date, "", new_row.location, ""]);
    
    // Sort the data
    const new_data = sortValues(data);
    
    const formatted_data = new_data.map(obj => headers.map(header => obj[header] ? obj[header] : ""));
    // console.log([headers, ...formatted_data]);

    const body = {
        values: [headers, ...formatted_data],
    };

    // API call
    const response = await fetch(
        url+spreadsheetId+"/values/"+sheetId+range+"?valueInputOption=USER_ENTERED",
        {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body),
        }
    );
    
    const result = await response.json();
    console.log(result);
}


// Function to store token
function storeToken(token) {
    chrome.storage.local.set({ googleAuthToken: token });
}


// Function to retrieve stored token
function getStoredToken() {
    return new Promise((resolve) => {
      chrome.storage.local.get("googleAuthToken", (data) => {
        resolve(data.googleAuthToken || null);
      });
    });
}



export { fetchData, addRow };


// https://developers.google.com/sheets/api/reference/rest

// POST /v4/spreadsheets/{spreadsheetId}:batchUpdate
// Applies one or more updates to the spreadsheet.

// GET /v4/spreadsheets/{spreadsheetId}
// Returns the spreadsheet at the given ID.

// GET /v4/spreadsheets/{spreadsheetId}/values/{range}
// Returns a range of values from a spreadsheet.

// PUT /v4/spreadsheets/{spreadsheetId}/values/{range}
// Sets values in a range of a spreadsheet.