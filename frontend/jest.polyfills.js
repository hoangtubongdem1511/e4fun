/**
 * Chạy trước mọi test file (setupFiles) — react-router v7 cần TextEncoder trong môi trường Jest.
 */
const { TextEncoder, TextDecoder } = require("util");

if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = TextDecoder;
}
