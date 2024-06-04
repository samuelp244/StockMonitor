import { type NextRequest, NextResponse } from "next/server";

const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT ?? "";

const privateUrlList = [
  "dashboard",
  
];
const publicUrlList = ["", "register"];
const middleware = (req: NextRequest): NextResponse => {
  const { cookies, nextUrl } = req;

  if (
    privateUrlList.includes(nextUrl.pathname.split("/")[1]) &&
    cookies.get("stock_monitor_token") === undefined
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  } else if (
    publicUrlList.includes(nextUrl.pathname.split("/")[1]) &&
    cookies.get("stock_monitor_token") !== undefined
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
};

export default middleware;
