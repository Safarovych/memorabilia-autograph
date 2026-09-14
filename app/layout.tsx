import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata={title:'Memorabilia Autograph — Football Heritage',description:'Premium football jerseys, signed memorabilia and live auctions.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
