'use server'

import { cookies } from 'next/headers'
import { redirect }  from 'next/navigation'
import { ADMIN_COOKIE, hashSecret } from '@/lib/auth'

export async function adminLogin(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string }> {
  const password = formData.get('password')?.toString() ?? ''

  if (!password) {
    return { error: 'أدخل كلمة المرور' }
  }

  const entered  = await hashSecret(password)
  const expected = await hashSecret(process.env.ADMIN_SECRET ?? '')

  if (entered !== expected) {
    return { error: 'كلمة المرور غير صحيحة' }
  }

  // Store SHA-256(ADMIN_SECRET) in an httpOnly cookie.
  // The middleware recomputes the same value and compares — stateless, no DB.
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE, expected, {
    httpOnly : true,
    secure   : process.env.NODE_ENV === 'production',
    sameSite : 'strict',
    maxAge   : 60 * 60 * 24 * 7, // 7 days
    path     : '/',
  })

  redirect('/admin/dashboard')
}
