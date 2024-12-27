interface Props {
  children: React.ReactNode
}

export async function HeroBackground({ children }: Props) {
  return (
    <div
      sx={{
        background: {
          sm: 'url("/images/capitol-color-night.jpg") top left no-repeat',
          xs: 'url("/images/capitol-color-night-700.jpg") top left no-repeat',
        },
        backgroundPositionY: { sm: '-400px', xs: '-150px' },
        backgroundAttachment: 'fixed',
        overflow: 'hidden',
        height: { sm: 'auto', xs: '180px' },
      }}
    >
      {children}
    </div>
  )
}
