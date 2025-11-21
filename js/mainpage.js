document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. CONFIGURATION & STATE
    // ==========================================
    
    const USE_MOCK_DATA = true; // Set to false when backend is ready
    const API_BASE_URL = 'https://api.your-app-domain.com/v1'; 

    let globalFoodData = []; 

    // STATE: Tracks what the user wants to see
    let currentFilters = {
        time: 'Morning', 
        categories: [],  
        dietary: [],     
        maxDistance: 10  
    };

    // ==========================================
    // 2. INITIALIZATION
    // ==========================================
    
    init();

    function init() {
        setupEventListeners();
        // Mock user data load
        const userNameEl = document.getElementById('user-name');
        if(userNameEl) userNameEl.textContent = "Gabriela";
        loadFoodData();
    }

    // ==========================================
    // 3. FETCHING DATA
    // ==========================================
    
    async function loadFoodData() {
        const container = document.getElementById('recommendation-container');
        const loadingIndicator = document.getElementById('loading-indicator');
        const errorMsg = document.getElementById('error-message');

        if (container) container.innerHTML = '';
        if (loadingIndicator) loadingIndicator.classList.remove('hidden');
        if (errorMsg) errorMsg.classList.add('hidden');

        try {
            let data;

            if (USE_MOCK_DATA) {
                await new Promise(resolve => setTimeout(resolve, 800)); // Fake delay
                data = getMockData();
            } else {
                const response = await fetch(`${API_BASE_URL}/recommendations`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                data = await response.json();
            }

            globalFoodData = data;
            renderFood(); // Render using default filters
            if (loadingIndicator) loadingIndicator.classList.add('hidden');

        } catch (error) {
            console.error("Fetch error:", error);
            if (loadingIndicator) loadingIndicator.classList.add('hidden');
            if (errorMsg) errorMsg.classList.remove('hidden');
        }
    }

    // ==========================================
    // 4. RENDERING LOGIC (The "Brain")
    // ==========================================
    
    function renderFood() {
        const container = document.getElementById('recommendation-container');
        if (!container) return;

        container.innerHTML = '';

        // --- SMART FILTERING ---
        const filtered = globalFoodData.filter(item => {
            // 1. Time Filter
            const matchTime = (currentFilters.time === 'All' || item.time_of_day === currentFilters.time || item.time_of_day === 'All');

            // 2. Category Filter
            const matchCategory = currentFilters.categories.length === 0 || currentFilters.categories.includes(item.category);

            // 3. Dietary Filter
            const matchDietary = currentFilters.dietary.length === 0 || currentFilters.dietary.includes(item.dietary);

            return matchTime && matchCategory && matchDietary;
        });

        // --- Empty State ---
        if (filtered.length === 0) {
            container.innerHTML = '<div class="text-stone-400 p-4 w-full text-center">No food found matching your filters.</div>';
            return;
        }

        // --- Generate HTML ---
        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'w-48 bg-card-bg rounded-xl shadow-md flex-shrink-0 hover:shadow-lg transition-shadow cursor-pointer mr-4';
            card.innerHTML = `
                <a href="/food-details.html?id=${item.id}" class="block">
                    <img src="${item.image_url}" alt="${item.name}" class="rounded-t-xl w-full h-28 object-cover">
                    <div class="p-3">
                        <h3 class="font-semibold text-brand-text truncate">${item.name}</h3>
                        <p class="text-sm text-brand-brown">${item.restaurant_name}</p>
                        <div class="flex justify-between items-center mt-1">
                            <p class="text-sm font-bold text-brand-caramel">RM${item.price.toFixed(2)}</p>
                            ${item.dietary ? `<span class="text-[10px] px-2 py-0.5 bg-stone-200 rounded-full text-stone-600">${item.dietary}</span>` : ''}
                        </div>
                    </div>
                </a>
            `;
            container.appendChild(card);
        });
    }

    // ==========================================
    // 5. EVENT LISTENERS
    // ==========================================
    
    function setupEventListeners() {
        
        // --- A. Time Chips ---
        const timeButtons = document.querySelectorAll('.time-chip');
        timeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Visuals
                timeButtons.forEach(b => {
                    b.classList.remove('bg-brand-caramel', 'text-white');
                    b.classList.add('bg-card-bg', 'text-brand-text');
                });
                e.target.classList.remove('bg-card-bg', 'text-brand-text');
                e.target.classList.add('bg-brand-caramel', 'text-white');

                // Logic
                currentFilters.time = e.target.getAttribute('data-time');
                renderFood();
            });
        });

        // --- B. Filter Modal & Buttons ---
        const filterModal = document.getElementById('filter-modal');
        const openBtn = document.getElementById('filter-open-btn');
        const closeBtn = document.getElementById('filter-close-btn');
        const applyBtn = document.getElementById('filter-apply-btn');
        const resetBtn = document.getElementById('filter-reset-btn');
        const retryBtn = document.getElementById('retry-btn');

        // 1. Open/Close Logic
        if (openBtn && filterModal) openBtn.addEventListener('click', () => filterModal.classList.remove('hidden'));
        if (closeBtn && filterModal) closeBtn.addEventListener('click', () => filterModal.classList.add('hidden'));
        
        // 2. Filter Chips (Visual Toggle)
        const filterChips = document.querySelectorAll('.filter-chip-btn');
        filterChips.forEach(chip => {
            chip.addEventListener('click', () => {
                if (chip.classList.contains('bg-brand-caramel')) {
                    chip.classList.remove('bg-brand-caramel', 'text-white');
                    chip.classList.add('bg-card-bg', 'text-brand-text');
                } else {
                    chip.classList.add('bg-brand-caramel', 'text-white');
                    chip.classList.remove('bg-card-bg', 'text-brand-text');
                }
            });
        });

        // 3. APPLY Button (The Real Logic)
        if (applyBtn && filterModal) {
            applyBtn.addEventListener('click', () => {
                // Reset arrays
                currentFilters.categories = [];
                currentFilters.dietary = [];

                // Find selected buttons
                const activeChips = filterModal.querySelectorAll('.filter-chip-btn.bg-brand-caramel');
                
                activeChips.forEach(chip => {
                    const val = chip.textContent.trim();
                    
                    // Sort into categories
                    if (['Halal', 'Non-Halal'].includes(val)) {
                        currentFilters.dietary.push(val);
                    } else if (['FastFood', 'Western', 'Asian', 'Desserts', 'Drinks'].includes(val)) {
                        currentFilters.categories.push(val);
                    }
                });

                // Re-render
                renderFood();
                filterModal.classList.add('hidden');
            });
        }

        // 4. Reset Button
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                // Visual Reset
                filterChips.forEach(chip => {
                    chip.classList.remove('bg-brand-caramel', 'text-white');
                    chip.classList.add('bg-card-bg', 'text-brand-text');
                });
                // Logic Reset
                currentFilters.categories = [];
                currentFilters.dietary = [];
                renderFood();
            });
        }

        // 5. Close on Click Outside
        if (filterModal) {
            filterModal.addEventListener('click', (e) => {
                if (e.target === filterModal) filterModal.classList.add('hidden');
            });
        }

        // 6. Retry Button
        if (retryBtn) retryBtn.addEventListener('click', loadFoodData);
    }

    // ==========================================
    // 6. DATA
    // ==========================================
    function getMockData() {
        return [
            { id: 101, name: "Nasi Goreng Telur", restaurant_name: "UTS Cafe", price: 4.90, time_of_day: "Morning", category: "Asian", dietary: "Halal", image_url: "https://placehold.co/200x150/D97706/FFFFFF?text=Nasi+Goreng" },
            { id: 102, name: "Kolo Mee", restaurant_name: "Wang Seng", price: 5.00, time_of_day: "Morning", category: "Asian", dietary: "Non-Halal", image_url: "https://placehold.co/200x150/C48A45/FFFFFF?text=Kolo+Mee" },
            { id: 103, name: "Chicken Rice", restaurant_name: "Old Street", price: 7.00, time_of_day: "Noon", category: "Asian", dietary: "Non-Halal", image_url: "https://placehold.co/200x150/EAB308/78350F?text=Chicken+Rice" },
            { id: 104, name: "Satay Set", restaurant_name: "Satay Kaw", price: 15.00, time_of_day: "Evening", category: "Asian", dietary: "Halal", image_url: "https://placehold.co/200x150/AF7B3E/FFFFFF?text=Satay" },
            { id: 105, name: "Beef Burger", restaurant_name: "Fuel Shack", price: 19.00, time_of_day: "Evening", category: "FastFood", dietary: "Halal", image_url: "https://placehold.co/200x150/78350F/FFFFFF?text=Burger" },
        ];
    }
});