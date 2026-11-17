(() => {
  chrome.runtime.sendMessage({toolkit: 'page'}, response => {
    if (chrome.runtime.lastError || !response?.ok) return;
    window.dispatchEvent(new CustomEvent('proxy-toolkit-config', {detail: JSON.stringify(response.value)}));
  });
})();
