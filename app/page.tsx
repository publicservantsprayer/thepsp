import { RedirectToState } from './redirect-to-state'

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-blue-400">test</h1>
      <RedirectToState />
    </div>
  )
}
