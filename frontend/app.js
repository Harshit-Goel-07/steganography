async function handleEncryptionSubmit(event) {
  event.preventDefault();
  const imageInput = document.getElementById("imageUploadEncrypt").files[0];
  const textInput = document.getElementById("textToEncode").value;
  const passkeyInput = document.getElementById("encryptPasskey").value;
  console.log(imageInput, textInput, passkeyInput);
  if (!imageInput || !textInput) {
    alert("Upload an image and enter text.");
    return;
  }
  const formData = new FormData();
  formData.append("image", imageInput);
  formData.append("text", textInput);
  formData.append("passkey", passkeyInput);
  const res = await fetch("https://steganography-z1yi.onrender.com/encode", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    alert("Error: " + err.error);
    return;
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "encoded.png";
  a.click();
  URL.revokeObjectURL(url);
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
  const imageInput = event.target.querySelector('input[type="file"]').files[0];
  const passkeyInput = event.target.querySelector('input[type="password"]').value;
  const outputTextarea = event.target.querySelector('textarea');

  if (!imageInput) {
    alert("Please upload an image.");
    return;
  }

  const formData = new FormData();
  formData.append("image", imageInput);
  formData.append("passkey", passkeyInput);

  try {
    const res = await fetch("https://steganography-z1yi.onrender.com/decode", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      alert("Error: " + err.error);
      return;
    }

    const data = await res.json();
    outputTextarea.value = data.text || "No hidden text found.";
  } catch (error) {
    console.error(error);
    alert("An unexpected error occurred.");
  }
}

function handleDecryptionUpload() {
  const imageInput = document.getElementById("imageUploadDecrypt");
  const container = document.getElementById("imagePreviewDecryptContainer");
  container.style.display = "block";
  const imagePreview = document.getElementById("imagePreviewDecrypt");
  imagePreview.src = URL.createObjectURL(imageInput.files[0]);
}
