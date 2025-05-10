console.log('Tracker Blocker content script loaded');


document.addEventListener('DOMContentLoaded', () => {
  const trackerScripts = [
    'google-analytics.com/analytics.js',
    'googletagmanager.com/gtm.js',
    'connect.facebook.net/en_US/fbevents.js'
  ];
  
  trackerScripts.forEach(src => {
    const scripts = document.querySelectorAll(`script[src*="${src}"]`);
    if (scripts.length > 0) {
      console.log(`Detected tracker script: ${src}`);
    }
  });
});