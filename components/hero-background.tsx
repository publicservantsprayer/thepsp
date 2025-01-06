interface Props {
  children: React.ReactNode
}

export async function HeroBackground({ children }: Props) {
  return (
    <div className="h-[180px] overflow-hidden border-b border-b-border bg-[url('/images/capitol-color-night-700.jpg')] bg-left bg-no-repeat sm:h-auto md:bg-[url('/images/capitol-color-night.jpg')] md:bg-[position:0_-400px]">
      {children}
    </div>
  )
}
