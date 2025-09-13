// Privacy-focused analytics and performance monitoring
interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private isEnabled: boolean = false;

  constructor() {
    // Only enable analytics in production
    this.isEnabled = process.env.NODE_ENV === 'production';
  }

  // Track user interactions
  track(event: string, properties?: Record<string, any>) {
    if (!this.isEnabled) return;

    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: Date.now(),
    };

    this.events.push(analyticsEvent);
    
    // Send to analytics service (implement your preferred service)
    this.sendToAnalytics(analyticsEvent);
  }

  // Track page views
  trackPageView(page: string, title?: string) {
    this.track('page_view', {
      page,
      title: title || document.title,
      url: window.location.href,
    });
  }

  // Track performance metrics
  trackPerformance(metric: string, value: number, unit: string = 'ms') {
    this.track('performance', {
      metric,
      value,
      unit,
    });
  }

  // Track user engagement
  trackEngagement(action: string, element: string, value?: any) {
    this.track('engagement', {
      action,
      element,
      value,
    });
  }

  // Track errors
  trackError(error: Error, context?: string) {
    this.track('error', {
      message: error.message,
      stack: error.stack,
      context,
    });
  }

  // Send events to analytics service
  private async sendToAnalytics(event: AnalyticsEvent) {
    try {
      // Implement your analytics service here
      // Example: Google Analytics, Mixpanel, PostHog, etc.
      console.log('Analytics event:', event);
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }

  // Get performance metrics
  getPerformanceMetrics() {
    if (typeof window === 'undefined') return null;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');

    return {
      // Core Web Vitals
      lcp: this.getLCP(),
      fid: this.getFID(),
      cls: this.getCLS(),
      
      // Navigation timing
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      
      // Paint timing
      firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
    };
  }

  // Get Largest Contentful Paint
  private getLCP(): Promise<number> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve(0);
        return;
      }

      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        resolve(lastEntry.startTime);
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    });
  }

  // Get First Input Delay
  private getFID(): Promise<number> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve(0);
        return;
      }

      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const firstEntry = entries[0];
        resolve(firstEntry.processingStart - firstEntry.startTime);
      });

      observer.observe({ entryTypes: ['first-input'] });
    });
  }

  // Get Cumulative Layout Shift
  private getCLS(): Promise<number> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve(0);
        return;
      }

      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        resolve(clsValue);
      });

      observer.observe({ entryTypes: ['layout-shift'] });
    });
  }
}

// Export singleton instance
export const analytics = new Analytics();

// Hook for React components
export const useAnalytics = () => {
  return {
    track: analytics.track.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackPerformance: analytics.trackPerformance.bind(analytics),
    trackEngagement: analytics.trackEngagement.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
  };
};
