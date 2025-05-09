const TRACKER_DB_URL = chrome.runtime.getURL('assets/tracker-db.json');

let trackerDb = null;

async function loadTrackerDatabase() {
  const response = await fetch(TRACKER_DB_URL);
  trackerDb = await response.json();
  return trackerDb;
}

function isTrackerCookie(cookie) {
  if (!trackerDb) return false;
  
  const isDomainTracker = trackerDb.domains.some(domain => 
    cookie.domain.includes(domain) || 
    cookie.domain.endsWith('.' + domain)
  );
  
  const isNameTracker = trackerDb.patterns.some(pattern => 
    new RegExp(pattern).test(cookie.name)
  );
  
  return isDomainTracker || isNameTracker;
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ 
    blockAllTrackers: true,
    whitelist: []
  });
});

chrome.cookies.onChanged.addListener(async (changeInfo) => {
  const { blockAllTrackers, whitelist } = await chrome.storage.sync.get(['blockAllTrackers', 'whitelist']);
  
  if (!blockAllTrackers || whitelist.includes(changeInfo.cookie.domain)) return;
  
  if (!changeInfo.removed && isTrackerCookie(changeInfo.cookie)) {
    chrome.cookies.remove({
      url: `https://${changeInfo.cookie.domain}${changeInfo.cookie.path}`,
      name: changeInfo.cookie.name
    });
  }
});

// Инициализация базы данных трекеров
loadTrackerDatabase();