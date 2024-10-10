def caesar_decrypt(ciphertext, shift):
    decrypted = ''
    for char in ciphertext:
        if char.isalpha():
            if char.islower():
                decrypted += chr((ord(char) - shift - ord('a')) % 26 + ord('a'))
            elif char.isupper():
                decrypted += chr((ord(char) - shift - ord('A')) % 26 + ord('A'))
        else:
            decrypted += char
    return decrypted

# Nhập chuỗi mã hóa từ người dùng
ciphertext = input("Nhập chuỗi mã hóa: ")

# Thử tất cả các giá trị khóa từ 0 đến 25
for shift in range(26):
    decrypted_message = caesar_decrypt(ciphertext, shift)
    print(f"Key {shift}: {decrypted_message}")