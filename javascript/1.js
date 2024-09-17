let resultData = '';
        let isImageFile = false; // Biến kiểm tra xem file được chọn có phải là hình ảnh không
        let originalImageFile = null; // Biến lưu trữ file hình ảnh gốc

        function toggleMode() {
            const mode = document.querySelector('input[name="mode"]:checked').value;
            document.getElementById('processButton').innerText = mode === 'encrypt' ? 'Mã hóa' : 'Giải mã';
        }

        function caesarEncrypt(text, shift) {
            let encryptedText = '';
            for (let char of text) {
                if (char.match(/[a-z]/i)) {
                    const shiftBase = char === char.toUpperCase() ? 65 : 97;
                    encryptedText += String.fromCharCode(((char.charCodeAt(0) - shiftBase + shift) % 26) + shiftBase);
                } else {
                    encryptedText += char;
                }
            }
            return encryptedText;
        }

        function caesarDecrypt(text, shift) {
            return caesarEncrypt(text, 26 - (shift % 26)); // Giải mã bằng cách dịch ngược
        }

        async function processInput() {
            const fileInput = document.getElementById('fileInput');
            const shift = parseInt(document.getElementById('shift').value);
            const errorMessage = document.getElementById('errorMessage');
            const resultArea = document.getElementById('result');
            const textInput = document.getElementById('inputText').value;
            errorMessage.textContent = '';

            // Chỉ xóa ô nhập văn bản khi nhấn "Xử lý"
            if (textInput.trim() !== '') {
                document.getElementById('inputText').value = '';
            }

            if (fileInput.files.length) {
                const file = fileInput.files[0];
                const fileType = file.name.split('.').pop().toLowerCase();

                if (fileType === 'txt') {
                    const fileContent = await file.text();
                    isImageFile = false;
                    originalImageFile = null; // Không có file hình ảnh
                    resultData = (document.querySelector('input[name="mode"]:checked').value === 'encrypt')
                        ? caesarEncrypt(fileContent, shift)
                        : caesarDecrypt(fileContent, shift);
                } else if (['jpg', 'jpeg', 'png'].includes(fileType)) {
                    isImageFile = true;
                    originalImageFile = file; // Lưu trữ file hình ảnh gốc

                    // Chuyển đổi file hình ảnh sang base64 để mã hóa
                    const reader = new FileReader();
                    reader.onload = function() {
                        const base64String = reader.result.split(',')[1]; // Lấy phần base64
                        resultData = (document.querySelector('input[name="mode"]:checked').value === 'encrypt')
                            ? btoa(base64String) // Mã hóa base64
                            : atob(base64String); // Giải mã base64
                        resultArea.value = resultData;
                        document.getElementById('saveButton').style.display = 'block'; // Hiện nút lưu
                    };
                    reader.readAsDataURL(file);
                    return;
                } else {
                    errorMessage.textContent = "Định dạng file không hỗ trợ.";
                    return;
                }
            } else if (textInput.trim() === '') {
                errorMessage.textContent = "Vui lòng nhập văn bản hoặc chọn một file.";
                return;
            } else {
                isImageFile = false; // Không phải file hình ảnh
                resultData = (document.querySelector('input[name="mode"]:checked').value === 'encrypt')
                    ? caesarEncrypt(textInput, shift)
                    : caesarDecrypt(textInput, shift);
            }

            document.getElementById('result').value = resultData;
            document.getElementById('saveButton').style.display = 'block'; // Hiện nút lưu
        }

        async function saveFile() {
            const fileName = prompt("Nhập tên file để lưu (không cần đuôi mở rộng):", "result");
            if (fileName) {
                const fileInput = document.getElementById('fileInput');
                const fileType = fileInput.files.length ? fileInput.files[0].name.split('.').pop().toLowerCase() : 'txt';

                if (isImageFile && originalImageFile) {
                    const blob = new Blob([resultData], { type: 'text/plain' }); // Lưu file base64 dưới dạng văn bản
                    downloadFile(blob, `${fileName}.${fileType}`); // Lưu với đúng đuôi file
                } else {
                    const blob = new Blob([resultData], { type: 'text/plain' });
                    downloadFile(blob, `${fileName}.txt`);
                }
            }
        }

        function downloadFile(blob, filename) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
        }
