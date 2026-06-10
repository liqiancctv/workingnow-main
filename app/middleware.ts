import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { fallbackLng, languages } from './app/i18n/settings'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 检查 URL 是否已经包含了支持的语言后缀（如 /en, /zh）
  const pathnameHasLocale = languages.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return NextResponse.next()

  // 如果没有语言后缀，读取用户浏览器的语言
  const acceptLanguage = request.headers.get('accept-language')
  let detectedLng = fallbackLng

  if (acceptLanguage) {
    const preferredLng = acceptLanguage.split(',')[0].split('-')[0]
    if (languages.includes(preferredLng)) {
      detectedLng = preferredLng
    }
  }

  // 重定向到带语言后缀的路由，比如 /en/dashboard
  request.nextUrl.pathname = `/${detectedLng}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  // 忽略静态文件和图片，只拦截路由
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|outlook).*)'],
}