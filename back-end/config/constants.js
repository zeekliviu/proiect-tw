const SMTP_ADDR = {
  iv: "09c8267a58d0a1e924d173631fdc1f16",
  encryptedData:
    "fb141aff1fc0f3b13f06da165883c284edbfb5edbc10b464edfffb235ab0e40c",
};
const SMTP_PORT = {
  iv: "e8beffc519c725c64e4c7c3ebca7d03b",
  encryptedData: "e67c61e56fd2c4767589f7fe6c0e14a4",
};
const SMTP_USER = {
  iv: "c09e6b2ebc8e16f73aabfe6e5b8fe347",
  encryptedData:
    "4963fde95ece712e10a3db3250702b3c29511ae6ddf3aa9b0aebccdc9ba7f5b0",
};
const SMTP_PASS = {
  iv: "d03ac166509dd486df2ef3b46c073990",
  encryptedData: "749bd5a1b0c93da34d50eb422866fc56",
};

const JWT_SECRET = {
  iv: "1b0bc851e7ad422e6cda8209de6c8299",
  encryptedData:
    "dd5d8fe097ae6106da18413a59332422a330343cf9fa79ad5c37e0bb7b1b327b9d21faca33bc7b0e11814a438ed5fd88",
};

const TOKEN_HEADER_KEY = {
  iv: "7eefceac40a281ccffe20dfd8bbe833a",
  encryptedData:
    "d19fca1eab7f741f4e3cf7fc4150f77dbd36554e5e04e4c236bd76be2034ee44efa8d90dd1d399027b223dcac99756d7",
};

const MAIL_TEMPLATE = (username, pin) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
        }

        .container {
            max-width: 400px;
            background-color: #af49fe;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }

        h1 {
            color: #fff;
        }

        p {
            font-size: 18px;
            line-height: 1.6;
            color: #b9ff00;
        }

        .verification-code {
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 10px;
            color: #fff;
            padding: 15px;
            border: 2px solid #b9ff00;
            border-radius: 5px;
            margin-top: 15px;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Verificare adresă de mail</h1>
      <p>Salut, ${username}! 👋🏻</p>
        <p>Codul tău de verificare este:</p>
        <div class="verification-code">${pin}</div>
    </div>
</body>
</html>

`;

module.exports = {
  SMTP_ADDR,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  MAIL_TEMPLATE,
  JWT_SECRET,
  TOKEN_HEADER_KEY,
};
