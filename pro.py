import tkinter as tk
from tkinter import filedialog, messagebox
from PIL import Image, ImageTk
import cv2
import numpy as np

# Function to open and display image
def open_image():
    global img, file_path
    file_path = filedialog.askopenfilename(filetypes=[("PNG files", "*.png")])
    if not file_path:
        return
    img = cv2.imread(file_path)
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img_pil = Image.fromarray(img_rgb)
    img_pil.thumbnail((300, 300))
    img_tk = ImageTk.PhotoImage(img_pil)
    image_label.config(image=img_tk)
    image_label.image = img_tk

# Function to encode text into an image
def encode_text():
    global img, file_path
    if img is None:
        messagebox.showerror("Error", "No image selected!")
        return
    
    text = text_entry.get("1.0", tk.END).strip()
    passkey = passkey_entry.get().strip()
    
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
    
    save_path = filedialog.asksaveasfilename(defaultextension=".png", filetypes=[("PNG files", "*.png")])
    if save_path:
        cv2.imwrite(save_path, img)
        messagebox.showinfo("Success", "Text successfully encoded into image!")

# Function to decode text from an image
def decode_text():
    global img, file_path
    open_image()  # Load the image
    if img is None:
        return
    
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
    
    passkey = passkey_entry.get().strip()
    if "::" in decoded_text:
        stored_passkey, actual_text = decoded_text.split("::", 1)
        if passkey and stored_passkey == passkey:
            text_display.config(state=tk.NORMAL)
            text_display.delete("1.0", tk.END)
            text_display.insert(tk.END, actual_text)
            text_display.config(state=tk.DISABLED)
        elif passkey:
            messagebox.showerror("Error", "Incorrect passkey!")
        else:
            messagebox.showinfo("Decoded Text", "Passkey required to view message.")
    else:
        text_display.config(state=tk.NORMAL)
        text_display.delete("1.0", tk.END)
        text_display.insert(tk.END, decoded_text)
        text_display.config(state=tk.DISABLED)

# GUI Setup
root = tk.Tk()
root.title("Steganography Tool")
root.geometry("500x600")

# Image Display
image_label = tk.Label(root)
image_label.pack()

# Open Image Button
open_button = tk.Button(root, text="Open Image", command=open_image)
open_button.pack()

# Text Input
label = tk.Label(root, text="Enter text to encode:")
label.pack()
text_entry = tk.Text(root, height=5, width=40)
text_entry.pack()

# Passkey Input
passkey_label = tk.Label(root, text="Enter passkey (optional):")
passkey_label.pack()
passkey_entry = tk.Entry(root, show="*")
passkey_entry.pack()

# Encode Button
encode_button = tk.Button(root, text="Encode Text into Image", command=encode_text)
encode_button.pack()

# Decode Button
decode_button = tk.Button(root, text="Decode Text from Image", command=decode_text)
decode_button.pack()

# Decoded Text Display
text_display = tk.Text(root, height=5, width=40, state=tk.DISABLED)
text_display.pack()

# Run Application
root.mainloop()
