/**
 * Helix Admin Panel
 * Manages facility onboarding submissions with sorting and filtering
 */

const apiMode = typeof HelixAdminApi !== 'undefined' && HelixAdminApi.enabled();
const mockFacilities = apiMode ? [] : generateMockData();

// State
let currentUser = null;
let filteredData = [...mockFacilities];
let apiListTotal = 0;
let apiListPages = 1;
let currentPage = 1;
let perPage = 25;
let sortField = 'submitted_at';
let sortDirection = 'desc';
let currentDetailId = null;
let detailCache = null;

// Custom select registry (native select -> { refresh, setValue, close })
const customSelectRegistry = new WeakMap();
let customSelectOutsideListener = false;

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const loginForm = document.getElementById('login-form');
const tableBody = document.getElementById('table-body');
const detailModal = document.getElementById('detail-modal');
const detailBody = document.getElementById('detail-body');
const detailTitle = document.getElementById('detail-title');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initCustomSelects();
  initEventListeners();
  checkAuth();
});

// ---------------------------------------------------------------------------
// Custom select — styled dropdown; native <select> kept for values & events
// ---------------------------------------------------------------------------
function initCustomSelects() {
  document
    .querySelectorAll('#dashboard-screen select.field')
    .forEach(enhanceSelect);
}

function enhanceSelect(nativeSelect) {
  if (!nativeSelect || customSelectRegistry.has(nativeSelect)) {
    return customSelectRegistry.get(nativeSelect);
  }

  const isSm = nativeSelect.classList.contains('sm');
  const wrapper = document.createElement('div');
  wrapper.className = 'custom-select' + (isSm ? ' custom-select--sm' : '');

  nativeSelect.classList.add('custom-select-native');
  const parent = nativeSelect.parentNode;
  parent.insertBefore(wrapper, nativeSelect);
  wrapper.appendChild(nativeSelect);

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'custom-select__trigger field' + (isSm ? ' sm' : '');
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');
  const listId = `${nativeSelect.id || 'select'}-listbox`;
  trigger.setAttribute('aria-controls', listId);

  const labelSpan = document.createElement('span');
  labelSpan.className = 'custom-select__label';

  const chevron = document.createElement('span');
  chevron.className = 'custom-select__chevron';
  chevron.setAttribute('aria-hidden', 'true');
  chevron.innerHTML =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';

  trigger.append(labelSpan, chevron);

  const menu = document.createElement('ul');
  menu.className = 'custom-select__menu';
  menu.id = listId;
  menu.setAttribute('role', 'listbox');

  wrapper.append(trigger, menu);

  function syncTriggerLabel() {
    const opt = nativeSelect.selectedOptions[0];
    labelSpan.textContent = opt ? opt.textContent : '';
  }

  function buildOptions() {
    menu.innerHTML = '';
    Array.from(nativeSelect.options).forEach((opt) => {
      const li = document.createElement('li');
      li.setAttribute('role', 'none');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'custom-select__option';
      btn.setAttribute('role', 'option');
      btn.setAttribute('aria-selected', opt.selected ? 'true' : 'false');
      btn.dataset.value = opt.value;
      if (opt.selected) btn.classList.add('is-selected');

      const text = document.createElement('span');
      text.textContent = opt.textContent;
      const check = document.createElement('span');
      check.className = 'custom-select__check';
      check.setAttribute('aria-hidden', 'true');
      check.innerHTML =
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>';

      btn.append(text, check);
      btn.addEventListener('click', () => setValue(opt.value, true));
      li.appendChild(btn);
      menu.appendChild(li);
    });
    syncTriggerLabel();
  }

  function setValue(value, dispatchChange = true) {
    nativeSelect.value = value;
    buildOptions();
    close();
    if (dispatchChange) {
      nativeSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function open() {
    closeAllCustomSelects(wrapper);
    wrapper.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
  }

  function close() {
    wrapper.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
  }

  trigger.addEventListener('click', () => {
    if (wrapper.classList.contains('is-open')) close();
    else open();
  });

  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open();
    }
    if (e.key === 'Escape') close();
  });

  menu.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      close();
      trigger.focus();
    }
  });

  nativeSelect.addEventListener('change', syncTriggerLabel);

  if (!customSelectOutsideListener) {
    customSelectOutsideListener = true;
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.custom-select')) {
        closeAllCustomSelects();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllCustomSelects();
    });
  }

  buildOptions();

  const api = { refresh: buildOptions, setValue, close, wrapper };
  customSelectRegistry.set(nativeSelect, api);
  return api;
}

function refreshCustomSelect(nativeSelect) {
  const api = customSelectRegistry.get(nativeSelect);
  if (api) api.refresh();
}

function setCustomSelectValue(nativeSelect, value, dispatchChange = false) {
  const api = customSelectRegistry.get(nativeSelect);
  if (api) api.setValue(value, dispatchChange);
  else nativeSelect.value = value;
}

function closeAllCustomSelects(exceptWrapper = null) {
  document.querySelectorAll('.custom-select.is-open').forEach((el) => {
    if (exceptWrapper && el === exceptWrapper) return;
    el.classList.remove('is-open');
    const trigger = el.querySelector('.custom-select__trigger');
    trigger?.setAttribute('aria-expanded', 'false');
  });
}

// Event Listeners
function initEventListeners() {
  // Login
  loginForm?.addEventListener('submit', handleLogin);
  document.getElementById('logout-btn')?.addEventListener('click', handleLogout);
  
  // Filters
  const filterChanged = () => {
    currentPage = 1;
    applyFilters();
  };
  document.getElementById('search-input')?.addEventListener('input', debounce(filterChanged, 300));
  document.getElementById('status-filter')?.addEventListener('change', filterChanged);
  document.getElementById('region-filter')?.addEventListener('change', filterChanged);
  document.getElementById('type-filter')?.addEventListener('change', filterChanged);
  document.getElementById('date-from')?.addEventListener('change', filterChanged);
  document.getElementById('date-to')?.addEventListener('change', filterChanged);
  document.getElementById('clear-filters')?.addEventListener('click', clearFilters);
  
  // Sorting
  document.querySelectorAll('.data-table th.sortable').forEach(th => {
    th.addEventListener('click', () => handleSort(th.dataset.sort));
  });
  
  // Pagination
  document.getElementById('per-page')?.addEventListener('change', async (e) => {
    perPage = parseInt(e.target.value, 10);
    currentPage = 1;
    if (apiMode) await applyFilters();
    else renderTable();
  });
  document.getElementById('prev-page')?.addEventListener('click', () => changePage(currentPage - 1));
  document.getElementById('next-page')?.addEventListener('click', () => changePage(currentPage + 1));
  
  // Actions
  document.getElementById('refresh-btn')?.addEventListener('click', () => {
    applyFilters();
    showToast('Data refreshed', 'success');
  });
  document.getElementById('export-all-btn')?.addEventListener('click', exportAllData);
  document.getElementById('close-detail')?.addEventListener('click', closeDetailModal);
  document.getElementById('detail-export')?.addEventListener('click', exportCurrentDetail);
  document.getElementById('detail-reminder')?.addEventListener('click', sendDetailReminder);
  
  // Status actions
  document.getElementById('status-pending')?.addEventListener('click', () => updateStatus('pending'));
  document.getElementById('status-approved')?.addEventListener('click', () => updateStatus('approved'));
  document.getElementById('status-rejected')?.addEventListener('click', () => updateStatus('rejected'));
  
  // Close modal on overlay click
  detailModal?.addEventListener('click', (e) => {
    if (e.target === detailModal) closeDetailModal();
  });
}

// Auth Functions
function checkAuth() {
  if (apiMode && HelixAdminApi.getToken()) {
    const saved = localStorage.getItem('helix_admin_user');
    currentUser = saved ? JSON.parse(saved) : { email: 'admin', name: 'Admin' };
    showDashboard();
    return;
  }
  const saved = localStorage.getItem('helix_admin_user');
  if (saved) {
    currentUser = JSON.parse(saved);
    showDashboard();
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('admin-email').value;
  const password = document.getElementById('admin-password').value;
  if (apiMode) {
    try {
      await HelixAdminApi.login(email, password);
      currentUser = { email, name: email.split('@')[0] };
      localStorage.setItem('helix_admin_user', JSON.stringify(currentUser));
      showDashboard();
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
    }
    return;
  }
  currentUser = { email, name: email.split('@')[0] };
  localStorage.setItem('helix_admin_user', JSON.stringify(currentUser));
  showDashboard();
}

function handleLogout() {
  currentUser = null;
  localStorage.removeItem('helix_admin_user');
  if (apiMode) HelixAdminApi.logout();
  showLogin();
}

function showLogin() {
  loginScreen.classList.remove('hidden');
  dashboardScreen.classList.add('hidden');
}

async function showDashboard() {
  loginScreen.classList.add('hidden');
  dashboardScreen.classList.remove('hidden');
  document.getElementById('admin-user').textContent = currentUser?.name || 'Admin';

  if (apiMode) {
    try {
      await applyFilters();
      await updateStats();
      await populateFiltersFromApi();
    } catch (err) {
      showToast(err.message || 'Could not load submissions', 'error');
    }
    return;
  }

  populateFilters();
  updateStats();
  renderTable();
}

async function populateFiltersFromApi() {
  const res = await HelixAdminApi.listSubmissions({ per_page: 500, page: 1 });
  const regions = [...new Set(res.items.map(f => f.region).filter(Boolean))].sort();
  const types = [...new Set(res.items.map(f => f.facility_type).filter(Boolean))].sort();
  const regionSelect = document.getElementById('region-filter');
  const typeSelect = document.getElementById('type-filter');
  [regionSelect, typeSelect].forEach((sel) => {
    if (!sel) return;
    while (sel.options.length > 1) sel.remove(1);
  });
  regions.forEach((r) => {
    const opt = document.createElement('option');
    opt.value = r;
    opt.textContent = r;
    regionSelect?.appendChild(opt);
  });
  types.forEach((t) => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    typeSelect?.appendChild(opt);
  });
  refreshCustomSelect(regionSelect);
  refreshCustomSelect(typeSelect);
}

// Filter & Sort Functions
function populateFilters() {
  const source = apiMode ? filteredData : mockFacilities;
  const regions = [...new Set(source.map(f => f.region).filter(Boolean))].sort();
  const types = [...new Set(source.map(f => f.facility_type).filter(Boolean))].sort();

  const regionSelect = document.getElementById('region-filter');
  const typeSelect = document.getElementById('type-filter');

  [regionSelect, typeSelect].forEach((sel) => {
    if (!sel) return;
    while (sel.options.length > 1) sel.remove(1);
  });

  regions.forEach((r) => {
    const opt = document.createElement('option');
    opt.value = r;
    opt.textContent = r;
    regionSelect?.appendChild(opt);
  });

  types.forEach((t) => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    typeSelect?.appendChild(opt);
  });

  refreshCustomSelect(regionSelect);
  refreshCustomSelect(typeSelect);
}

async function applyFilters() {
  const search = document.getElementById('search-input')?.value || '';
  const status = document.getElementById('status-filter')?.value || '';
  const region = document.getElementById('region-filter')?.value || '';
  const type = document.getElementById('type-filter')?.value || '';
  const dateFrom = document.getElementById('date-from')?.value || '';
  const dateTo = document.getElementById('date-to')?.value || '';

  if (apiMode) {
    try {
      const res = await HelixAdminApi.listSubmissions({
        search,
        status,
        region,
        facility_type: type,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        sort: sortField,
        order: sortDirection,
        page: currentPage,
        per_page: perPage,
      });
      filteredData = res.items;
      apiListTotal = res.total;
      apiListPages = res.pages;
      renderTable();
      if (currentPage === 1) updateStats();
    } catch (err) {
      showToast(err.message || 'Failed to load data', 'error');
    }
    return;
  }

  const searchLower = search.toLowerCase();
  filteredData = mockFacilities.filter(f => {
    // Search
    if (searchLower) {
      const searchable = `${f.facility_name} ${f.facility_email} ${f.city}`.toLowerCase();
      if (!searchable.includes(searchLower)) return false;
    }
    
    // Status
    if (status && f.status !== status) return false;
    
    // Region
    if (region && f.region !== region) return false;
    
    // Type
    if (type && f.facility_type !== type) return false;
    
    // Date range
    if (dateFrom || dateTo) {
      const date = new Date(f.submitted_at);
      if (dateFrom && date < new Date(dateFrom)) return false;
      if (dateTo && date > new Date(dateTo + 'T23:59:59')) return false;
    }
    
    return true;
  });
  
  // Apply sorting
  sortData();
  
  currentPage = 1;
  renderTable();
  updateStats();
}

function clearFilters() {
  document.getElementById('search-input').value = '';
  setCustomSelectValue(document.getElementById('status-filter'), '');
  setCustomSelectValue(document.getElementById('region-filter'), '');
  setCustomSelectValue(document.getElementById('type-filter'), '');
  document.getElementById('date-from').value = '';
  document.getElementById('date-to').value = '';
  currentPage = 1;
  applyFilters();
}

async function handleSort(field) {
  if (sortField === field) {
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    sortField = field;
    sortDirection = 'asc';
  }

  document.querySelectorAll('.data-table th').forEach(th => {
    th.classList.remove('asc', 'desc');
    if (th.dataset.sort === field) {
      th.classList.add(sortDirection);
    }
  });

  if (apiMode) {
    await applyFilters();
    return;
  }

  sortData();
  renderTable();
}

function sortData() {
  filteredData.sort((a, b) => {
    let va = a[sortField];
    let vb = b[sortField];
    
    // Handle null/undefined
    if (va == null) va = '';
    if (vb == null) vb = '';
    
    // Date comparison
    if (sortField === 'submitted_at') {
      va = new Date(va).getTime();
      vb = new Date(vb).getTime();
    }
    
    // String comparison
    if (typeof va === 'string') va = va.toLowerCase();
    if (typeof vb === 'string') vb = vb.toLowerCase();
    
    if (va < vb) return sortDirection === 'asc' ? -1 : 1;
    if (va > vb) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
}

// Pagination
async function changePage(page) {
  const totalPages = apiMode ? apiListPages : Math.ceil(filteredData.length / perPage);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  if (apiMode) await applyFilters();
  else renderTable();
}

// Render Functions
function renderTable() {
  const start = apiMode ? (currentPage - 1) * perPage : (currentPage - 1) * perPage;
  const total = apiMode ? apiListTotal : filteredData.length;
  const end = apiMode ? Math.min(start + filteredData.length, total) : Math.min(start + perPage, filteredData.length);
  const pageData = apiMode ? filteredData : filteredData.slice(start, end);
  
  if (pageData.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="10" class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M3 9h18M9 21V9"/>
          </svg>
          <h3>No facilities found</h3>
          <p>Try adjusting your filters or search criteria</p>
        </td>
      </tr>
    `;
  } else {
    tableBody.innerHTML = pageData.map(f => `
      <tr data-id="${f.id}">
        <td class="facility-cell" title="${escapeHtml(f.facility_name)}">${escapeHtml(f.facility_name)}</td>
        <td class="email-cell" title="${escapeHtml(f.facility_email)}">${escapeHtml(f.facility_email)}</td>
        <td>${escapeHtml(f.region || '-')}</td>
        <td>${escapeHtml(f.city || '-')}</td>
        <td>${escapeHtml(f.facility_type || '-')}</td>
        <td>${f.submitted ? formatDateTime(f.submitted_at) : '<span class="muted-cell">Draft</span>'}</td>
        <td class="last-submit-cell">${f.last_submitted_at ? formatDateTime(f.last_submitted_at) : (f.submitted && f.submitted_at ? formatDateTime(f.submitted_at) : '<span class="muted-cell">—</span>')}</td>
        <td><span class="status-badge ${f.status}">${f.status}</span></td>
        <td>
          <span class="file-count ${f.fileCount > 0 ? 'has-files' : ''}">
            ${f.fileCount}/5 files
          </span>
        </td>
        <td class="actions-cell">
          <button class="btn sm" onclick="openDetail('${f.id}')">View</button>
          <button class="btn ghost sm" onclick="exportFacility('${f.id}')">Export</button>
        </td>
      </tr>
    `).join('');
  }
  
  // Update pagination info
  document.getElementById('page-start').textContent = total > 0 ? start + 1 : 0;
  document.getElementById('page-end').textContent = apiMode ? start + pageData.length : end;
  document.getElementById('page-total').textContent = total;

  document.getElementById('prev-page').disabled = currentPage === 1;
  document.getElementById('next-page').disabled = currentPage >= (apiMode ? apiListPages : Math.ceil(filteredData.length / perPage));

  renderPageNumbers();
}

function renderPageNumbers() {
  const totalPages = apiMode ? apiListPages : Math.ceil(filteredData.length / perPage);
  const container = document.getElementById('page-numbers');
  container.innerHTML = '';
  
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }
  
  for (let i = start; i <= end; i++) {
    const btn = document.createElement('button');
    btn.className = `btn page-btn ${i === currentPage ? 'active' : 'ghost'}`;
    btn.textContent = i;
    btn.addEventListener('click', () => changePage(i));
    container.appendChild(btn);
  }
}

async function updateStats() {
  if (apiMode) {
    try {
      const s = await HelixAdminApi.getStats();
      document.getElementById('stat-total').textContent = s.total;
      document.getElementById('stat-pending').textContent = s.pending;
      document.getElementById('stat-approved').textContent = s.approved;
      document.getElementById('stat-uploads').textContent = s.files_attached;
    } catch {
      /* keep previous values */
    }
    return;
  }
  document.getElementById('stat-total').textContent = mockFacilities.length;
  document.getElementById('stat-pending').textContent = mockFacilities.filter(f => f.status === 'pending').length;
  document.getElementById('stat-approved').textContent = mockFacilities.filter(f => f.status === 'approved').length;
  document.getElementById('stat-uploads').textContent = mockFacilities.reduce((sum, f) => sum + f.fileCount, 0);
}

const CARD_ICONS = {
  teal: '<path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/>',
  blue: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>',
  amber: '<path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>',
  violet: '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
  emerald: '<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
};

function formatAnswerValue(value) {
  if (value === null || value === undefined || value === '') return null;
  return String(value);
}

function buildDrawerCard(title, icon, bodyHtml) {
  const iconPath = CARD_ICONS[icon] || CARD_ICONS.teal;
  return `
    <div class="drawer-card">
      <div class="card-header">
        <div class="card-header-icon ${icon}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${iconPath}</svg>
        </div>
        <h3>${title}</h3>
      </div>
      <div class="card-body">${bodyHtml}</div>
    </div>
  `;
}

function buildInfoGrid(items) {
  return `
    <div class="info-grid">
      ${items.map((f) => `
        <div class="info-item ${f.full ? 'full-width' : ''}">
          <span class="info-label">${f.label}</span>
          <span class="info-value ${!f.value ? 'empty' : ''}">${f.value || 'Not provided'}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function getOnboardingSchema() {
  return typeof HelixOnboardingSchema !== 'undefined' ? HelixOnboardingSchema : null;
}

function mergedAnswers(facility) {
  const a = { ...(facility.answers || {}) };
  const denorm = {
    facility_name: facility.facility_name,
    facility_type: facility.facility_type,
    facility_region: facility.region,
    facility_city: facility.city,
    facility_address: facility.facility_address,
    facility_email: facility.facility_email,
    facility_phone: facility.facility_phone,
    primary_name: facility.primary_contact_name,
    primary_email: facility.primary_contact_email,
    primary_phone: facility.primary_contact_phone,
    secondary_name: facility.secondary_contact_name,
    secondary_email: facility.secondary_contact_email,
    secondary_phone: facility.secondary_contact_phone,
  };
  Object.entries(denorm).forEach(([key, value]) => {
    if (value != null && value !== '' && (a[key] == null || a[key] === '')) {
      a[key] = value;
    }
  });
  return a;
}

function formatFieldDisplay(field, raw) {
  const value = formatAnswerValue(raw);
  if (value === null) return null;
  if (field.type === 'email') return mailtoLink(value);
  return escapeHtml(value);
}

function buildSchemaSection(section, answers, { showEmpty = true } = {}) {
  const items = section.fields
    .map((field) => {
      const display = formatFieldDisplay(field, answers[field.key]);
      if (!showEmpty && display === null) return null;
      return {
        label: field.label,
        value: display || 'Not provided',
        empty: display === null,
        full: field.type === 'textarea' || field.type === 'email',
      };
    })
    .filter((item) => showEmpty || !item.empty);

  if (items.length === 0) {
    return buildDrawerCard(
      section.title,
      section.icon,
      '<p class="section-empty">No responses recorded for this section</p>'
    );
  }

  return buildDrawerCard(section.title, section.icon, buildInfoGrid(items));
}

function buildSubmissionMetaCard(facility) {
  const schema = getOnboardingSchema();
  const phaseLabel = schema?.portalPhaseLabels?.[facility.portal_phase]
    || (facility.portal_phase || 'checklist').replace(/_/g, ' ');

  const rows = [
    { label: 'Record status', value: facility.submitted ? 'Submitted' : 'Draft (not submitted)' },
    { label: 'Review status', value: facility.status },
    { label: 'Portal step', value: phaseLabel },
    { label: 'This record submitted', value: facility.submitted_at ? formatDateTime(facility.submitted_at) : 'Not yet' },
    {
      label: 'Last submit by facility',
      value: facility.last_submitted_at ? formatDateTime(facility.last_submitted_at) : 'Never',
      full: true,
    },
    { label: 'Created', value: facility.created_at ? formatDateTime(facility.created_at) : '—' },
    { label: 'Last updated', value: facility.updated_at ? formatDateTime(facility.updated_at) : '—' },
    { label: 'Facility email', value: facility.facility_email ? mailtoLink(facility.facility_email) : 'Not provided', full: true },
  ];

  return buildDrawerCard(
    'Submission timeline',
    'violet',
    buildInfoGrid(rows.map((r) => ({ ...r, empty: !r.value || r.value === '—' || r.value === 'Never' || r.value === 'Not yet' })))
  );
}

function buildUploadsMetaCard(facility) {
  const schema = getOnboardingSchema();
  const keys = schema?.uploadKeys || [
    { key: 'departments', label: 'Departments' },
    { key: 'units', label: 'Units' },
    { key: 'staff', label: 'Staff' },
    { key: 'roles', label: 'Roles' },
    { key: 'patients', label: 'Patients' },
  ];
  const meta = facility.uploads_meta || {};
  const items = keys.map(({ key, label }) => {
    const entry = meta[key];
    let value = 'Not uploaded';
    if (entry && typeof entry === 'object') {
      value = entry.file_name || entry.name || 'Uploaded';
    } else if (entry) {
      value = String(entry);
    }
    const uploaded = value !== 'Not uploaded';
    return { label, value: escapeHtml(value), empty: !uploaded };
  });

  return buildDrawerCard('Template uploads (portal)', 'emerald', buildInfoGrid(items));
}

function buildExtraAnswersCard(answers) {
  const schema = getOnboardingSchema();
  if (!schema?.knownKeys) return '';

  const extras = Object.entries(answers).filter(([key, val]) => {
    if (schema.knownKeys.has(key)) return false;
    return formatAnswerValue(val) !== null;
  });
  if (extras.length === 0) return '';

  const items = extras.map(([key, val]) => ({
    label: key.replace(/_/g, ' '),
    value: escapeHtml(String(val)),
    full: String(val).length > 40,
  }));

  return buildDrawerCard('Additional fields', 'amber', buildInfoGrid(items));
}

function shortRefId(id) {
  if (!id) return '—';
  const s = String(id);
  return s.length > 8 ? s.slice(0, 8) : s;
}

function mailtoLink(email) {
  if (!email) return '';
  return `<a class="contact-link" href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>`;
}

// Detail View
async function openDetail(id) {
  let facility;
  if (apiMode) {
    try {
      facility = await HelixAdminApi.getSubmission(id);
      detailCache = facility;
    } catch (err) {
      showToast(err.message || 'Could not load submission', 'error');
      return;
    }
  } else {
    facility = mockFacilities.find(f => f.id === id);
  }
  if (!facility) return;
  
  currentDetailId = id;
  detailTitle.textContent = facility.facility_name;
  
  // Subtitle
  const subtitle = document.getElementById('detail-subtitle');
  if (subtitle) {
    subtitle.textContent = [facility.facility_type, facility.region].filter(Boolean).join(' · ');
  }
  
  const answers = mergedAnswers(facility);
  const schema = getOnboardingSchema();

  // Meta bar: status, completion, last submit, short ref
  const metaBar = document.getElementById('drawer-meta');
  if (metaBar) {
    const pct = facility.completionPercentage ?? 0;
    const circumference = 2 * Math.PI * 15.5;
    const dashLength = (pct / 100) * circumference;
    const completionColor = pct >= 90 ? '#059669' : pct >= 70 ? '#d97706' : '#dc2626';
    const lastSubmitLabel = facility.last_submitted_at
      ? formatDateTime(facility.last_submitted_at)
      : 'Never';

    metaBar.innerHTML = `
      <div class="meta-chip">
        <span class="status-badge ${facility.status}">${facility.status}</span>
      </div>
      <div class="meta-chip completion-chip">
        <div class="completion-ring">
          <svg viewBox="0 0 36 36">
            <circle class="ring-bg" cx="18" cy="18" r="15.5"/>
            <circle class="ring-fill" cx="18" cy="18" r="15.5"
              stroke="${completionColor}"
              stroke-dasharray="${dashLength} ${circumference}"
              transform="rotate(-90 18 18)"/>
          </svg>
          <span class="ring-value">${pct}%</span>
        </div>
        <span class="meta-label">Checklist</span>
      </div>
      <div class="meta-chip meta-highlight">
        <div class="meta-col">
          <span class="meta-label">Last submit</span>
          <span class="meta-value">${lastSubmitLabel}</span>
        </div>
      </div>
      <div class="meta-chip meta-id-chip" title="${escapeHtml(facility.id)}">
        <div class="meta-col">
          <span class="meta-label">Ref</span>
          <span class="meta-value mono">${shortRefId(facility.id)}</span>
        </div>
      </div>
    `;
  }

  const metaCard = buildSubmissionMetaCard(facility);
  const uploadsMetaCard = buildUploadsMetaCard(facility);
  const checklistSections = (schema?.sections || []).map((s) => buildSchemaSection(s, answers)).join('');
  const extraCard = buildExtraAnswersCard(answers);
  
  // --- Attached Files Card ---
  const filesHtml = facility.files && facility.files.length > 0
    ? facility.files.map((file) => `
        <div class="file-row">
          <div class="file-icon-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <div class="file-details">
            <div class="file-name">${escapeHtml(file.name)}</div>
            <div class="file-meta">${formatBytes(file.size)} · ${formatDate(file.uploadedAt)}${file.upload_key ? ` · ${escapeHtml(file.upload_key)}` : ''}</div>
          </div>
          <span class="file-badge ${file.status}">${file.status}</span>
          ${apiMode && file.upload_key ? `
            <button type="button" class="file-download-btn" data-upload-key="${escapeHtml(file.upload_key)}" data-filename="${escapeHtml(file.name)}" title="Download">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </button>` : ''}
        </div>
      `).join('')
    : '<p class="no-files">No files attached to this submission</p>';
  
  const filesCard = buildDrawerCard(
    `Attached Files (${facility.fileCount || 0})`,
    'emerald',
    `<div class="files-list">${filesHtml}</div>`
  );
  
  detailBody.innerHTML = metaCard + checklistSections + uploadsMetaCard + filesCard + extraCard;

  detailBody.querySelectorAll('.file-download-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (!apiMode || !currentDetailId) return;
      try {
        await HelixAdminApi.downloadFile(
          currentDetailId,
          btn.dataset.uploadKey,
          btn.dataset.filename
        );
        showToast('File downloaded', 'success');
      } catch (err) {
        showToast(err.message || 'Download failed', 'error');
      }
    });
  });

  const reminderBtn = document.getElementById('detail-reminder');
  if (reminderBtn) {
    const canRemind = apiMode && !!facility.facility_email;
    reminderBtn.disabled = !canRemind;
    reminderBtn.title = canRemind
      ? `Send reminder to ${facility.facility_email}`
      : 'No facility email on record';
  }
  
  // Show drawer with animation
  detailModal.classList.remove('hidden');
  const panel = detailModal.querySelector('.drawer-panel');
  if (panel) {
    panel.style.animation = 'none';
    panel.offsetHeight;
    panel.style.animation = '';
  }
}

function closeDetailModal() {
  const panel = detailModal.querySelector('.drawer-panel');
  if (panel) {
    panel.style.animation = 'slideOutRight 280ms var(--ease) forwards';
    detailModal.style.animation = 'fadeOut 280ms var(--ease) forwards';
    setTimeout(() => {
      detailModal.classList.add('hidden');
      panel.style.animation = '';
      detailModal.style.animation = '';
      currentDetailId = null;
    }, 280);
  } else {
    detailModal.classList.add('hidden');
    currentDetailId = null;
  }
}

async function updateStatus(newStatus) {
  if (!currentDetailId) return;

  if (apiMode) {
    try {
      await HelixAdminApi.updateStatus(currentDetailId, newStatus);
      await applyFilters();
      await updateStats();
      await openDetail(currentDetailId);
      showToast(`Status updated to ${newStatus}`, 'success');
    } catch (err) {
      showToast(err.message || 'Update failed', 'error');
    }
    return;
  }

  const facility = mockFacilities.find(f => f.id === currentDetailId);
  if (facility) {
    facility.status = newStatus;
    applyFilters();
    openDetail(currentDetailId);
    showToast(`Status updated to ${newStatus}`, 'success');
  }
}

// Export Functions
function exportAllData() {
  const data = filteredData.map(f => ({
    id: f.id,
    facility_name: f.facility_name,
    facility_email: f.facility_email,
    region: f.region,
    city: f.city,
    facility_type: f.facility_type,
    status: f.status,
    submitted_at: f.submitted_at,
    file_count: f.fileCount,
    completion_percentage: f.completionPercentage
  }));
  
  downloadJSON(data, `helix-facilities-export-${formatDateFile(new Date())}.json`);
  showToast(`Exported ${data.length} facilities`, 'success');
}

async function exportFacility(id) {
  let facility;
  if (apiMode) {
    try {
      facility = await HelixAdminApi.getSubmission(id);
    } catch (err) {
      showToast(err.message || 'Export failed', 'error');
      return;
    }
  } else {
    facility = mockFacilities.find(f => f.id === id);
  }
  if (facility) {
    const name = (facility.facility_name || 'facility').toLowerCase().replace(/\s+/g, '-');
    downloadJSON(facility, `${name}-data.json`);
    showToast('Facility data exported', 'success');
  }
}

function exportCurrentDetail() {
  if (currentDetailId) {
    exportFacility(currentDetailId);
  }
}

async function sendDetailReminder() {
  if (!currentDetailId || !apiMode) return;
  const btn = document.getElementById('detail-reminder');
  if (btn) btn.disabled = true;
  try {
    const res = await HelixAdminApi.sendReminder(currentDetailId);
    showToast(res.message || 'Reminder sent', 'success');
  } catch (err) {
    showToast(err.message || 'Could not send reminder', 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
}

function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Utility Functions
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleString('en-GB', { 
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function formatDateFile(date) {
  return date.toISOString().split('T')[0];
}

function formatBytes(bytes) {
  if (!bytes) return '-';
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

function debounce(fn, ms) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), ms);
  };
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Mock Data Generator
function generateMockData() {
  const regions = ['Greater Accra', 'Ashanti', 'Western', 'Eastern', 'Central', 'Northern'];
  const types = ['Hospital', 'Clinic', 'Health Center', 'Teaching Hospital', 'Private Hospital'];
  const statuses = ['pending', 'approved', 'rejected', 'incomplete'];
  const statusWeights = [0.5, 0.3, 0.1, 0.1];
  
  const facilities = [
    'Korle Bu Teaching Hospital',
    'Komfo Anokye Teaching Hospital',
    '37 Military Hospital',
    'Ridge Hospital',
    'Princess Marie Louise Hospital',
    'La General Hospital',
    'Tema General Hospital',
    'Sunny Medical Center',
    'Holy Trinity Hospital',
    'Lekma Hospital',
    'Battor Catholic Hospital',
    'Ho Teaching Hospital',
    'Tamale Teaching Hospital',
    'Wa Regional Hospital',
    'Sunyani Regional Hospital',
    'Cape Coast Teaching Hospital',
    'Effia Nkwanta Hospital',
    'Dunkwa Government Hospital',
    'Obuasi Government Hospital',
    'Konongo Government Hospital',
    'Ejisu Government Hospital',
    'Agogo Government Hospital',
    'Nkawie Government Hospital',
    'Mampong Government Hospital',
    'Sekondi European Hospital',
    'Takoradi Hospital',
    'Axim Government Hospital',
    'Half Assini Hospital',
    'Keta Hospital',
    'Hohoe Municipal Hospital',
  ];
  
  return facilities.map((name, i) => {
    const region = regions[Math.floor(Math.random() * regions.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const status = weightedRandom(statuses, statusWeights);
    const fileCount = Math.floor(Math.random() * 6); // 0-5 files
    
    const files = fileCount > 0 ? Array(fileCount).fill(0).map((_, fi) => ({
      name: `${['departments', 'units', 'staff', 'roles', 'patients'][fi]}.csv`,
      size: Math.floor(Math.random() * 500000) + 1000,
      uploadedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: Math.random() > 0.2 ? 'valid' : 'invalid'
    })) : [];
    
    return {
      id: `FAC-${String(i + 1).padStart(4, '0')}`,
      facility_name: name,
      facility_email: `${name.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9.]/g, '')}@facility.health`,
      facility_phone: `+233 ${Math.floor(Math.random() * 900000000 + 100000000)}`,
      region: region,
      city: region.split(' ')[0] + ' City',
      facility_address: `${Math.floor(Math.random() * 200) + 1} ${['Main', 'Hospital', 'Medical', 'Health'][Math.floor(Math.random() * 4)]} Road`,
      facility_type: type,
      
      // Contact persons
      primary_contact_name: `Dr. ${['Kwame', 'Kofi', 'Ama', 'Akua', 'Kwesi'][Math.floor(Math.random() * 5)]} ${['Mensah', 'Addo', 'Owusu', 'Boateng', 'Osei'][Math.floor(Math.random() * 5)]}`,
      primary_contact_email: `admin.${i}@facility.health`,
      primary_contact_phone: `+233 ${Math.floor(Math.random() * 900000000 + 100000000)}`,
      secondary_contact_name: Math.random() > 0.5 ? `Mr. ${['John', 'Samuel', 'David', 'Michael'][Math.floor(Math.random() * 4)]} ${['Smith', 'Brown', 'Wilson', 'Davis'][Math.floor(Math.random() * 4)]}` : null,
      secondary_contact_email: Math.random() > 0.5 ? `it.${i}@facility.health` : null,
      secondary_contact_phone: Math.random() > 0.5 ? `+233 ${Math.floor(Math.random() * 900000000 + 100000000)}` : null,
      
      // Staffing
      patient_load: ['< 100', '100-500', '500-1000', '1000+'][Math.floor(Math.random() * 4)],
      his_system: ['None', 'DHIS2', 'Custom System', 'Paper Records'][Math.floor(Math.random() * 4)],
      it_support: Math.random() > 0.5 ? 'Yes' : 'No',
      internet_quality: ['Poor', 'Fair', 'Good', 'Excellent'][Math.floor(Math.random() * 4)],
      
      // Submission
      submitted_at: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
      status: status,
      fileCount: fileCount,
      files: files,
      completionPercentage: Math.floor(Math.random() * 30) + 70 // 70-100%
    };
  });
}

function weightedRandom(items, weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) return items[i];
  }
  return items[items.length - 1];
}
