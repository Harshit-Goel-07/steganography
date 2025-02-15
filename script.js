// Listen for image upload and display preview
document.getElementById("imageUpload").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById("imagePreview").src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
  
  // Function to encode text into an image
  function encodeText() {
    const text = document.getElementById("textInput").value.trim();
    const passkey = document.getElementById("passkey").value.trim();
    const img = document.getElementById("imagePreview");
  
    if (!img.src) {
      alert("Please upload an image first.");
      return;
    }
  
    if (text === "") {
      alert("Enter some text to encode.");
      return;
    }
  
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
  
    const image = new Image();
    image.src = img.src;
    image.onload = function () {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
  
      let encodedText = text;
      if (passkey) {
        encodedText = passkey + "::" + encodedText;
      }
      encodedText += "\0"; // End marker
  
      let textBits = "";
      for (let i = 0; i < encodedText.length; i++) {
        textBits += encodedText[i].charCodeAt(0).toString(2).padStart(8, "0");
      }
  
      let bitIndex = 0;
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imgData.data;
  
      // Encode one bit per pixel's red channel
      for (let i = 0; i < pixels.length && bitIndex < textBits.length; i += 4) {
        pixels[i] = (pixels[i] & 0xFE) | parseInt(textBits[bitIndex], 2);
        bitIndex++;
      }
  
      ctx.putImageData(imgData, 0, 0);
      const encodedImage = canvas.toDataURL("image/png");
  
      const downloadLink = document.createElement("a");
      downloadLink.href = encodedImage;
      downloadLink.download = "encoded_image.png";
      downloadLink.click();
  
      alert("Text successfully encoded into the image!");
    };
  }
  
  // Function to decode text from an image
  function decodeText() {
    const img = document.getElementById("imagePreview");
  
    if (!img.src) {
      alert("Please upload an image first.");
      return;
    }
  
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
  
    const image = new Image();
    image.src = img.src;
    image.onload = function () {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
  
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imgData.data;
      let binaryText = "";
  
      // Read one bit per pixel's red channel
      for (let i = 0; i < pixels.length; i += 4) {
        binaryText += (pixels[i] & 1).toString();
      }
  
      let text = "";
      for (let i = 0; i < binaryText.length; i += 8) {
        const char = String.fromCharCode(parseInt(binaryText.substr(i, 8), 2));
        if (char === "\0") break;
        text += char;
      }
  
      // Use the passkey from the decryption panel
      const passkey = document.getElementById("passkey-decrypt").value.trim();
      if (text.includes("::")) {
        const [storedPasskey, actualText] = text.split("::", 2);
        if (passkey && storedPasskey === passkey) {
          document.getElementById("decodedText").value = actualText;
        } else {
          alert("Incorrect passkey!");
        }
      } else {
        document.getElementById("decodedText").value = text;
      }
    };
  }
  