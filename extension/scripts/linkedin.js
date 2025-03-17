console.log("Linkedin");
const position = document.querySelector("div.t-24.job-details-jobs-unified-top-card__job-title");
if(position) {
    console.log(position.innerText);
    const company = document.querySelector("div.job-details-jobs-unified-top-card__company-name");
    console.log(company)
    if(company){
        console.log(company.textContent.trim());
        const information_container = document.querySelector("div.t-black--light.mt2.job-details-jobs-unified-top-card__tertiary-description-container");
        if(information_container){
            console.log(information_container.querySelector("span").innerText.trim());
        }
    }

}