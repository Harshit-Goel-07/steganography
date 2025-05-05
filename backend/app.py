import io
import cv2
import numpy as np
from flask_cors import CORS
from flask import Flask, request, send_file, jsonify

app = Flask(__name__)
CORS(app, origins=["https://steganography-mu.vercel.app/"], methods=["GET", "POST"])


def encode_text(image_stream, text, passkey=""):
    if not text.strip():
        return None, "Text cannot be empty."

    file_bytes = np.asarray(bytearray(image_stream.read()), dtype=np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
    if img is None:
        return None, "Invalid image file."

    if passkey:
        text = passkey + "::" + text
    text += "\0"

    text_bits = ''.join(format(b, '08b') for b in text.encode('utf-8'))
    bit_array = np.array(list(map(int, text_bits)), dtype=np.uint8)

    flat_img = img.flatten()
    if len(bit_array) > len(flat_img):
        return None, "Text too large to encode in the image."

    flat_img[:len(bit_array)] = (flat_img[:len(bit_array)] & 0xFE) | bit_array
    img = flat_img.reshape(img.shape)

    _, buffer = cv2.imencode('.png', img)
    return io.BytesIO(buffer), None


def decode_text(image_stream, passkey=""):
    file_bytes = np.asarray(bytearray(image_stream.read()), dtype=np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
    if img is None:
        return None, "Invalid image file."

    flat_pixels = img.flatten()
    lsb_array = flat_pixels & 1
    bits = ''.join(map(str, lsb_array))

    decoded = ""
    for i in range(0, len(bits), 8):
        byte = bits[i:i+8]
        if len(byte) < 8:
            continue
        char = chr(int(byte, 2))
        if char == "\0":
            break
        decoded += char

    if "::" in decoded:
        stored_passkey, actual_text = decoded.split("::", 1)
        if passkey:
            if stored_passkey == passkey:
                return actual_text, None
            return None, "Incorrect passkey provided."
        return None, "This image is passkey-protected. Passkey required."
    return decoded, None


@app.route("/encode", methods=["POST"])
def api_encode():
    if "image" not in request.files or "text" not in request.form:
        return jsonify({"error": "Image and text are required."}), 400

    image = request.files["image"]
    text = request.form["text"]
    passkey = request.form.get("passkey", "")
    encoded_io, err = encode_text(image, text, passkey)
    if err:
        return jsonify({"error": err}), 400
    return send_file(encoded_io, mimetype="image/png", download_name="encoded.png")


@app.route("/decode", methods=["POST"])
def api_decode():
    if "image" not in request.files:
        return jsonify({"error": "Image is required."}), 400

    image = request.files["image"]
    passkey = request.form.get("passkey", "")
    text, err = decode_text(image, passkey)
    if err:
        return jsonify({"error": err}), 400
    return jsonify({"text": text})


@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok"}), 200


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
