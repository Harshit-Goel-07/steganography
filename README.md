# 🕵️‍♂️ Steganography Tool

A web-based steganography tool that allows you to **hide secret messages inside images** (encryption) and **extract hidden text** from images (decryption). The project uses **HTML, CSS (Tailwind), JavaScript for frontend**, and a **Flask + OpenCV-powered backend**.

> 🛡️ Optional passkey-based encryption for enhanced security.

---

## 🔗 Live Demo

🚀 [Try the App](https://steganography-8mfr.onrender.com)

---

## 📸 Features

* 🔐 Hide (encode) text inside image files securely.
* 🧾 Extract (decode) text from images.
* 🔑 Optional passkey support for added message protection.
* 💻 Intuitive & responsive UI built using Tailwind CSS.
* 📤 Download the image after encoding.
* 🧠 Backend powered by Python, Flask, and OpenCV.

---

## 🧪 Technologies Used

### Frontend

* HTML5
* Tailwind CSS
* JavaScript (Vanilla)

### Backend

* Python
* Flask
* OpenCV
* NumPy
* CORS (Flask-CORS)

---

## 🛠️ Project Structure

```
📁 steganography-project/
│
├── 📁 frontend/
│   ├── index.html
│   ├── app.js
│   └── styles (via Tailwind CDN)
│
├── 📁 backend/
│   ├── main.py (Flask server)
│
├── requirements.txt
└── README.md
```

---

## 🧪 How It Works

### 🔐 Encoding Process

1. User uploads an image.
2. User inputs the secret text.
3. Optionally adds a passkey.
4. Server encodes the message inside the image pixels.
5. Encoded image is sent back for download.

### 🔓 Decoding Process

1. User uploads the stego-image.
2. Optionally enters the passkey.
3. Server extracts the hidden message.
4. Decoded text is displayed to the user.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/steganography-project.git
cd steganography-project
```

### 2. Backend Setup (Python)

```bash
cd backend
pip install -r requirements.txt
python main.py
```

### 3. Frontend

Open `frontend/index.html` in your browser or serve using Python/Live Server.

---

## 📝 API Endpoints

* `POST /encode`
  → Accepts `image`, `text`, and optional `passkey` → Returns encoded image.

* `POST /decode`
  → Accepts `image` and optional `passkey` → Returns extracted text.

---

## 🧪 Example Use Cases

* Hide secret messages inside memes.
* Secure communication in images.
* Educational projects related to cryptography/steganography.

---

## 🧑‍💻 Author

**Harshit Goel**
| 📫 [goyalharshit2608@gmail.com](mailto:goyalharshit2608@gmail.com) | 🧑‍🎓 CSE Student at UPES, Dehradun

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
