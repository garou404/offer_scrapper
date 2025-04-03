console.log("POP UP");

document.addEventListener("DOMContentLoaded", function () {
    // Request the confirmation message from the background script
    chrome.runtime.sendMessage({ action: "getConfirmation" }, function(response) {
        if (response) {
            document.getElementById("confirmationText").innerText = 
                `${response.message}`;
        } else {
            document.getElementById("confirmationText").innerText = "X Error fetching confirmation.";
        }
    });
});