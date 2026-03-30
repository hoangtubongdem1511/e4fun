export function backendErrorMessage(err) {
  const backendError = err?.response?.data?.error;
  const details = backendError?.details;
  const backendMessage = backendError?.message;

  if (!backendError) {
    return err?.message || "Có lỗi xảy ra, vui lòng thử lại.";
  }

  let msg =
    backendMessage ||
    err?.message ||
    "Có lỗi xảy ra, vui lòng thử lại.";

  // Middleware validateBody thường trả:
  // { error: { message: "Validation failed", details: Zod issues[] } }
  if (
    backendMessage === "Validation failed" &&
    Array.isArray(details) &&
    details[0]?.message
  ) {
    msg = details[0].message;
  }

  return msg;
}

