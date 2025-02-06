// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export const config = {
//   matcher: ['/admin/:path*', '/psp-admin/:path*'],
// }

// export default async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl
//   const isAdminRoute =
//     pathname.startsWith('/admin') || pathname.startsWith('/psp-admin')

//   if (isAdminRoute) {
//     // Get the session cookie
//     const session = request.cookies.get('__session')

//     if (!session?.value) {
//       return NextResponse.redirect(new URL('/sign-in', request.url))
//     }

//     try {
//       // Verify session on the API route
//       const response = await fetch(
//         new URL('/api/auth/verify-admin', request.url),
//         {
//           headers: {
//             Cookie: `__session=${session.value}`,
//           },
//         },
//       )

//       if (!response.ok) {
//         return NextResponse.redirect(new URL('/sign-in', request.url))
//       }
//       // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     } catch (error) {
//       return NextResponse.redirect(new URL('/sign-in', request.url))
//     }
//   }

//   return NextResponse.next()
// }
