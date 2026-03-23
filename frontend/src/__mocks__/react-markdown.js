const React = require("react");

/** Stub cho Jest — tránh parse ESM từ react-markdown và dependencies. */
function ReactMarkdown({ children }) {
  return React.createElement("div", { "data-testid": "react-markdown-stub" }, children);
}

module.exports = ReactMarkdown;
