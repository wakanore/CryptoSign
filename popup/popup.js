document.addEventListener('DOMContentLoaded', async () => {
    const toggle = document.getElementById('toggle-blocking');
    const statusText = document.getElementById('status-text');
    const scanBtn = document.getElementById('scan-now');
    const removeAllBtn = document.getElementById('remove-all');
    const trackerList = document.getElementById('tracker-list');
    const totalCookiesEl = document.getElementById('total-cookies');
    const trackerCookiesEl = document.getElementById('tracker-cookies');
  
    
    const { blockAllTrackers } = await chrome.storage.sync.get('blockAllTrackers');
    toggle.checked = blockAllTrackers !== false;
    updateStatusText(toggle.checked);
  
    
    toggle.addEventListener('change', handleToggleChange);
    scanBtn.addEventListener('click', scanCookies);
    removeAllBtn.addEventListener('click', removeAllTrackers);
  
    
    await scanCookies();
  
    function updateStatusText(isActive) {
      statusText.textContent = isActive ? 'Active' : 'Inactive';
      statusText.style.color = isActive ? '#2ecc71' : '#e74c3c';
    }
  
    async function handleToggleChange(e) {
      const isActive = e.target.checked;
      await chrome.storage.sync.set({ blockAllTrackers: isActive });
      updateStatusText(isActive);
    }
  
    async function scanCookies() {
      const cookies = await chrome.cookies.getAll({});
      const trackers = cookies.filter(cookie => isTrackerCookie(cookie));
      
      totalCookiesEl.textContent = cookies.length;
      trackerCookiesEl.textContent = trackers.length;
      
      displayTrackers(trackers);
    }
  
    function isTrackerCookie(cookie) {
      
      
      const trackerDomains = ['google-analytics.com', 'facebook.com', 'doubleclick.net'];
      const trackerPatterns = [/^_ga/, /^_gid/, /^fbp/];
      
      return trackerDomains.some(domain => cookie.domain.includes(domain)) ||
             trackerPatterns.some(pattern => pattern.test(cookie.name));
    }
  
    function displayTrackers(trackers) {
      if (trackers.length === 0) {
        trackerList.innerHTML = '<div class="empty-state">No trackers found</div>';
        return;
      }
  
      trackerList.innerHTML = '';
      trackers.forEach(tracker => {
        const item = document.createElement('div');
        item.className = 'tracker-item';
        item.innerHTML = `
          <div>
            <div class="tracker-name">${tracker.name}</div>
            <div class="tracker-domain">${tracker.domain}</div>
          </div>
          <button class="remove-btn" data-name="${tracker.name}" data-domain="${tracker.domain}">Remove</button>
        `;
        trackerList.appendChild(item);
      });
  
      
      document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const name = e.target.getAttribute('data-name');
          const domain = e.target.getAttribute('data-domain');
          await chrome.cookies.remove({
            url: `https://${domain}`,
            name: name
          });
          await scanCookies();
        });
      });
    }
  
    async function removeAllTrackers() {
      const cookies = await chrome.cookies.getAll({});
      const trackers = cookies.filter(cookie => isTrackerCookie(cookie));
      
      for (const tracker of trackers) {
        await chrome.cookies.remove({
          url: `https://${tracker.domain}`,
          name: tracker.name
        });
      }
      
      await scanCookies();
    }
  });