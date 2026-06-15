import './global.css';

export const metadata = {
  title: 'Agricca Storefront',
  description: 'Agricca marketplace storefront (Phase 0 shell)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
