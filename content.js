// Этот скрипт может использоваться для обнаружения трекеров в реальном времени
// на веб-страницах, но в данном проекте основная логика реализована в background.js

console.log('Tracker Blocker content script loaded');

// Можно добавить обработку событий на странице, если нужно
document.addEventListener('DOMContentLoaded', () => {
  // Например, проверка наличия известных трекерных скриптов
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