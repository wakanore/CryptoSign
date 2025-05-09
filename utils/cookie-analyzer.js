let trackerDb = null;

async function loadTrackerDatabase() {
  if (!trackerDb) {
    const response = await fetch(chrome.runtime.getURL('assets/tracker-db.json'));
    trackerDb = await response.json();
  }
  return trackerDb;
}

export async function isTrackerCookie(cookie) {
  const db = await loadTrackerDatabase();
  
  // Check domain
  const isDomainTracker = db.domains.some(domain => {
    return cookie.domain === domain || 
           cookie.domain.endsWith('.' + domain);
  });
  
  if (isDomainTracker) return true;
  
  // Check name patterns
  const isNameTracker = db.patterns.some(pattern => {
    const regex = new RegExp(pattern);
    return regex.test(cookie.name);
  });
  
  return isNameTracker;
}

export async function analyzeCookies(cookies) {
  const trackerCookies = [];
  
  for (const cookie of cookies) {
    if (await isTrackerCookie(cookie)) {
      trackerCookies.push(cookie);
    }
  }
  
  return {
    trackerCookies,
    totalCookies: cookies.length
  };
}