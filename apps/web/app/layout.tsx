import { Providers } from '../components/providers/provider';
import './globals.css';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang='en'>
            <Providers>
                <body className='bg-red-900'>{children}</body>
            </Providers>
        </html>
    );
}
