import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { fallbackLng, languages } from './app/i18n/settings'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const pathnameHasLocale = languages.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )

  if (pathnameHasLocale) return NextResponse.next()

  const preferredLanguages = (request.headers.get('accept-language') ?? '')
    .split(',')
    .map((entry, index) => {
      const [tag, ...parameters] = entry.trim().split(';')
      const quality = parameters
        .map((parameter) => parameter.trim())
        .find((parameter) => parameter.startsWith('q='))
      const baseLanguage = tag.split('-')[0].toLowerCase()
      return { baseLanguage, quality: quality ? Number(quality.slice(2)) : 1, index }
    })
    .filter(({ baseLanguage, quality }) => baseLanguage && Number.isFinite(quality) && quality > 0)
    .sort((left, right) => right.quality - left.quality || left.index - right.index)

  const detectedLng = preferredLanguages.find(({ baseLanguage }) =>
    languages.includes(baseLanguage as typeof languages[number]),
  )?.baseLanguage ?? fallbackLng

  const localizedUrl = request.nextUrl.clone()
  localizedUrl.pathname = `/${detectedLng}${pathname}`
  return NextResponse.redirect(localizedUrl)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|outlook|MSOutlookit|.*\\..*).*)'],
}