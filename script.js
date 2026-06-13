// Storage Key
const STORAGE_KEY = 'mywatchlist_items';

// Initial Data
const initialData = [
    {
        id: '1',
        title: 'Avengers: Endgame',
        genre: 'Action, Sci-Fi, Adventure',
        year: '2019',
        rating: 9,
        status: 'watched',
        category: 'movie',
        poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400',
        notes: 'Film superhero terbaik! Ending yang sangat memuaskan untuk saga Infinity.',
        url: 'https://www.disneyplus.com'
    },
    {
        id: '2',
        title: 'Breaking Bad',
        genre: 'Crime, Drama, Thriller',
        year: '2008',
        rating: 10,
        status: 'watched',
        category: 'series',
        poster: 'https://images.unsplash.com/photo-1574267432644-f86fac683929?w=400',
        notes: 'Serial terbaik yang pernah saya tonton. Cerita dan karakternya sangat kuat.',
        url: 'https://www.netflix.com'
    },
    {
        id: '3',
        title: 'Attack on Titan',
        genre: 'Action, Dark Fantasy, Drama',
        year: '2013',
        rating: 9,
        status: 'watching',
        category: 'anime',
        poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400',
        notes: 'Anime dengan plot twist yang luar biasa. Masih nonton season terakhir.',
        url: 'https://www.crunchyroll.com'
    },
    {
        id: '4',
        title: 'Crash Landing on You',
        genre: 'Romance, Drama, Comedy',
        year: '2019',
        rating: 8,
        status: 'plan-to-watch',
        category: 'kdrama',
        poster: 'https://images.unsplash.com/photo-1580130732485-a26e2c0b8e3e?w=400',
        notes: 'Banyak yang merekomendasikan, penasaran ingin nonton!',
        url: 'https://www.netflix.com'
    }
];

// Load data from localStorage or use initial data
let watchItems = JSON.parse(localStorage.getItem(STORAGE_KEY)) || initialData;

// Save data to localStorage
function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchItems));
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Save initial data if localStorage is empty
    if (!localStorage.getItem(STORAGE_KEY)) {
        saveData();
    }

    // Set current year
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Hamburger menu
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Rating slider
    const ratingInput = document.getElementById('rating');
    const ratingValue = document.getElementById('ratingValue');

    ratingInput.addEventListener('input', (e) => {
        ratingValue.textContent = e.target.value;
    });

    // Form submission
    const form = document.getElementById('addForm');
    form.addEventListener('submit', handleSubmit);

    // Cancel button
    document.getElementById('cancelBtn').addEventListener('click', cancelEdit);

    // Search and filters
    document.getElementById('searchInput').addEventListener('input', filterAndRender);
    document.getElementById('filterStatus').addEventListener('change', filterAndRender);
    document.getElementById('filterCategory').addEventListener('change', filterAndRender);
    document.getElementById('sortBy').addEventListener('change', filterAndRender);

    // Initial render
    filterAndRender();
    updateStatistics();
});

// Handle form submission
function handleSubmit(e) {
    e.preventDefault();

    const editId = document.getElementById('editId').value;
    const title = document.getElementById('title').value.trim();
    const genre = document.getElementById('genre').value.trim();
    const year = document.getElementById('year').value.trim();
    const rating = parseInt(document.getElementById('rating').value);
    const status = document.getElementById('status').value;
    const category = document.getElementById('category').value;
    const poster = document.getElementById('poster').value.trim();
    const url = document.getElementById('url').value.trim();
    const notes = document.getElementById('notes').value.trim();

    if (!title || !genre || !year) {
        alert('Mohon isi semua field yang wajib!');
        return;
    }

    const item = {
        id: editId || Date.now().toString(),
        title,
        genre,
        year,
        rating,
        status,
        category,
        poster,
        url,
        notes
    };

    if (editId) {
        // Update existing item
        const index = watchItems.findIndex(i => i.id === editId);
        if (index !== -1) {
            watchItems[index] = item;
        }
    } else {
        // Add new item
        watchItems.push(item);
    }

    saveData();
    resetForm();
    filterAndRender();
    updateStatistics();

    // Scroll to collection
    document.getElementById('koleksi').scrollIntoView({ behavior: 'smooth' });
}

// Reset form
function resetForm() {
    document.getElementById('addForm').reset();
    document.getElementById('editId').value = '';
    document.getElementById('ratingValue').textContent = '5';
    document.getElementById('submitText').textContent = 'Simpan Tontonan';
    document.getElementById('cancelBtn').style.display = 'none';
}

// Cancel edit
function cancelEdit() {
    resetForm();
}

// Edit item
function editItem(id) {
    const item = watchItems.find(i => i.id === id);
    if (!item) return;

    document.getElementById('editId').value = item.id;
    document.getElementById('title').value = item.title;
    document.getElementById('genre').value = item.genre;
    document.getElementById('year').value = item.year;
    document.getElementById('rating').value = item.rating;
    document.getElementById('ratingValue').textContent = item.rating;
    document.getElementById('status').value = item.status;
    document.getElementById('category').value = item.category;
    document.getElementById('poster').value = item.poster || '';
    document.getElementById('url').value = item.url || '';
    document.getElementById('notes').value = item.notes || '';

    document.getElementById('submitText').textContent = 'Update Tontonan';
    document.getElementById('cancelBtn').style.display = 'block';

    // Scroll to form
    document.getElementById('tambah').scrollIntoView({ behavior: 'smooth' });
}

// Delete item
function deleteItem(id) {
    const item = watchItems.find(i => i.id === id);
    if (!item) return;

    if (confirm(`Apakah Anda yakin ingin menghapus "${item.title}"?`)) {
        watchItems = watchItems.filter(i => i.id !== id);
        saveData();
        filterAndRender();
        updateStatistics();
    }
}

// Open watch URL
function openWatchUrl(url) {
    if (url) {
        window.open(url, '_blank');
    }
}

// Get status label
function getStatusLabel(status) {
    const labels = {
        'watched': 'Sudah Ditonton',
        'watching': 'Sedang Ditonton',
        'plan-to-watch': 'Ingin Ditonton'
    };
    return labels[status] || status;
}

// Get category label
function getCategoryLabel(category) {
    const labels = {
        'movie': 'Film',
        'anime': 'Anime',
        'series': 'Donghua',
        'kdrama': 'Drama China'
    };
    return labels[category] || category;
}

// Get status class
function getStatusClass(status) {
    return `status-${status}`;
}

// Filter and render items
function filterAndRender() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const filterStatus = document.getElementById('filterStatus').value;
    const filterCategory = document.getElementById('filterCategory').value;
    const sortBy = document.getElementById('sortBy').value;

    let filtered = watchItems.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery);
        const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
        const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    // Sort
    filtered.sort((a, b) => {
        if (sortBy === 'rating') {
            return b.rating - a.rating;
        } else {
            return parseInt(b.year) - parseInt(a.year);
        }
    });

    renderItems(filtered);
}

// Render items
function renderItems(items) {
    const grid = document.getElementById('collectionGrid');
    const emptyState = document.getElementById('emptyState');
    const totalCount = document.getElementById('totalCount');

    totalCount.textContent = watchItems.length;

    if (items.length === 0) {
        grid.innerHTML = '';
        emptyState.style.display = 'block';
        if (watchItems.length === 0) {
            emptyState.innerHTML = '<p>Belum ada tontonan. Tambahkan sekarang!</p>';
        } else {
            emptyState.innerHTML = '<p>Tidak ada hasil yang ditemukan.</p>';
        }
        return;
    }

    emptyState.style.display = 'none';

    grid.innerHTML = items.map(item => `
        <div class="card">
            <div class="card-poster" onclick="openWatchUrl('${item.url || ''}')">
                ${item.poster ? `
                    <img src="${item.poster}" alt="${item.title}" onerror="this.style.display='none'">
                ` : `
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                `}
                <div class="card-category">${getCategoryLabel(item.category)}</div>
                ${item.url ? `
                    <div class="card-overlay">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                    </div>
                ` : ''}
            </div>
            <div class="card-content">
                <h3 class="card-title">${item.title}</h3>
                <p class="card-genre">${item.genre}</p>
                <div class="card-info">
                    <span class="card-year">${item.year}</span>
                    <div class="card-rating">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                        <span>${item.rating}/10</span>
                    </div>
                </div>
                <span class="card-status ${getStatusClass(item.status)}">${getStatusLabel(item.status)}</span>
                ${item.notes ? `<p class="card-notes">${item.notes}</p>` : ''}
                <div class="card-actions">
                    <button onclick="editItem('${item.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Edit
                    </button>
                    <button class="delete-btn" onclick="deleteItem('${item.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Hapus
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Update statistics
function updateStatistics() {
    const total = watchItems.length;
    const watched = watchItems.filter(i => i.status === 'watched').length;
    const watching = watchItems.filter(i => i.status === 'watching').length;
    const plan = watchItems.filter(i => i.status === 'plan-to-watch').length;

    const averageRating = total > 0
        ? (watchItems.reduce((sum, item) => sum + item.rating, 0) / total).toFixed(1)
        : '0.0';

    document.getElementById('statTotal').textContent = total;
    document.getElementById('statWatched').textContent = watched;
    document.getElementById('statWatching').textContent = watching;
    document.getElementById('statPlan').textContent = plan;
    document.getElementById('averageRating').textContent = averageRating;
    document.getElementById('averageTotal').textContent = total;
}