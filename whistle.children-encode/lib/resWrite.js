const zlib = require("zlib");
const crypto = require("crypto-js");

module.exports = (server, options) => {
  server.on("request", (req, res) => {
    const { cryptokey: cryptoKey, "content-encoding": contentEncoding } =
      req.originalReq.headers;

    if (contentEncoding === "gzip") {
      handleGzip(req, res, cryptoKey);
    } else {
      handlePlain(req, res, cryptoKey);
    }
  });
};

function handleGzip(req, res, cryptoKey) {
  const gunzip = zlib.createGunzip();
  let cryptedData = "";

  gunzip.on("data", (chunk) => {
    // 这里可以进行解密操作
    cryptedData += chunk.toString("utf8");
  });

  gunzip.on("end", () => {
    const decryptedData = decrypt(cryptoKey, cryptedData);
    // 所有数据块解压、解密完成后，进行压缩并写入响应
    const compressedData = zlib.gzipSync(decryptedData);
    res.end(compressedData);
  });

  gunzip.on("error", (error) => {
    console.error("Decompression Error:", error);
    res.statusCode = 500;
    res.end();
  });

  req.pipe(gunzip);
}

function handlePlain(req, res, cryptoKey) {
  let body;
  req.on("data", (data) => {
    body = body ? Buffer.concat([body, data]) : data;
  });

  req.on("end", () => {
    // 这里可以进行解密操作
    if (body) {
      if (cryptoKey) body = decrypt(cryptoKey, body.toString("utf8"));
      res.end(body);
    } else {
      res.end();
    }
  });
}

function decrypt(cryptoKey, ciphertext) {
  if (!cryptoKey) return ciphertext;
  ciphertext = ciphertext.replace(/\s/g, "");
  const key = crypto.enc.Hex.parse(
    cryptoKey.substring(0, 10) + cryptoKey.substring(16, cryptoKey.length)
  );
  const wordArray = crypto.AES.decrypt(ciphertext, key, {
    mode: crypto.mode.ECB,
    padding: crypto.pad.Pkcs7,
  });

  return crypto.enc.Utf8.stringify(wordArray).toString();
}
