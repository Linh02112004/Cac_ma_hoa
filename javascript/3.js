function toggleButtons() {
    const mode = document.querySelector('input[name="mode"]:checked').value;
    document.getElementById('processButton').innerText = mode === 'encrypt' ? 'Mã hóa' : 'Giải mã';
    document.getElementById('fileInput').value = '';  // Reset file input
}

function gcd(a, b) {
    while (b) {
        [a, b] = [b, a % b];
    }
    return a;
}

function isCoprime(a, b) {
    return gcd(a, b) === 1;
}

function modInverse(a, m) {
    for (let i = 1; i < m; i++) {
        if ((a * i) % m === 1) {
            return i;
        }
    }
    return null;
}

function affineEncrypt(text, a, b) {
    let encryptedText = '';
    for (let char of text) {
        if (char.match(/[a-z]/i)) {
            const shift = char === char.toUpperCase() ? 65 : 97;
            encryptedText += String.fromCharCode((a * (char.charCodeAt(0) - shift) + b) % 26 + shift);
        } else {
            encryptedText += char;
        }
    }
    return encryptedText;
}

function affineDecrypt(text, a, b) {
    let decryptedText = '';
    const aInv = modInverse(a, 26);
    if (aInv === null) {
        return "Giá trị 'a' không coprime với 26.";
    }

    for (let char of text) {
        if (char.match(/[a-z]/i)) {
            const shift = char === char.toUpperCase() ? 65 : 97;
            decryptedText += String.fromCharCode((aInv * ((char.charCodeAt(0) - shift) - b + 26)) % 26 + shift);
        } else {
            decryptedText += char;
        }
    }
    return decryptedText;
}

async function processInput() {
    const textInput = document.getElementById('text').value;
    const fileInput = document.getElementById('fileInput');
    const a = parseInt(document.getElementById('a').value);
    const b = parseInt(document.getElementById('b').value);
    const errorMessage = document.getElementById('errorMessage');
    const resultArea = document.getElementById('result');
    errorMessage.textContent = '';

    let text = textInput;

    if (fileInput.files.length) {
        const file = fileInput.files[0];
        const fileType = file.name.split('.').pop().toLowerCase();

        if (['txt'].includes(fileType)) {
            text = await file.text();
        } else if (['jpg', 'jpeg', 'png'].includes(fileType)) {
            const arrayBuffer = await file.arrayBuffer();
            const byteArray = new Uint8Array(arrayBuffer);
            const key = a + b; // Sử dụng tổng để mã hóa

            const encryptedData = byteArray.map(byte => byte ^ key); // Mã hóa ảnh
            const blob = new Blob([encryptedData], { type: file.type });
            downloadFile(blob, 'encrypted_' + file.name);
            return; // Kết thúc hàm sau khi mã hóa file ảnh
        } else {
            errorMessage.textContent = "Định dạng file không hỗ trợ.";
            return;
        }
    } else if (!text) {
        errorMessage.textContent = "Vui lòng nhập văn bản hoặc chọn một file.";
        return;
    }

    if (!isCoprime(a, 26)) {
        errorMessage.textContent = "Giá trị 'a' và 26 không phải là số nguyên tố cùng nhau. Vui lòng nhập lại 'a'.";
        return;
    }

    let result;

    if (document.querySelector('input[name="mode"]:checked').value === 'encrypt') {
        result = affineEncrypt(text, a, b);
    } else {
        result = affineDecrypt(text, a, b);
    }

    resultArea.value = result;

    // Tạo file mới với kết quả
    const blob = new Blob([result], { type: 'text/plain' });
    downloadFile(blob, 'result.txt');
}

function downloadFile(blob, filename) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

// Khởi động chức năng ẩn/hiện nút
toggleButtons();
