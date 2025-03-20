(function() {
    let position = document.querySelector("div.t-24.job-details-jobs-unified-top-card__job-title");
    position = position.innerText;
    let company = document.querySelector("div.job-details-jobs-unified-top-card__company-name");
    company = company.textContent.trim();
    let location = document.querySelector("div.t-black--light.mt2.job-details-jobs-unified-top-card__tertiary-description-container");
    location = location.querySelector("span").innerText.trim();
    console.log(company);
    console.log(location);
    console.log(position);
})();