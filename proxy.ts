import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { detectProductLocale, languages, productLocales } from './app/i18n/settings'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const productRoute = /^\/(meetings|tools|break|discover|about|privacy|terms)(\/|$)/
  const localeInPath = [...productLocales, ...languages].find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )
  if (localeInPath) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-workingnow-locale', localeInPath === 'zh' ? 'zh-CN' : localeInPath)
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  if (pathname !== '/' && !productRoute.test(pathname)) return NextResponse.next()

  const localizedUrl = request.nextUrl.clone()
  const locale = detectProductLocale(request.headers.get('accept-language'))
  localizedUrl.pathname = `/${locale}${pathname === '/' ? '/home' : pathname}`
  const response = NextResponse.redirect(localizedUrl)
  response.headers.set('Vary', 'Accept-Language')
  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|outlook|MSOutlookit|.*\\..*).*)'],
}