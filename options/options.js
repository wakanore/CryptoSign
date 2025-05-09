document.addEventListener('DOMContentLoaded', async () => {
    const blockAllCheckbox = document.getElementById('block-all');
    const whitelistInput = document.getElementById('whitelist-input');
    const addWhitelistBtn = document.getElementById('add-whitelist');
    const whitelistItems = document.getElementById('whitelist-items');
    const saveSettingsBtn = document.getElementById('save-settings');
  
    // Load current settings
    const { blockAllTrackers = true, whitelist = [] } = await chrome.storage.sync.get(['blockAllTrackers', 'whitelist']);
    
    blockAllCheckbox.checked = blockAllTrackers;
    renderWhitelist(whitelist);
  
    // Event listeners
    addWhitelistBtn.addEventListener('click', addToWhitelist);
    saveSettingsBtn.addEventListener('click', saveSettings);
  
    function renderWhitelist(domains) {
      whitelistItems.innerHTML = '';
      
      if (domains.length === 0) {
        whitelistItems.innerHTML = '<li>No whitelisted domains</li>';
        return;
      }
      
      domains.forEach(domain => {
        const li = document.createElement('li');
        li.innerHTML = `
          <span>${domain}</span>
          <button data-domain="${domain}">Remove</button>
        `;
        whitelistItems.appendChild(li);
      });
      
      // Add event listeners to remove buttons
      document.querySelectorAll('#whitelist-items button').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const domain = e.target.getAttribute('data-domain');
          removeFromWhitelist(domain);
        });
      });
    }
  
    function addToWhitelist() {
      const domain = whitelistInput.value.trim();
      if (!domain) return;
      
      chrome.storage.sync.get(['whitelist'], (result) => {
        const currentWhitelist = result.whitelist || [];
        if (!currentWhitelist.includes(domain)) {
          const updatedWhitelist = [...currentWhitelist, domain];
          chrome.storage.sync.set({ whitelist: updatedWhitelist });
          renderWhitelist(updatedWhitelist);
          whitelistInput.value = '';
        }
      });
    }
  
    function removeFromWhitelist(domain) {
      chrome.storage.sync.get(['whitelist'], (result) => {
        const currentWhitelist = result.whitelist || [];
        const updatedWhitelist = currentWhitelist.filter(d => d !== domain);
        chrome.storage.sync.set({ whitelist: updatedWhitelist });
        renderWhitelist(updatedWhitelist);
      });
    }
  
    async function saveSettings() {
      await chrome.storage.sync.set({
        blockAllTrackers: blockAllCheckbox.checked
      });
      
      // Show confirmation
      saveSettingsBtn.textContent = 'Saved!';
      setTimeout(() => {
        saveSettingsBtn.textContent = 'Save Settings';
      }, 2000);
    }
  });