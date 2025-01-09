'use client'

import React, { MouseEventHandler } from 'react'

import { sendSignInLinkToEmail, User } from 'firebase/auth'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ModalDrawer } from '@/components/modal-drawer'
import { auth } from '@/lib/firebase/client/client-app'
import { useRouter } from 'next/navigation'
import { setSessionCookie, signInWithGoogle } from '@/lib/firebase/client/auth'
import { useUserSession } from '@/components/nav-bar/use-user-session'

export function LoginForm({
  className,
  initialUser,
  signedInRedirectPath,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  initialUser: User | null
  signedInRedirectPath?: string
}) {
  const router = useRouter()
  const [email, setEmail] = React.useState('')
  const [signInError, setSignInError] = React.useState(false)
  const [messageSentOpen, setMessageSentOpen] = React.useState(false)
  const [emailError, setEmailError] = React.useState(false)
  const [disabled, setDisabled] = React.useState(false)
  const [googleSpinner, setGoogleSpinner] = React.useState(false)
  const [emailSpinner, setEmailSpinner] = React.useState(false)
  const handleMessageSentClose = () => setMessageSentOpen(false)
  const handleEmailChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => setEmail(event.target.value)
  const user = useUserSession(initialUser)

  React.useEffect(() => {
    if (user) {
      console.log('User signed in', user)
      setDisabled(true)
      const finishSignIn = async () => {
        const { ok, success } = await setSessionCookie(await user.getIdToken())
        if (ok && success) {
          router.push(signedInRedirectPath || '/profile')
        } else {
          setSignInError(true)
        }
      }
      finishSignIn()
    }
  }, [router, user, signedInRedirectPath])

  const handleSendLink = async () => {
    setDisabled(true)
    setEmailSpinner(true)
    try {
      await sendSignInLinkToEmail(auth, email, {
        url: `${window.location.origin}/sign-in/email-link-landing`,
        handleCodeInApp: true,
      })
      window.localStorage.setItem('emailForSignIn', email)
      setMessageSentOpen(true)
    } catch (error) {
      console.error('Error sending sign in link', error)
      setDisabled(false)
      setEmailError(true)
    }
  }
  const handleSignInWithGoogle: MouseEventHandler<HTMLButtonElement> = (
    event,
  ) => {
    setDisabled(true)
    setGoogleSpinner(true)
    event.preventDefault()
    signInWithGoogle()
  }

  return (
    <div className={cn('my8 flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>
            Enter your email address to sign in to your account. We will send
            you an email with a link allowing you to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
                disabled={disabled}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              onClick={handleSendLink}
              disabled={disabled}
              loading={emailSpinner}
            >
              Sign in without a password
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleSignInWithGoogle}
              disabled={disabled}
              loading={googleSpinner}
            >
              Sign in with Google
            </Button>
          </div>
        </CardContent>
      </Card>

      <ModalDrawer
        setOpen={handleMessageSentClose}
        open={messageSentOpen}
        title="Email Sent"
      >
        A message with a sign in link has been sent. Check your email and sign
        in with that link now.
      </ModalDrawer>

      <ModalDrawer
        setOpen={setEmailError}
        open={emailError}
        title="Sign In Email Error"
      >
        There was an error sending sign in link. Please try again.
      </ModalDrawer>

      <ModalDrawer
        setOpen={setSignInError}
        open={signInError}
        title="Sign In Error"
      >
        There was an error signing you in. Please try again.
      </ModalDrawer>
    </div>
  )
}
