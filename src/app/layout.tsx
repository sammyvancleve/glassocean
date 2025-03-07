import '~/styles/globals.css'
import { SidebarProvider } from '~/components/ui/sidebar'
import AppSidebar from "./_components/appSideBar"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ClientProvider } from '~/utils/provider'
import { GeistSans } from "geist/font/sans";
import { TRPCReactProvider } from '~/trpc/react'

const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <head>
        <script src="https://unpkg.com/react-scan/dist/auto.global.js" />
      </head>
      <body>
      <TRPCReactProvider>
        <SidebarProvider>
          <main className="w-full bg-fixed bg-gradient-to-b from-[#eefdfd] to-[#fcf5ff] text-zinc-700">
            {children}
          </main>
          </SidebarProvider>
      </TRPCReactProvider>
      </body>
    </html>
  );
}