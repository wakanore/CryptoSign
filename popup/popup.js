document.addEventListener('DOMContentLoaded', function() {
  // Переключение между вкладками
  const tabs = document.querySelectorAll('.tab-button');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');
    });
  });

  // Генерация QR-кода
  document.getElementById('generate-btn').addEventListener('click', async () => {
    const data = document.getElementById('input-data').value;
    const password = document.getElementById('encrypt-password').value;
    
    if (!data || !password) {
      alert('Please enter data and password');
      return;
    }
    
    try {
      const response = await chrome.runtime.sendMessage({
        action: "encrypt",
        data: data,
        password: password
      });
      
      if (response.success) {
        const qrContainer = document.getElementById('qr-container');
        qrContainer.innerHTML = '';
        
        // Генерация QR-кода
        QRCode.toCanvas(document.getElementById('qr-canvas'), JSON.stringify(response.data), {
          width: 200,
          errorCorrectionLevel: 'H'
        }, function(error) {
          if (error) {
            console.error(error);
            alert('QR generation failed');
          } else {
            qrContainer.appendChild(document.getElementById('qr-canvas'));
            document.getElementById('qr-canvas').style.display = 'block';
          }
        });
      } else {
        alert(`Encryption failed: ${response.error}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  });

  // Декодирование QR-кода
  document.getElementById('decode-btn').addEventListener('click', async () => {
    const fileInput = document.getElementById('qr-file');
    const password = document.getElementById('decrypt-password').value;
    
    if (!fileInput.files.length || !password) {
      alert('Please select QR image and enter password');
      return;
    }
    
    try {
      // Здесь должна быть реализация чтения QR-кода из изображения
      // Для простоты предположим, что мы получаем данные
      const qrData = await readQRFromImage(fileInput.files[0]);
      const encryptedData = JSON.parse(qrData);
      
      const response = await chrome.runtime.sendMessage({
        action: "decrypt",
        data: encryptedData,
        password: password
      });
      
      if (response.success) {
        document.getElementById('decoded-result').textContent = response.data;
      } else {
        alert(`Decryption failed: ${response.error}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  });
});

// Функция для чтения QR-кода из изображения (заглушка)
async function readQRFromImage(file) {
  // В реальной реализации здесь должен быть код для декодирования QR
  // Например, с использованием библиотеки jsQR
  return new Promise((resolve, reject) => {
    // Заглушка для демонстрации
    const reader = new FileReader();
    reader.onload = () => {
      // В реальном приложении здесь анализируется изображение
      resolve('{"ciphertext":[1,2,3],"iv":[4,5,6],"salt":[7,8,9]}');
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}