import NextLink, { LinkProps } from 'next/link'

export function Link({
  href,
  children,
  ...props
}: LinkProps & { className?: string; children: React.ReactNode }) {
  return (
    <NextLink href={href} {...props}>
      {children}
    </NextLink>
  )
}
