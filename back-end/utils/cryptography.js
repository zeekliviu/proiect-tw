const crypto = require("crypto");

function encrypt(text, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
  let encrypted = cipher.update(text, "utf-8", "hex");
  encrypted += cipher.final("hex");

  return {
    iv: iv.toString("hex"),
    encryptedData: encrypted.toString("hex"),
  };
}

function decrypt(encryptedData, key) {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(key),
    Buffer.from(encryptedData.iv, "hex")
  );
  let decrypted = decipher.update(encryptedData.encryptedData, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
}

module.exports = { encrypt, decrypt };
