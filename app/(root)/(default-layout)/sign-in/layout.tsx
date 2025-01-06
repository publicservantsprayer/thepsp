export default async function SignInLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex w-full items-center justify-center p-6 outline md:p-10">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  )
}
