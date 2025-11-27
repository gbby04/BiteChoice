// --- 1. PAGE ELEMENTS ---
const logVisitForm = document.getElementById('log-visit-form');
const itemList = document.getElementById('item-list');
const addItemBtn = document.getElementById('add-item-btn');
const itemNameInput = document.getElementById('item-name');
const itemPriceInput = document.getElementById('item-price');
const totalSpentInput = document.getElementById('total-spent');
const visitDateInput = document.getElementById('visit-date');
const restaurantNameInput = document.getElementById('restaurant-name');

// This array will hold our item objects
let itemsOrdered = [];

// --- 2. FUNCTIONS ---

/**
 * Adds an item to the list and updates the total.
 */
function addItem() {
    const name = itemNameInput.value.trim();
    const price = parseFloat(itemPriceInput.value);

    // Validate input
    if (name === "" || isNaN(price) || price < 0) {
        alert("Please enter a valid item name and price.");
        return;
    }

    // Create the item object
    const item = {
        name: name,
        price: price,
        qty: 1 // For this simple form, qty is always 1
    };
    
    // Add to our JS array
    itemsOrdered.push(item);
    
    // Add to the visual list on the page
    renderItems();
    
    // Clear the input fields
    itemNameInput.value = '';
    itemPriceInput.value = '';
    itemNameInput.focus();

    // Update the total
    updateTotal();
}

/**
 * Re-draws the list of items on the page based on the itemsOrdered array.
 */
function renderItems() {
    // Clear the current list
    itemList.innerHTML = '';
    
    if (itemsOrdered.length === 0) {
        itemList.innerHTML = '<p class="text-sm text-gray-500 text-center">No items added yet.</p>';
        return;
    }

    // Add each item to the DOM
    itemsOrdered.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = "flex items-center justify-between bg-white p-2 border rounded-lg shadow-sm";
        itemEl.innerHTML = `
            <span>${item.name}</span>
            <div class="flex items-center space-x-2">
                <span class="font-semibold text-brand-text">RM ${item.price.toFixed(2)}</span>
                <button type="button" class="text-red-500 font-bold text-lg" data-index="${index}">&times;</button>
            </div>
        `;
        
        // Add click listener for the remove button
        itemEl.querySelector('button').addEventListener('click', removeItem);

        itemList.appendChild(itemEl);
    });
}

/**
 * Removes an item from the list when the 'x' is clicked.
 */
function removeItem(event) {
    const indexToRemove = parseInt(event.target.getAttribute('data-index'));
    
    // Remove from the array
    itemsOrdered.splice(indexToRemove, 1);
    
    // Re-render the list
    renderItems();
    updateTotal();
}

/**
 * Calculates the total price from the items array and fills the Total Spent input.
 */
function updateTotal() {
    let total = 0;
    itemsOrdered.forEach(item => {
        total += item.price;
    });
    
    // Update the input field
    totalSpentInput.value = total.toFixed(2);
}

/**
 * Handles the main form submission.
 */
function handleFormSubmit(event) {
    // Prevent the form from actually submitting (which reloads the page)
    event.preventDefault(); 
    
    // Get all the data
    const restaurantName = restaurantNameInput.value.trim();
    const visitDate = visitDateInput.value;
    
    // Use the auto-calculated total, or the user's manual entry if they changed it
    const totalSpent = parseFloat(totalSpentInput.value);

    // Validation
    if (restaurantName === "" || visitDate === "") {
        alert("Please fill in the Restaurant Name and Date.");
        return;
    }
    if (itemsOrdered.length === 0) {
        alert("Please add at least one item.");
        return;
    }
    if (isNaN(totalSpent) || totalSpent < 0) {
        alert("Please enter a valid total spent.");
        return;
    }

    // Assemble the final data object
    const visitData = {
        restaurantName: restaurantName,
        date: visitDate,
        totalSpent: totalSpent,
        itemsOrdered: itemsOrdered
    };

    // --- IN A REAL APP ---
    // You would now send 'visitData' to your backend API
    // e.g., fetch('/api/history/save', { method: 'POST', body: JSON.stringify(visitData) })
    // ... and *then* redirect.

    // --- FOR THIS DEMO ---
    // We will just log the data to the console and show an alert.
    console.log("Visit Data to Save:", visitData);
    alert("Visit Saved! (Check the console for the data object).\n\nIn a real app, you would now be redirected back to the history page.");
    
    // Optional: Redirect back to the history page after "saving"
    // window.location.href = 'PastEatingHistory.html';
}

// --- 3. EVENT LISTENERS ---

// Listen for clicks on the "Add Item" button
addItemBtn.addEventListener('click', addItem);

// Listen for the main form "Save Visit" button
logVisitForm.addEventListener('submit', handleFormSubmit);

// Initial render of the (empty) item list
renderItems();