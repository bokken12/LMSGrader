// var app = chrome.runtime.getBackgroundPage();

function enable() {
  chrome.tabs.executeScript({
    file: 'enable.js'
  }); 
}

function disable() {
  chrome.tabs.executeScript({
    file: 'disable.js'
  }); 
}

document.getElementById('enable').addEventListener('click', enable);
document.getElementById('disable').addEventListener('click', disable);