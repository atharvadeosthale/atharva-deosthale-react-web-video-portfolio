(function($){
  'use strict';
  window.App = window.App || {};

  // App state
  const state = {
    search: '',
    tag: 'All',
    favorites: new Set(),
    queue: [],
    videos: [],
    tags: []
  };

  function loadPersisted(){
    const fav = window.App.AppStorage.get('favorites', []);
    const q = window.App.AppStorage.get('queue', []);
    state.favorites = new Set(fav);
    state.queue = Array.isArray(q) ? q : [];
  }

  function saveFavorites(){ window.App.AppStorage.set('favorites', Array.from(state.favorites)); }
  function saveQueue(){ window.App.AppStorage.set('queue', state.queue); }

  function buildChip(tag){
    const active = tag === state.tag ? 'chip-active' : '';
    return $(`<button class="chip ${active}" data-tag="${tag}">${tag}</button>`);
  }

  function buildCard(v){
    const isFav = state.favorites.has(v.id);
    const favIcon = isFav ? '★' : '☆';
    const favTitle = isFav ? 'Remove favorite' : 'Add favorite';
    const thumb = window.App.Util.getThumb(v.yt);
    const tags = v.tags.map(t => `<span class="badge">${t}</span>`).join('');
    const el = $(`
      <article class="card overflow-hidden group" data-id="${v.id}">
        <div class="video-thumb aspect-video w-full overflow-hidden border-b border-white/5">
          <img src="${thumb}" alt="${window.App.Util.sanitize(v.title)} thumbnail" class="w-full h-full object-cover group-hover:scale-[1.02] transition"/>
          <span class="play-pill">${v.duration}</span>
        </div>
        <div class="p-4 flex flex-col gap-2">
          <h3 class="text-ink font-semibold text-sm line-clamp-2">${window.App.Util.sanitize(v.title)}</h3>
          <p class="text-ink/60 text-xs line-clamp-2">${window.App.Util.sanitize(v.desc)}</p>
          <div class="flex items-center justify-between mt-2">
            <div class="flex items-center gap-2 flex-wrap">${tags}</div>
            <div class="flex items-center gap-2">
              <button class="btn-ghost js-fav" title="${favTitle}">${favIcon}</button>
              <button class="btn-primary js-queue">Queue</button>
              <button class="btn-ghost js-open">Play</button>
            </div>
          </div>
        </div>
      </article>
    `);
    return el;
  }

  function renderFilters(){
    const rail = $('#filters');
    rail.empty();
    state.tags.forEach(t => rail.append(buildChip(t)));
  }

  function renderGallery(){
    const term = state.search.trim().toLowerCase();
    const filtered = window.App.Data.videos.filter(v => {
      const matchesTag = state.tag === 'All' || v.tags.includes(state.tag);
      const matchesSearch = !term || `${v.title} ${v.desc} ${v.tags.join(' ')}`.toLowerCase().includes(term);
      return matchesTag && matchesSearch;
    });
    const wrap = $('#gallery');
    wrap.empty();
    if(filtered.length === 0){ $('#empty').removeClass('hidden'); } else { $('#empty').addClass('hidden'); }
    filtered.forEach(v => wrap.append(buildCard(v)));
  }

  function updateQueueUI(){
    const list = $('#queueList');
    list.empty();
    if(state.queue.length === 0){
      list.append(`<li class="text-ink/50"><span>Your queue is empty</span></li>`);
      return;
    }
    state.queue.forEach(id => {
      const v = state.videos.find(x => x.id === id);
      if(!v) return;
      const item = $(`
        <li>
          <div class="min-w-0">
            <div class="truncate text-ink/90 text-sm">${window.App.Util.sanitize(v.title)}</div>
            <div class="text-ink/50 text-[11px]">${v.duration} • ${v.tags.join(', ')}</div>
          </div>
          <div class="flex items-center gap-2">
            <button class="btn-ghost js-play" data-id="${v.id}">Play</button>
            <button class="btn-ghost js-remove" data-id="${v.id}">Remove</button>
          </div>
        </li>
      `);
      list.append(item);
    });
  }

  function openModal(id){
    const v = state.videos.find(x => x.id === id);
    if(!v) return;
    const src = `https://www.youtube.com/embed/${v.yt}?autoplay=1&rel=0`;
    $('#modalTitle').text(v.title);
    $('#modalMeta').html(`<span class="badge">${window.App.Util.fmtDate(v.date)}</span><span class="badge">${v.duration}</span>${v.tags.map(t=>`<span class=\"badge\">${t}</span>`).join('')}`);
    $('#playerWrap').html(`<iframe class="w-full h-full" src="${src}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`);
    $('#modalFav').text(state.favorites.has(v.id) ? 'Unfavorite' : 'Favorite').data('id', v.id);
    $('#modalQueue').data('id', v.id);
    $('#videoModal').removeClass('hidden').attr('aria-hidden','false');
  }

  function closeModal(){
    $('#videoModal').addClass('hidden').attr('aria-hidden','true');
    $('#playerWrap').empty(); // stop playback
  }

  function bindEvents(){
    // Search
    $('#search').on('input', function(){ state.search = $(this).val(); renderGallery(); });

    // Keyboard shortcut
    $(document).on('keydown', function(e){
      if((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'){
        e.preventDefault(); $('#search').trigger('focus');
      }
    });

    // Filter by tag
    $('#filters').on('click', '.chip', function(){
      const tag = $(this).data('tag');
      state.tag = tag;
      renderFilters();
      renderGallery();
    });

    // Reset
    $('#clearFilters').on('click', function(){
      state.search = ''; state.tag = 'All';
      $('#search').val(''); renderFilters(); renderGallery();
    });

    // Card actions
    $('#gallery').on('click', '.js-open', function(){
      const id = $(this).closest('[data-id]').data('id');
      openModal(id);
    }).on('click', '.js-fav', function(){
      const id = $(this).closest('[data-id]').data('id');
      if(state.favorites.has(id)) state.favorites.delete(id); else state.favorites.add(id);
      saveFavorites(); renderGallery();
    }).on('click', '.js-queue', function(){
      const id = $(this).closest('[data-id]').data('id');
      if(!state.queue.includes(id)) { state.queue.push(id); saveQueue(); updateQueueUI(); }
    });

    // Modal actions
    $('#closeModal').on('click', closeModal);
    $('#videoModal').on('click', function(e){ if(e.target === this) closeModal(); });
    $(document).on('keydown', function(e){ if(e.key === 'Escape') closeModal(); });

    $('#modalFav').on('click', function(){
      const id = $(this).data('id');
      if(!id) return; if(state.favorites.has(id)) state.favorites.delete(id); else state.favorites.add(id);
      saveFavorites(); $('#modalFav').text(state.favorites.has(id) ? 'Unfavorite' : 'Favorite'); renderGallery();
    });
    $('#modalQueue').on('click', function(){
      const id = $(this).data('id'); if(!id) return;
      if(!state.queue.includes(id)) { state.queue.push(id); saveQueue(); updateQueueUI(); }
    });

    // Queue panel
    $('#queueList').on('click', '.js-remove', function(){
      const id = $(this).data('id');
      state.queue = state.queue.filter(x => x !== id); saveQueue(); updateQueueUI();
    }).on('click', '.js-play', function(){ openModal($(this).data('id')); });

    $('#clearQueue').on('click', function(){ state.queue = []; saveQueue(); updateQueueUI(); });
    $('#playQueue').on('click', function(){ if(state.queue[0]) openModal(state.queue[0]); });

    // Contact form persistence
    const draftKey = 'contact-draft';
    const setStatus = (msg, ok) => $('#contactStatus').text(msg).removeClass('text-red-400 text-green-400').addClass(ok ? 'text-green-400' : 'text-red-400');
    const loadDraft = () => {
      const d = window.App.AppStorage.get(draftKey, null);
      if(d){ $('#name').val(d.name || ''); $('#email').val(d.email || ''); $('#message').val(d.message || ''); }
    };
    loadDraft();

    $('#contactForm').on('submit', function(e){
      e.preventDefault();
      const name = $('#name').val().trim();
      const email = $('#email').val().trim();
      const message = $('#message').val().trim();
      const valid = name && message && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if(!valid) { setStatus('Please complete all fields with a valid email.', false); return; }
      const draft = { name, email, message, savedAt: Date.now() };
      window.App.AppStorage.set(draftKey, draft);
      setStatus('Draft saved locally. You can edit or copy to your email client.', true);
    });

    $('#clearDraft').on('click', function(){
      $('#name, #email, #message').val('');
      window.App.AppStorage.remove(draftKey);
      setStatus('Draft cleared.', true);
    });
  }

  function hydrateFromQuery(){
    const v = window.App.Util.qs('v');
    if(!v) return;
    const vid = state.videos.find(x => x.id === v);
    if(vid) openModal(vid.id);
  }

  // Public API
  window.App.init = function(){
    state.videos = window.App.Data.videos.slice();
    state.tags = window.App.Data.tags.slice();
    loadPersisted();
    bindEvents();
  };

  window.App.render = function(){
    renderFilters();
    renderGallery();
    updateQueueUI();
    $('#year').text(new Date().getFullYear());
    hydrateFromQuery();
  };

})(jQuery);