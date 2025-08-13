export function trackEvent(event: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    // Send to analytics service
    console.log('Event:', event, properties);
    
    // You can integrate with services like Google Analytics, Mixpanel, etc.
    // Example: gtag('event', event, properties);
  }
}

export function trackError(error: Error, context?: string) {
  console.error('Error tracked:', error, context);
  
  // Send to error monitoring service (e.g., Sentry)
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    (window as any).Sentry.captureException(error, {
      tags: { context },
    });
  }
}

export function trackPerformance(name: string, duration: number) {
  if (typeof window !== 'undefined') {
    console.log(`Performance: ${name} took ${duration}ms`);
    
    // Send to performance monitoring service
    // Example: performance.mark(`${name}-end`);
    // performance.measure(name, `${name}-start`, `${name}-end`);
  }
}
