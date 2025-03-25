(function() {
    let position = document.querySelector('h2[data-testid="simpler-jobTitle"]').innerText;
    let location = document.querySelector("div.css-xb6x8x.e37uo190");
    location = location?.childNodes[0]?.textContent.trim();
    

    let company_span = document.querySelector("span.jobsearch-JobInfoHeader-companyNameSimple");
    let company_a = document.querySelector("a.jobsearch-JobInfoHeader-companyNameLink");
    let company = company_a ? company_a.innerText : company_span ? company_span.innerText : null;

    console.log(company, location, position);
    chrome.runtime.sendMessage({ 
        action: "send_scraped_data", 
        data: {"link": window.location.href, "company": company, "location": location, "position": position} 
    }, response => {
        console.log("Send scraped data (Indeed):", response);
    });
})();

// element?. → Optional Chaining
    // What it does:
    // element?. ensures that element exists before trying to access its properties.
    // If element is null or undefined, the expression stops immediately and returns undefined instead of throwing an error.