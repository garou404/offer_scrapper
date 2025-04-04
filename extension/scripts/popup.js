console.log("POP UP");

document.addEventListener("DOMContentLoaded", function () {
    // Request the confirmation message from the background script
    chrome.runtime.sendMessage({ action: "getConfirmation" }, function(response) {
        console.log("SOMETHONG IS HAPPENING");
        if (response) {
            console.log("wawawawa");
            console.log(response.message); // <-- here first message received always
            document.getElementById("confirmationText").innerText = 
                `${response.message}`;
        } else {
            document.getElementById("confirmationText").innerText = "X Error fetching confirmation.";
        }
    });
});

// chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
//     if (request.action === "update_popup_msg") {
//         console.log("message received");
//         console.log(request.data);
//     }
// });