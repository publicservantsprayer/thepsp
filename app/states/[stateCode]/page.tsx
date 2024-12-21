import { Detect } from './detect'

interface Props {
  params: Promise<{
    stateCode: string
  }>
}

export default async function StatePage({ params }: Props) {
  const { stateCode } = await params
  if (stateCode === 'detect') {
    return <Detect />
  }

  return <div>{stateCode}</div>
}
