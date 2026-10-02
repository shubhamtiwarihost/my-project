/**
 * Google Analytics 4 (GA4) Tracker Helper for shubhamprofile.info
 */

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

/**
 * Dynamically loads and initializes GA4
 */
export function initGA() {
  if (typeof window === 'undefined') return;

  const id = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
  if (!id || id === 'G-XXXXXXXXXX') {
    // Measurement ID not set yet, fallback console notice in dev
    return;
  }

  if (document.getElementById('ga-gtag-script')) return;

  const script = document.createElement('script');
  script.id = 'ga-gtag-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', id, {
    page_path: window.location.pathname,
    send_page_view: true,
  });
}

/**
 * Tracks CV / Resume Download event in Google Analytics
 */
export function trackCvDownload(fileName = 'Shubham_Tiwari_CV.pdf') {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'cv_download', {
      event_category: 'Engagement',
      event_label: fileName,
      file_name: fileName,
      value: 1,
    });
  } else {
    console.log('[Analytics] CV Download event triggered:', fileName);
  }
}
