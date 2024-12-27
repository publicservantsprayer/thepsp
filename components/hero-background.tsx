interface Props {
  children: React.ReactNode
}

export async function HeroBackground({ children }: Props) {
  return (
    <div className="h-[180px] overflow-hidden bg-[url('/images/capitol-color-night-700.jpg')] bg-fixed bg-[position:0_-150px] bg-no-repeat md:h-auto md:bg-[url('/images/capitol-color-night.jpg')] md:bg-[position:0_-400px]">
      {children}
    </div>
  )
}
