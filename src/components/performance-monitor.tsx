'use client';

import { useEffect } from 'react';
import { analytics } from '@/lib/analytics';

export function PerformanceMonitor() {
  useEffect(() => {
    // Track page load performance
    const trackPerformance = () => {
      const metrics = analytics.getPerformanceMetrics();
      if (metrics) {
        // Track Core Web Vitals
        if (metrics.lcp) {
          analytics.trackPerformance('lcp', metrics.lcp);
        }
        if (metrics.fid) {
          analytics.trackPerformance('fid', metrics.fid);
        }
        if (metrics.cls) {
          analytics.trackPerformance('cls', metrics.cls);
        }
        
        // Track other performance metrics
        if (metrics.domContentLoaded) {
          analytics.trackPerformance('dom_content_loaded', metrics.domContentLoaded);
        }
        if (metrics.loadComplete) {
          analytics.trackPerformance('load_complete', metrics.loadComplete);
        }
        if (metrics.firstPaint) {
          analytics.trackPerformance('first_paint', metrics.firstPaint);
        }
        if (metrics.firstContentfulPaint) {
          analytics.trackPerformance('first_contentful_paint', metrics.firstContentfulPaint);
        }
      }
    };

    // Track performance after page load
    if (document.readyState === 'complete') {
      trackPerformance();
    } else {
      window.addEventListener('load', trackPerformance);
    }

    // Track page visibility changes
    const handleVisibilityChange = () => {
      analytics.track('visibility_change', {
        hidden: document.hidden,
        visibilityState: document.visibilityState,
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Track unload events
    const handleBeforeUnload = () => {
      analytics.track('page_unload', {
        url: window.location.href,
        timeOnPage: Date.now() - performance.timing.navigationStart,
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      window.removeEventListener('load', trackPerformance);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return null; // This component doesn't render anything
}

// Error boundary for performance monitoring
export function PerformanceErrorBoundary({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      analytics.trackError(new Error(event.message), 'performance_monitor');
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      analytics.trackError(
        new Error(event.reason?.message || 'Unhandled promise rejection'),
        'performance_monitor'
      );
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return <>{children}</>;
}
