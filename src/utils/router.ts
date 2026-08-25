import { useState, useEffect } from 'react';

export interface RouteInfo {
  path: string;
  params: Record<string, string>;
  searchParams: URLSearchParams;
}

export function parseHash(hash?: string): RouteInfo {
  const safeHash = typeof hash === 'string' ? hash : (typeof window !== 'undefined' ? window.location?.hash || '#/' : '#/');
  let cleanHash = safeHash.replace(/^#\/?/, '/');
  if (!cleanHash.startsWith('/')) {
    cleanHash = '/' + cleanHash;
  }

  const [pathWithParams, queryPart] = cleanHash.split('?');
  const searchParams = new URLSearchParams(queryPart || '');
  const segments = (pathWithParams || '').split('/').filter(Boolean);

  let path = '/';
  const params: Record<string, string> = {};

  if (segments.length === 0) {
    path = '/';
  } else if (segments[0] === 'products') {
    path = '/products';
  } else if (segments[0] === 'category' && segments[1]) {
    path = `/category/${segments[1]}`;
    params.category = segments[1];
  } else if (segments[0] === 'category') {
    path = '/category';
  } else if (segments[0] === 'product' && segments[1]) {
    path = `/product/${segments[1]}`;
    params.slug = segments[1];
  } else if (segments[0] === 'product') {
    path = '/product';
  } else if (segments[0] === 'cart') {
    path = '/cart';
  } else if (segments[0] === 'about') {
    path = '/about';
  } else if (segments[0] === 'contact') {
    path = '/contact';
  } else if (segments[0] === 'faq') {
    path = '/faq';
  } else if (segments[0] === 'wishlist') {
    path = '/wishlist';
  } else {
    path = '/' + segments.join('/');
  }

  return {
    path,
    params,
    searchParams,
  };
}

export function useRouter() {
  const [route, setRoute] = useState<RouteInfo>(() => {
    const initialHash = typeof window !== 'undefined' ? window.location?.hash || '#/' : '#/';
    return parseHash(initialHash);
  });

  useEffect(() => {
    const handleHashChange = () => {
      const currentHash = typeof window !== 'undefined' ? window.location?.hash || '#/' : '#/';
      setRoute(parseHash(currentHash));
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (to?: string) => {
    navigateTo(to);
  };

  return {
    ...route,
    navigate,
  };
}

export function navigateTo(to?: string) {
  if (typeof to !== 'string' || !to) {
    if (typeof window !== 'undefined') {
      window.location.hash = '#/';
    }
    return;
  }
  let clean = to;
  if (!clean.startsWith('#')) {
    clean = '#' + (clean.startsWith('/') ? clean : '/' + clean);
  }
  if (typeof window !== 'undefined') {
    window.location.hash = clean;
  }
}
