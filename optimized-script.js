/* Optimized JS for LibraryReminder
   - Single initialization
   - Event delegation
   - Debounced search
   - Cleaner modal + notification + book management
*/

(function () {
  'use strict';

  // Simple helpers
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));
  const create = (tag, props = {}) => Object.assign(document.createElement(tag), props);

  // State
  let books = [];
  let bookId = 1;

  // Sample data (for demo)
  const sample = [
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=80&h=120&fit=crop&crop=center", borrowed: "2024-02-15", due: "2024-03-15" },
    { title: "To Kill a Mockingbird", author: "Harper Lee", cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=80&h=120&fit=crop&crop=center", borrowed: "2024-02-20", due: "2024-03-20" },
    { title: "1984", author: "George Orwell", cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=120&fit=crop&crop=center", borrowed: "2024-02-25", due: "2024-03-25" }
  ];

  // DOM Elements
  const navMenu = $('.nav-menu');
  const hamburger = document.querySelector('.hamburger');
  const booksGrid = $('#booksGrid') || document.createElement('div');
  const emptyState = $('#emptyState') || document.createElement('div');
  const searchInput = $('#bookSearch');
  const statusFilter = $('#statusFilter');

  // Utilities
  function daysUntil(dateStr) {
    const today = new Date();
    const due = new Date(dateStr + 'T23:59:59');
    const diff = Math.ceil((due - today) / (1000*60*60*24));
    return diff;
  }
  function fmt(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'});
  }

  // Notification
  function notify(msg, type='info') {
    const n = create('div');
    n.className = `notification ${type} show`;
    n.innerHTML = `<div>${msg}</div>`;
    document.body.appendChild(n);
    setTimeout(()=> n.classList.remove('show'), 4800);
    setTimeout(()=> n.remove(), 5200);
  }

  // Modal system
  function openModal(title, innerHtml) {
    const overlay = create('div'); overlay.className = 'modal-overlay';
    const box = create('div'); box.className = 'modal-content';
    box.innerHTML = `<div class="modal-header"><strong>${title}</strong><button class="modal-close">&times;</button></div><div class="modal-body">${innerHtml}</div>`;
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    setTimeout(()=>overlay.classList.add('show'),10);
    document.body.style.overflow = 'hidden';
    overlay.addEventListener('click', e => { if(e.target === overlay) closeModal(overlay); });
    $('.modal-close', box)?.addEventListener?.('click', ()=> closeModal(overlay));
    return overlay;
  }
  function closeModal(overlay) {
    if (!overlay) return;
    overlay.classList.remove('show');
    setTimeout(()=> { overlay.remove(); document.body.style.overflow = ''; }, 240);
  }

  // Render functions
  function bookCard(book, id) {
    const d = daysUntil(book.due);
    const status = d < 0 ? 'overdue' : (d <= 3 ? 'due' : 'current');
    const statusText = d < 0 ? 'Overdue' : (d <= 3 ? 'Due Soon' : 'Current');
    return `
      <div class="book-card" data-id="${id}">
        <div class="cover"><img src="${book.cover}" loading="lazy" alt="${book.title}"></div>
        <div class="book-info">
          <h4>${book.title}</h4>
          <p class="small">by ${book.author}</p>
          <div class="small">${fmt(book.borrowed)} • Due ${fmt(book.due)}</div>
          <div style="margin-top:.5rem"><span class="badge ${status}">${statusText}</span></div>
        </div>
        <div style="margin-left:auto;display:flex;gap:.4rem;align-items:center">
          <button class="btn-icon edit" title="Edit"><i class="fas fa-edit"></i></button>
          <button class="btn-icon date" title="Update Date"><i class="fas fa-calendar-alt"></i></button>
          <button class="btn-icon del" title="Delete"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `;
  }

  function renderBooks(list = books) {
    if (!booksGrid) return;
    if (list.length === 0) {
      booksGrid.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }
    emptyState.style.display = 'none';
    booksGrid.innerHTML = list.map((b,i)=>bookCard(b, b.id)).join('');
  }

  // CRUD
  function addBook(data) {
    const b = {
      id: bookId++,
      title: data.title,
      author: data.author,
      cover: data.cover || sample[0].cover,
      borrowed: data.borrowed,
      due: data.due
    };
    books.push(b); renderBooks(); notify('Book added','success');
  }
  function removeBook(id) {
    if (!confirm('Delete this book?')) return;
    books = books.filter(b=>b.id!==id); renderBooks(); notify('Deleted','success');
  }
  function updateBook(id, changes) {
    books = books.map(b=> b.id===id ? {...b,...changes} : b);
    renderBooks(); notify('Updated','success');
  }

  // Delegated click handlers
  document.addEventListener('click', (e)=> {
    const el = e.target.closest && e.target.closest('[data-id]');
    if (!el) return;
    const id = Number(el.dataset.id);
    if (e.target.closest('.del')) removeBook(id);
    if (e.target.closest('.edit')) {
      const book = books.find(b=>b.id===id);
      const html = `
        <form id="editBookForm">
          <label>Title<input name="title" value="${book.title}"></label>
          <label>Author<input name="author" value="${book.author}"></label>
          <div style="margin-top:.6rem"><button class="btn-primary" type="submit">Save</button></div>
        </form>`;
      const modal = openModal('Edit Book', html);
      modal.querySelector('#editBookForm').addEventListener('submit', ev=>{
        ev.preventDefault();
        const fd = new FormData(ev.target);
        updateBook(id, { title: fd.get('title'), author: fd.get('author') });
        closeModal(modal);
      });
    }
    if (e.target.closest('.date')) {
      const book = books.find(b=>b.id===id);
      const html = `
        <form id="dateForm">
          <label>Borrowed<input name="borrowed" type="date" value="${book.borrowed}"></label>
          <label>Due<input name="due" type="date" value="${book.due}"></label>
          <div style="margin-top:.6rem"><button class="btn-primary" type="submit">Update</button></div>
        </form>`;
      const modal = openModal('Update Dates', html);
      modal.querySelector('#dateForm').addEventListener('submit', ev=>{
        ev.preventDefault();
        const fd = new FormData(ev.target);
        updateBook(id, { borrowed: fd.get('borrowed'), due: fd.get('due') });
        closeModal(modal);
      });
    }
  });

  // Search & filter (debounced)
  function debounce(fn, delay=250){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), delay); } }
  function applyFilters() {
    const term = (searchInput?.value || '').toLowerCase();
    const status = statusFilter ? statusFilter.value : 'all';
    const filtered = books.filter(b=>{
      const matchText = b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term);
      if (!matchText) return false;
      if (status === 'all') return true;
      const d = daysUntil(b.due);
      if (status === 'current') return d > 3;
      if (status === 'due-soon') return d >=0 && d <=3;
      if (status === 'overdue') return d < 0;
      return true;
    });
    renderBooks(filtered);
  }

  // Mobile nav toggle
  function initNav() {
    if (!hamburger || !navMenu) return;
    hamburger.addEventListener('click', ()=> {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  // Init - run once
  function init() {
    // seed data
    books = sample.map((s, i)=> ({...s, id: bookId++}));
    // render
    renderBooks();
    // dom refs
    if (searchInput) searchInput.addEventListener('input', debounce(applyFilters, 220));
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);
    initNav();
    // smooth scroll for anchors
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click', e=>{
        const target = document.querySelector(a.getAttribute('href'));
        if (target) { e.preventDefault(); const offset = document.querySelector('.header')?.offsetHeight || 0; window.scrollTo({top: target.offsetTop - offset, behavior:'smooth'}); }
      });
    });
  }

  // Wait for DOM
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();