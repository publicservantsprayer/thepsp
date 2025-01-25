'use client'

import React from 'react'

const initialMessages = [
  'Thinking...',
  'Analyzing...',
  'Processing...',
  'Computing...',
  'Evaluating...',
  'Calculating...',
  'Deciding...',
  'Judging...',
  'Concluding...',
  'Determining...',
  'Reasoning...',
  'Inferring...',
  'Speculating...',
]

export function ThinkingMessage({ show }: { show: boolean }) {
  const [message, setMessage] = React.useState(initialMessages[0])
  const [, setAvailableMessages] = React.useState([...initialMessages.slice(1)])

  React.useEffect(() => {
    const interval = setInterval(() => {
      setAvailableMessages((messages) => {
        if (messages.length === 0) {
          const newMessages = [...initialMessages]
          const nextIndex = Math.floor(Math.random() * newMessages.length)
          const nextMessage = newMessages[nextIndex]
          setMessage(nextMessage)
          return newMessages.filter((_, i) => i !== nextIndex)
        }

        // Pick random message from remaining pool
        const index = Math.floor(Math.random() * messages.length)
        const nextMessage = messages[index]
        setMessage(nextMessage)
        return messages.filter((_, i) => i !== index)
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  if (!show) {
    return null
  }

  return (
    <div className="flex h-[calc(100cqh-32rem)] items-center justify-center text-3xl text-muted-foreground">
      {message}
    </div>
  )
}
