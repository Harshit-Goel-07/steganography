async function handleEncryptionSubmit(event) {
  event.preventDefault();
  const submitBtn = document.getElementById("encryptSubmitBtn");
  submitBtn.disabled = true;
  submitBtn.innerText = "Encrypting...";

  const imageInput = document.getElementById("imageUploadEncrypt").files[0];
  const textInput = document.getElementById("textToEncode").value;
  const passkeyInput = document.getElementById("encryptPasskey").value;
  console.log(imageInput, textInput, passkeyInput);

  if (!imageInput || !textInput) {
    alert("Upload an image and enter text.");
    submitBtn.disabled = false;
    submitBtn.innerText = "Submit";
    return;
  }

  const formData = new FormData();
  formData.append("image", imageInput);
  formData.append("text", textInput);
  formData.append("passkey", passkeyInput);

  const res = await fetch("https://steganography-8mfr.onrender.com/encode", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    alert("Error: " + err.error);
    submitBtn.disabled = false;
    submitBtn.innerText = "Submit";
    return;
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "encoded.png";
  a.click();
  URL.revokeObjectURL(url);

  submitBtn.disabled = false;
  submitBtn.innerText = "Submit";
}

function handleEncryptionUpload() {
  const imageInput = document.getElementById("imageUploadEncrypt");
  const container = document.getElementById("imagePreviewEncryptContainer");
  container.style.display = "block";
  const imagePreview = document.getElementById("imagePreviewEncrypt");
  imagePreview.src = URL.createObjectURL(imageInput.files[0]);
}




async function handleDecryptionSubmit(event) {
  event.preventDefault();

  const submitBtn = document.getElementById("decryptSubmitBtn");
  submitBtn.disabled = true;
  submitBtn.innerText = "Decrypting...";

  const imageInput = event.target.querySelector('input[type="file"]').files[0];
  const passkeyInput = event.target.querySelector('input[type="password"]').value;
  const outputTextarea = event.target.querySelector('textarea');

  if (!imageInput) {
    alert("Please upload an image.");
    submitBtn.disabled = false;
    submitBtn.innerText = "Submit";
    return;
  }

  const formData = new FormData();
  formData.append("image", imageInput);
  formData.append("passkey", passkeyInput);

  try {
    const res = await fetch("https://steganography-8mfr.onrender.com/decode", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      alert("Error: " + err.error);
    } else {
      const data = await res.json();
      outputTextarea.value = data.text || "No hidden text found.";
    }
  } catch (error) {
    console.error(error);
    alert("An unexpected error occurred.");
  }

  submitBtn.disabled = false;
  submitBtn.innerText = "Submit";
}


function handleDecryptionUpload() {
  const imageInput = document.getElementById("imageUploadDecrypt");
  const container = document.getElementById("imagePreviewDecryptContainer");
  container.style.display = "block";
  const imagePreview = document.getElementById("imagePreviewDecrypt");
  imagePreview.src = URL.createObjectURL(imageInput.files[0]);
}
