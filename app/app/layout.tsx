import { Providers } from "../providers"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Providers>
        {children}
      </Providers>
    </div>
  )
}
