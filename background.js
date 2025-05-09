// background.js
async function isTrackerCookie(cookie) {
    const { hashedTrackerDb, trackerDb } = await loadTrackerDatabase();
    const hashedName = await hashString(cookie.name);
    
    // Быстрая проверка по хешам
    const isNameTracker = hashedTrackerDb.patterns.some(hashedPattern => {
      const originalPattern = trackerDb.patterns[hashedTrackerDb.patterns.indexOf(hashedPattern)];
      return new RegExp(originalPattern).test(cookie.name);
    });
    
    if (isNameTracker) return true;
    
    // Проверка домена
    const hashedDomain = await hashString(cookie.domain);
    return hashedTrackerDb.domains.some(hashedTrackerDomain => 
      hashedDomain === hashedTrackerDomain || 
      cookie.domain.endsWith('.' + trackerDb.domains[hashedTrackerDb.domains.indexOf(hashedTrackerDomain)])
    );
  }