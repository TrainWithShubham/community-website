
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary } from '@/components/error-boundary';
import { PerformanceMonitor, PerformanceErrorBoundary } from '@/components/performance-monitor';

export const metadata: Metadata = {
  metadataBase: new URL('https://community.trainwithshubham.com'),
  title: {
    default: 'TWS Community Hub',
    template: '%s | TWS Community Hub'
  },
  description: 'A community for DevOps, Cloud, and DevSecOps enthusiasts. Explore job opportunities, tackle real-world interview questions, and grow with us.',
  keywords: ['DevOps', 'Cloud', 'DevSecOps', 'Interview Questions', 'Jobs', 'Community', 'TrainWithShubham', 'Career Development'],
  authors: [{ name: 'TrainWithShubham', url: 'https://trainwithshubham.com' }],
  creator: 'TrainWithShubham',
  publisher: 'TrainWithShubham Community',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://community.trainwithshubham.com',
    siteName: 'TWS Community Hub',
    title: 'TWS Community Hub - DevOps, Cloud & DevSecOps Community',
    description: 'A community for DevOps, Cloud, and DevSecOps enthusiasts. Explore job opportunities, tackle real-world interview questions, and grow with us.',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'TWS Community Hub - DevOps, Cloud & DevSecOps Community',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TWS Community Hub - DevOps, Cloud & DevSecOps Community',
    description: 'A community for DevOps, Cloud, and DevSecOps enthusiasts. Explore job opportunities, tackle real-world interview questions, and grow with us.',
    images: ['/og-image.svg'],
    creator: '@TrainWitShubham',
    site: '@TrainWitShubham',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
  category: 'technology',
  classification: 'Community Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500;700&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="TWS Community" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className="font-code antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
        >
          <PerformanceErrorBoundary>
            <ErrorBoundary>
              <div className="flex min-h-screen flex-col">
                  {/* Skip Links for Accessibility */}
                  <a 
                    href="#main-content" 
                    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
                  >
                    Skip to main content
                  </a>
                  <a 
                    href="#navigation" 
                    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-32 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
                  >
                    Skip to navigation
                  </a>
                  <Navbar />
                  <main id="main-content" className="flex-1" role="main" aria-label="Main content">
                    {children}
                  </main>
                  <Footer />
                </div>
                <Toaster />
                <PerformanceMonitor />
            </ErrorBoundary>
          </PerformanceErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
