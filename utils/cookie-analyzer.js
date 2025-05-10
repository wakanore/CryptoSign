const encoder = new TextEncoder();

async function hashString(str) {
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

let trackerDb = null;
let hashedTrackerDb = null; // Кэшируем хеши трекеров

async function loadTrackerDatabase() {
  if (!trackerDb) {
    const response = await fetch(chrome.runtime.getURL('assets/tracker-db.json'));
    trackerDb = await response.json();
    
    // Хешируем все шаблоны и домены при загрузке
    hashedTrackerDb = {
      domains: await Promise.all(trackerDb.domains.map(domain => hashString(domain))),
      patterns: await Promise.all(trackerDb.patterns.map(pattern => hashString(pattern)))
    };
  }
  return { trackerDb, hashedTrackerDb };
}

export async function isTrackerCookie(cookie) {
  const { trackerDb, hashedTrackerDb } = await loadTrackerDatabase();
  
  // Хешируем имя и домен cookie
  const [hashedDomain, hashedName] = await Promise.all([
    hashString(cookie.domain),
    hashString(cookie.name)
  ]);
  
  // Проверяем домен
  const isDomainTracker = hashedTrackerDb.domains.some(hashedTrackerDomain => 
    hashedDomain === hashedTrackerDomain || 
    cookie.domain.endsWith('.' + trackerDb.domains[hashedTrackerDb.domains.indexOf(hashedTrackerDomain)])
  );
  
  if (isDomainTracker) return true;
  
  // Проверяем имя по шаблонам
  const isNameTracker = hashedTrackerDb.patterns.some(hashedPattern => {
    const originalPattern = trackerDb.patterns[hashedTrackerDb.patterns.indexOf(hashedPattern)];
    const regex = new RegExp(originalPattern);
    return regex.test(cookie.name);
  });
  
  return isNameTracker;
}