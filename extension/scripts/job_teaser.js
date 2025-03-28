(function() {
    let company = document.querySelector("#company-name");
    let location = document.querySelector('p[data-testid="jobad-DetailView__CandidacyDetails__Locations"]');
    let position = document.querySelector('h1[data-testid="jobad-DetailView__Heading__title"]');

    chrome.runtime.sendMessage({ 
        action: "send_scraped_data", 
        data: {"link": window.location.href, "company": company.innerText, "location": location.innerText, "position": position.innerText} 
    }, response => {
        console.log("Send scraped data (Job teaser):", response);
    });
    
})();
