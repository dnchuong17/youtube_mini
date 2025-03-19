import crypto from "crypto";

export const randomCodeNumbers = (length) => {
    return crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
}
