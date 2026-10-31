import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'La Pausa · Café de barrio',description:'Café con mimo, pan recién hecho y momentos sin prisa. Descubre la cafetería ficticia La Pausa.',robots:{index:false,follow:false},icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}</body></html>}
