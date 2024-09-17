const substitutionMap = {
    'A': 'D', 'B': 'E', 'C': 'F', 'D': 'G', 'E': 'H',
    'F': 'I', 'G': 'J', 'H': 'K', 'I': 'L', 'J': 'M',
    'K': 'N', 'L': 'O', 'M': 'P', 'N': 'Q', 'O': 'R',
    'P': 'S', 'Q': 'T', 'R': 'U', 'S': 'V', 'T': 'W',
    'U': 'X', 'V': 'Y', 'W': 'Z', 'X': 'A', 'Y': 'B',
    'Z': 'C'
};

function substituteEncrypt(text) {
    return text.split('').map(char => {
        return substitutionMap[char.toUpperCase()] || char; // Giữ nguyên ký tự không phải chữ cái
    }).join('');
}

function substituteDecrypt(text) {
    const reverseMap = Object.fromEntries(
        Object.entries(substitutionMap).map(([key, value]) => [value, key])
    );

    return text.split('').map(char => {
        return reverseMap[char.toUpperCase()] || char; // Giữ nguyên ký tự không phải chữ cái
    }).join('');
}

let processedBlob;
let isImage = false;

async function processInput() {
    const textInput = document.getElementById('inputText').value;
    const fileInput = document.getElementById('fileInput');
    const errorMessage = document.getElementById('errorMessage');
    const resultArea = document.getElementById('result');

    errorMessage.textContent = '';

    if (fileInput.files.length) {
        const file = fileInput.files[0];
        const fileType = file.name.split('.').pop().toLowerCase();

        if (fileType === 'txt') {
            const text = await file.text();
            const mode = document.querySelector('input[name="mode"]:checked').value;
            const result = mode === 'encrypt' ? substituteEncrypt(text) : substituteDecrypt(text);
            resultArea.value = result;

            // Tạo Blob từ kết quả văn bản
            processedBlob = new Blob([result], { type: 'text/plain' });
            isImage = false;

        } else if (['jpg', 'jpeg', 'png'].includes(fileType)) {
            const arrayBuffer = await file.arrayBuffer();
            const byteArray = new Uint8Array(arrayBuffer);
            const key = 123; // Khóa mã hóa đơn giản
            let processedData;

            if (document.querySelector('input[name="mode"]:checked').value === 'encrypt') {
                processedData = byteArray.map(byte => byte ^ key); // Mã hóa ảnh
                resultArea.value = "File hình ảnh đã được mã hóa.";
            } else {
                processedData = byteArray.map(byte => byte ^ key); // Giải mã ảnh
                resultArea.value = "File hình ảnh đã được giải mã.";
            }

            // Tạo Blob từ dữ liệu đã xử lý
            processedBlob = new Blob([processedData], { type: file.type });
            isImage = true;
        } else {
            errorMessage.textContent = "Định dạng file không hỗ trợ.";
            return;
        }

        // Hiện nút lưu file
        document.getElementById('saveButton').style.display = 'block';
        document.getElementById('saveDialog').style.display = 'block';
        return; // Kết thúc hàm
    }

    if (!textInput) {
        errorMessage.textContent = "Vui lòng nhập văn bản hoặc chọn một file.";
        return;
    }
}

function showSaveDialog() {
    document.getElementById('saveDialog').style.display = 'block';
}

function saveToFile() {
    const fileName = document.getElementById('fileName').value || 'result';
    const link = document.createElement('a');
    link.href = URL.createObjectURL(processedBlob);
    link.download = `${fileName}${isImage ? '' : '.txt'}`; // Đặt đuôi file cho văn bản
    link.click();
    document.getElementById('saveDialog').style.display = 'none'; // Ẩn hộp thoại sau khi lưu
}