const crypto = require("crypto-js")

export default function decode(encrypted) {
    try {
        // Campus default de-coding function
        const ciphertext = crypto.enc.Base64.parse(encrypted.replace(/"/g, ""))
        const hashedKey = crypto.SHA256("lost")
        const decrypted = crypto.AES.decrypt(
            { ciphertext },
            hashedKey,
            { iv: crypto.enc.Hex.parse("00000000000000000000000000000000")}
        ).toString(crypto.enc.Utf8)

        // Convert the text to JSON and return it
        return JSON.parse(decrypted)
    } catch (error) {
        console.error('Error decoding data:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}