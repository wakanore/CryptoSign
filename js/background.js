// Обработчик сообщений между компонентами расширения
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "encrypt") {
    importScripts('js/crypto.js');
    encryptData(request.data, request.password)
      .then(encrypted => sendResponse({success: true, data: encrypted}))
      .catch(error => sendResponse({success: false, error: error.message}));
    return true; // Необходимо для асинхронного ответа
  }
  
  if (request.action === "decrypt") {
    importScripts('js/crypto.js');
    decryptData(request.data, request.password)
      .then(decrypted => sendResponse({success: true, data: decrypted}))
      .catch(error => sendResponse({success: false, error: error.message}));
    return true;
  }
});