document.addEventListener("DOMContentLoaded", async () => {
        const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
        const test = await chrome.runtime.sendMessage({ action: "trigger_script", tab_id: tab.id, url: tab.url});
        setTimeout(() => {
            chrome.runtime.sendMessage({ action: "get_result" }, (response) => {
                console.log("Popup got result:", response);
                const el = document.getElementById("result");
                if (response) {
                    el.textContent = response;
                } else {
                    el.textContent = "No result received.";
                }
            });
        }, 4000);
});