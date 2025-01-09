'use client'

import React, { Dispatch, SetStateAction } from 'react'

import { ModalDrawer } from '@/components/modal-drawer'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/firebase/client/client-app'
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export default function EmailLinkLanding() {
  const router = useRouter()
  const [emailToConfirm, setEmailToConfirm] = React.useState('')
  const [incorrectEmailOpen, setIncorrectEmailOpen] = React.useState(false)
  const [mustConfirmEmail, setMustConfirmEmail] = React.useState(false)
  const [errorOpen, setErrorOpen] = React.useState(false)

  const handleIncorrectEmailClose = () => {
    setIncorrectEmailOpen(false)
    setMustConfirmEmail(true)
  }

  const handleErrorClose: Dispatch<SetStateAction<boolean>> = (open) => {
    if (!open) {
      setErrorOpen(false)
      router.push('/sign-in')
    }
  }

  const handleSendEmailConfirmation = () => {
    setMustConfirmEmail(false)
    sendEmailConfirmation(emailToConfirm)
  }

  const handleEmailConfirmationChange: React.ChangeEventHandler<
    HTMLInputElement
  > = (event) => setEmailToConfirm(event.target.value)

  interface AuthError {
    code: string
    message: string
  }

  const sendEmailConfirmation = React.useCallback(
    async (email: string) => {
      try {
        await signInWithEmailLink(auth, email, window.location.href)
        window.localStorage.removeItem('emailForSignIn')
        router.push('/profile')
      } catch (error: unknown) {
        console.error('Error signing in', error)

        const authError = error as AuthError
        if (authError.code === 'auth/invalid-email') {
          setIncorrectEmailOpen(true)
        } else {
          setErrorOpen(true)
        }
      }
    },
    [router],
  )

  React.useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const emailLocalStorage = window.localStorage.getItem('emailForSignIn')
      if (emailLocalStorage) {
        sendEmailConfirmation(emailLocalStorage)
      } else {
        setMustConfirmEmail(true)
      }
    } else {
      console.error('Not a valid signInWithEmailLink')
    }
  }, [sendEmailConfirmation])

  if (mustConfirmEmail) {
    return <CardTitle className="text-2xl">Signing You In...</CardTitle>
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Signing You In</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={emailToConfirm}
                  onChange={handleEmailConfirmationChange}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                onClick={handleSendEmailConfirmation}
                // disabled={disabled}
              >
                Sign in without a password
              </Button>
              <Button variant="outline" className="w-full">
                Sign in with Google
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <ModalDrawer
        setOpen={handleIncorrectEmailClose}
        open={incorrectEmailOpen}
        title="Incorrect Email"
      >
        The email address was incorrect. Please try again.
      </ModalDrawer>

      <ModalDrawer
        setOpen={handleErrorClose}
        open={errorOpen}
        title="Error Signing In"
      >
        There was an error signing you in. This can happen if the link is
        expired, or has already been used.
      </ModalDrawer>
    </div>
  )
}
