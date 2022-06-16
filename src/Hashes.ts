/**
 * Generates a B64-hash string
 *
 * @param objJsonStr
 * @returns
 */
export function generateBase64Hash(objJsonStr: string | any): string {
    if (typeof objJsonStr !== "string") {
        objJsonStr = JSON.stringify(objJsonStr);
    }
    return Buffer.from(objJsonStr).toString("base64");
}

/**
 * Resolves a B64-hash string
 *
 * @param hash
 * @returns
 */
export function resolveBase64Hash(hash: string): string {
    const buffer = Buffer.from(hash, "base64");
    return buffer.toString("utf8");
}

/**
 * @note: NodeJs required
 *
 * @param data
 */
export function generateContentId(data: Object): string {
    const crypto = require("crypto");

    const parts = [];
    for (const key in data) {
        const text = String(key) + ":" + String(data[key]);
        const part = generateBase64Hash(text);
        parts.push(part);
    }
    parts.sort();
    const longHash = parts.join("_");
    const digest = crypto.createHash("md5").update(longHash, "utf8").digest("hex");
    return digest;
}
