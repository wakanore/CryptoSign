export async function getSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(['blockAllTrackers', 'whitelist'], (result) => {
        resolve({
          blockAllTrackers: result.blockAllTrackers !== false,
          whitelist: result.whitelist || []
        });
      });
    });
  }
  
  export async function saveSettings(settings) {
    return new Promise((resolve) => {
      chrome.storage.sync.set(settings, () => {
        resolve();
      });
    });
  }
  
  export async function addToWhitelist(domain) {
    const { whitelist } = await getSettings();
    if (!whitelist.includes(domain)) {
      await saveSettings({
        whitelist: [...whitelist, domain]
      });
    }
  }
  
  export async function removeFromWhitelist(domain) {
    const { whitelist } = await getSettings();
    await saveSettings({
      whitelist: whitelist.filter(d => d !== domain)
    });
  }