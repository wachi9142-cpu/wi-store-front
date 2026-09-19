export { default } from "next-auth/middleware";

// ทุกหน้า ยกเว้น login และ api ต้องล็อกอิน
export const config = { matcher: ["/((?!login|api|_next|favicon.ico).*)"] };
