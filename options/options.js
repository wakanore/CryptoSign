document.addEventListener('DOMContentLoaded', function() {
  // Загрузка сохраненных настроек
  chrome.storage.sync.get(['iterations', 'keySize'], function(data) {
    document.getElementById('iterations').value = data.iterations || 100000;
    document.getElementById('key-size').value = data.keySize || '256';
  });

  // Сохранение настроек
  document.getElementById('save-btn').addEventListener('click', function() {
    const iterations = parseInt(document.getElementById('iterations').value);
    const keySize = document.getElementById('key-size').value;
    
    chrome.storage.sync.set({
      iterations: iterations,
      keySize: keySize
    }, function() {
      const status = document.getElementById('status');
      status.textContent = 'Settings saved';
      setTimeout(() => status.textContent = '', 2000);
    });
  });
});