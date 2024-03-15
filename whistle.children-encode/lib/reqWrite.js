const crypto = require("crypto-js");

module.exports = (server, options) => {
  server.on("request", (req, res) => {
    const { cryptokey: cryptoKey } = req.originalReq.headers;
    // console.log(req.originalReq.headers);
    let body = "";
    req.on("data", (data) => {
      const dataStr = data.toString();
      let reqData;
      try {
        reqData = JSON.parse(dataStr);
      } catch (e) {
        reqData = dataStr;
      }

      if (cryptoKey) {
        const encryptedData = encrypt(cryptoKey, reqData);
        body = encryptedData;
      } else {
        body = dataStr;
      }
    });
    req.on("end", () => {
      if (body) {
        res.end(body);
      } else {
        res.end();
      }
    });
  });
};

function encrypt(cryptoKey, data) {
  const key = crypto.enc.Hex.parse(
    cryptoKey.substring(0, 10) + cryptoKey.substring(16, cryptoKey.length)
  );
  const message = crypto.enc.Utf8.parse(JSON.stringify(data));

  const res = crypto.AES.encrypt(message, key, {
    mode: crypto.mode.ECB,
    padding: crypto.pad.Pkcs7,
  }).toString();

  return res;
}
