(function() {
    let position = document.querySelector("div.t-24.job-details-jobs-unified-top-card__job-title");
    position = position.innerText;
    let company = document.querySelector("div.job-details-jobs-unified-top-card__company-name");
    company = company.textContent.trim();
    let location = document.querySelector("div.t-black--light.mt2.job-details-jobs-unified-top-card__tertiary-description-container");
    console.log(location);
    location = location.querySelector("span").querySelector("span").innerText.trim();
    
    chrome.runtime.sendMessage({ 
        action: "send_scraped_data", 
        data: {"link": window.location.href, "company": company, "location": location, "position": position} 
    }, response => {
        console.log("Send scraped data (Linkedin):", response);
    });

})();