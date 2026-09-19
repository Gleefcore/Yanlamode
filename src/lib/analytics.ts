'use client';

import { DeviceType, TrafficSource } from './types';

export function detectDevice(): DeviceType {
  if (typeof window === 'undefined') return 'Desktop';
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'Tablette';
  if (/mobile|iphone|ipod|android|blackberry|iemobile|kindle/i.test(ua)) return 'Mobile';
  return 'Desktop';
}

export function detectTrafficSource(): TrafficSource {
  if (typeof window === 'undefined') return 'Direct';
  const referrer = document.referrer.toLowerCase();
  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source')?.toLowerCase();

  if (utmSource?.includes('instagram') || referrer.includes('instagram.com')) return 'Instagram';
  if (utmSource?.includes('tiktok') || referrer.includes('tiktok.com')) return 'TikTok';
  if (utmSource?.includes('facebook') || referrer.includes('facebook.com')) return 'Facebook';
  if (utmSource?.includes('whatsapp') || referrer.includes('whatsapp.com')) return 'WhatsApp';
  if (utmSource?.includes('google') || referrer.includes('google.')) return 'Google';
  if (referrer === '') return 'Direct';
  return 'Autre';
}

export async function trackEvent(
  type: 'page_view' | 'creation_view' | 'whatsapp_click' | 'demand_submit',
  details?: {
    creationId?: string;
    creationTitle?: string;
    path?: string;
    destination?: string;
  }
) {
  try {
    const payload = {
      type,
      path: details?.path || (typeof window !== 'undefined' ? window.location.pathname : '/'),
      creationId: details?.creationId,
      creationTitle: details?.creationTitle,
      source: detectTrafficSource(),
      device: detectDevice(),
    };

    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    // Non-blocking analytics
  }
}
