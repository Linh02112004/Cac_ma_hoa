import hashlib

# Sử dụng hàm băm
def hash_md5(input_string):
    md5_hash = hashlib.md5(input_string.encode()).hexdigest()
    return md5_hash

def hamming_distance(hash1, hash2):
    """Tính khoảng cách Hamming giữa hai giá trị băm."""
    # Chuyển đổi các ký tự hex sang nhị phân
    bin1 = bin(int(hash1, 16))[2:].zfill(128)  # MD5 sản xuất 128 bit
    bin2 = bin(int(hash2, 16))[2:].zfill(128)

    # Tính số bit khác nhau
    distance = sum(bit1 != bit2 for bit1, bit2 in zip(bin1, bin2))
    return distance

def main():
    # Nhập chuỗi văn bản từ người dùng
    input_string1 = input("Nhập chuỗi văn bản thứ nhất để băm MD5: ")
    input_string2 = input("Nhập chuỗi văn bản thứ hai để băm MD5: ")

    # Tính giá trị băm MD5
    hash1 = hash_md5(input_string1)
    hash2 = hash_md5(input_string2)

    # Tính khoảng cách Hamming
    distance = hamming_distance(hash1, hash2)

    # In kết quả
    print(f"Giá trị băm MD5 của chuỗi 1: {hash1}")
    print(f"Giá trị băm MD5 của chuỗi 2: {hash2}")
    print(f"Số bit sai khác: {distance}")

# Gọi hàm main
if __name__ == "__main__":
    main()