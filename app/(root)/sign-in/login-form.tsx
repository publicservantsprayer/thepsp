'use client'

import React from 'react'

import { sendSignInLinkToEmail } from 'firebase/auth'
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
import { auth } from '@/lib/firebase/clientApp'
import { useRouter } from 'next/navigation'

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const router = useRouter()
  const [email, setEmail] = React.useState('')
  const [messageSentOpen, setMessageSentOpen] = React.useState(false)
  const [messageEmailErrorOpen, setMessageEmailErrorOpen] =
    React.useState(false)
  const [disabled, setDisabled] = React.useState(false)
  const handleMessageSentClose = () => setMessageSentOpen(false)
  const handleMessageEmailErrorClose = () => setMessageEmailErrorOpen(false)
  const handleEmailChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => setEmail(event.target.value)

  const handleSendLink = async () => {
    setDisabled(true)
    try {
      await sendSignInLinkToEmail(auth, email, {
        url: `${window.location.origin}/sign-in/email-link-landing`,
        handleCodeInApp: true,
      })
      window.localStorage.setItem('emailForSignIn', email)
      setDisabled(true)
      setMessageSentOpen(true)
      router.push('/profile')
    } catch (error) {
      console.error('Error sending sign in link', error)
      setDisabled(false)
      setMessageEmailErrorOpen(true)
    }
  }

  return (
    <div className={cn('my8 flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>
            Enter your email below to sign in to your account. We will send you
            an email with a link allowing you to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                onClick={handleSendLink}
                disabled={disabled}
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
        setOpen={handleMessageSentClose}
        open={messageSentOpen}
        title="Email Sent"
      >
        A message with a sign in link has been sent. Check your email and sign
        in with that link now.
      </ModalDrawer>

      <ModalDrawer
        setOpen={handleMessageEmailErrorClose}
        open={messageEmailErrorOpen}
        title="Error sending email"
      >
        There was an error sending you an email. Please try again.
      </ModalDrawer>
    </div>
  )
}
