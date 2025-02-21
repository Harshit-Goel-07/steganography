import cv2
import numpy as np
from PIL import Image

# Function to encode text into an image
def encode_text(image_path, text, passkey=""):
    img = cv2.imread(image_path)
    if img is None:
        return "Error: Image not found!"
    
    if passkey:
        text = passkey + "::" + text
    
    text += "\0"  # Add null character to indicate end of message
    text_bytes = text.encode('utf-8')
    text_bits = ''.join(format(byte, '08b') for byte in text_bytes)
    
    rows, cols, _ = img.shape
    bit_idx = 0
    for row in range(rows):
        for col in range(cols):
            for channel in range(3):
                if bit_idx < len(text_bits):
                    img[row, col, channel] = (img[row, col, channel] & ~1) | int(text_bits[bit_idx])
                    bit_idx += 1
    
    valid_extensions = (".png", ".jpg", ".jpeg")
    encoded_image_path = input("Enter the output filename (with extension .png, .jpg, or .jpeg): ").strip()

    # Ensure user provides a valid extension
    if not encoded_image_path.lower().endswith(valid_extensions):
        print("Invalid file format! Please use .png, .jpg, or .jpeg.")
        return "Error: Invalid file format!"

    cv2.imwrite(encoded_image_path, img)
    return encoded_image_path

# Function to decode text from an image
def decode_text(image_path, passkey=""):
    img = cv2.imread(image_path)
    if img is None:
        return "Error: Image not found!"
    
    text_bits = ""
    for row in img:
        for pixel in row:
            for channel in pixel:
                text_bits += str(channel & 1)
    
    text_bytes = [text_bits[i:i+8] for i in range(0, len(text_bits), 8)]
    
    decoded_text = ""
    for byte in text_bytes:
        char = chr(int(byte, 2))
        if char == "\0":  # Stop decoding at the NULL character
            break
        decoded_text += char
    
    if "::" in decoded_text:
        stored_passkey, actual_text = decoded_text.split("::", 1)
        if passkey and stored_passkey == passkey:
            return actual_text
        elif passkey:
            return "Error: Incorrect passkey!"
        else:
            return "Error: Passkey required to view message."
    
    return decoded_text
