(function(){
  'use strict';
  // Create global namespace if not present
  window.App = window.App || {};

  // Storage helpers with namespacing and safe JSON
  const storageNS = 'atharva';
  const safeParse = (val, fallback) => {
    try { return JSON.parse(val); } catch { return fallback; }
  };

  window.App.AppStorage = {
    get(key, fallback){
      try { return safeParse(localStorage.getItem(`${storageNS}:${key}`), fallback); } catch(e){ return fallback; }
    },
    set(key, value){
      try { localStorage.setItem(`${storageNS}:${key}`, JSON.stringify(value)); return true; } catch(e){ return false; }
    },
    remove(key){
      try { localStorage.removeItem(`${storageNS}:${key}`); } catch(e){}
    }
  };

  // Default video data; realistic placeholders with categories
  window.App.Data = {
    tags: ['All', 'React', 'Web', 'Tooling', 'Performance', 'Shorts'],
    videos: [
      {
        id: 'react-server-components',
        yt: '8KB3DHI-QbM',
        title: 'Server Components mental model',
        desc: 'Understand data boundaries, streaming, and when to stay client-side.',
        tags: ['React'],
        duration: '12:34',
        date: '2024-10-10',
        featured: true
      },
      {
        id: 'react-effects-mastery',
        yt: 'T3C8f1E4gYs',
        title: 'Effects that don\'t fight you',
        desc: 'A practical guide to useEffect, teardown, and race conditions.',
        tags: ['React', 'Performance'],
        duration: '10:12',
        date: '2024-09-14'
      },
      {
        id: 'tsx-patterns',
        yt: 'Jv2uxzhPFl4',
        title: 'Type-safe React patterns with TSX',
        desc: 'Props inference, generics and discriminated unions in components.',
        tags: ['React', 'Web'],
        duration: '09:45',
        date: '2024-08-02'
      },
      {
        id: 'vite-build-speed',
        yt: 'kK_Wqx3RnHk',
        title: 'Build fast with Vite',
        desc: 'HMR, code-splitting, env handling and production builds that fly.',
        tags: ['Tooling', 'Web'],
        duration: '08:01',
        date: '2024-07-21'
      },
      {
        id: 'react-forms',
        yt: '5s8Ol9uw-yM',
        title: 'Forms without the tears',
        desc: 'Validation, controlled vs uncontrolled and progressive enhancement.',
        tags: ['React'],
        duration: '11:08',
        date: '2024-06-30'
      },
      {
        id: 'micro-optimizations',
        yt: 'TjRj7VbqS5o',
        title: 'Micro-optimizations that matter',
        desc: 'Memo, transitions, and measuring what counts.',
        tags: ['Performance', 'React'],
        duration: '07:22',
        date: '2024-05-15'
      },
      {
        id: 'fetch-caching',
        yt: 'Y9n2lQvGQZY',
        title: 'Caching data requests in React apps',
        desc: 'Stale-while-revalidate, cache keys and invalidation signals.',
        tags: ['Web', 'Performance'],
        duration: '13:20',
        date: '2024-04-12'
      },
      {
        id: 'jsx-rules',
        yt: 'rN2pBOiHq9g',
        title: 'JSX rules they don\'t tell you',
        desc: 'Rendering lists, keys, refs and composition patterns.',
        tags: ['React'],
        duration: '06:55',
        date: '2024-03-03'
      },
      {
        id: 'snack-short-keys',
        yt: 'm8rd9J9DUuY',
        title: 'Short: keys in lists in 60 seconds',
        desc: 'A tiny refresher with a real bug demo.',
        tags: ['Shorts', 'React'],
        duration: '01:00',
        date: '2024-02-11'
      }
    ]
  };

  // Utilities
  window.App.Util = {
    getThumb(ytId){ return `https://i.ytimg.com/vi_webp/${ytId}/maxresdefault.webp`; },
    fmtDate(iso){
      try { const d = new Date(iso); return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }); } catch { return iso; }
    },
    qs(name){
      const url = new URL(window.location.href);
      return url.searchParams.get(name);
    },
    sanitize(str){ return String(str || '').replace(/[<>]/g, ''); },
    unique(arr){ return Array.from(new Set(arr)); }
  };
})();