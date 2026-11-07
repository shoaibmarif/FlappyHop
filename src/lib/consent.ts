export type ConsentChoice = 'granted' | 'denied';

const KEY = 'flappyhop.consent';
export const CONSENT_EVENT = 'flappyhop:open-consent';

type Gtag = (...args: unknown[]) => void;
const gtag = (): Gtag | undefined => (typeof window !== 'undefined' ? (window as unknown as { gtag?: Gtag }).gtag : undefined);

export function getConsent(): ConsentChoice | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(choice: ConsentChoice) {
  try {
    localStorage.setItem(KEY, choice);
  } catch {
    // storage unavailable: the choice applies to this visit only
  }
  gtag()?.('consent', 'update', { analytics_storage: choice });
}

/** Re-open the analytics notice (used by the "Cookie settings" link). */
export function openConsentSettings() {
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

/**
 * Pushes a custom event to the Google Tag Manager data layer, e.g.
 * trackEvent('run_complete', { score: 12 }). In GTM, a "Custom Event" trigger
 * with the same name can forward it to Google Analytics. Consent Mode still applies.
 */
export function trackEvent(event: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...params });
}
