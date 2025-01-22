interface Props {
  children: React.ReactNode
}

export function Title({ children }: Props) {
  return <h1 className="mb-4 text-xl">{children}</h1>
}
