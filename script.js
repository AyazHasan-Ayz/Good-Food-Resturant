// --- Splash Screen Logic ---
window.addEventListener('load', () => {
    setTimeout(() => {
        const splashScreen = document.getElementById('splash-screen');
        if(splashScreen) {
            splashScreen.classList.add('hidden');
        }
    }, 2000); 
});

// --- Menu Database (15 Items) ---
const menuDishes = [
    { id: 1, name: "Butter Chicken", price: 299, desc: "Creamy and flavorful chicken cooked in a rich tomato butter gravy.", category: "Main Course", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&q=80", special: "Bestseller" },
    { id: 2, name: "Chicken Biryani", price: 249, desc: "Fragrant basmati rice cooked with tender chicken and aromatic spices.", category: "Rice", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80", special: "Chef's Special" },
    { id: 3, name: "Paneer Butter Masala", price: 229, desc: "Soft paneer cubes cooked in a creamy tomato-based gravy.", category: "Main Course", img: "images/paneer-butter-masala.png", special: "Bestseller" },
    { id: 4, name: "Veg Biryani", price: 199, desc: "Aromatic basmati rice cooked with fresh vegetables and spices.", category: "Rice", img: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500&q=80", special: "" },
    { id: 5, name: "Chicken Tikka", price: 269, desc: "Juicy chicken pieces marinated with spices and grilled to perfection.", category: "Starters", img: "images/chicken-tikka.png", special: "Chef's Special" },
    { id: 6, name: "Paneer Tikka", price: 239, desc: "Grilled cottage cheese with colorful vegetables and Indian spices.", category: "Starters", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80", special: "" },
    { id: 7, name: "Dal Makhani", price: 179, desc: "Slow-cooked black lentils finished with butter and cream.", category: "Main Course", img: "images/dal-makhni.png", special: "Bestseller" },
    { id: 8, name: "Garlic Naan", price: 79, desc: "Soft Indian naan topped with fresh garlic and butter.", category: "Breads", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80", special: "" },
    { id: 9, name: "Tandoori Chicken", price: 299, desc: "Classic tandoori chicken marinated in spices and roasted in a clay oven.", category: "Starters", img: "images/tandoori-chicken.png", special: "Chef's Special" },
    { id: 10, name: "Chilli Paneer", price: 219, desc: "Crispy paneer tossed with peppers, onions and spicy sauce.", category: "Starters", img: "images/chilli-paneer.png", special: "" },
    { id: 11, name: "Chicken Fried Rice", price: 229, desc: "Flavored rice tossed with chicken, vegetables and Asian spices.", category: "Rice", img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&q=80", special: "" },
    { id: 12, name: "Veg Hakka Noodles", price: 189, desc: "Stir-fried noodles with fresh vegetables and flavorful sauces.", category: "Main Course", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&q=80", special: "" },
    { id: 13, name: "Masala Dosa", price: 149, desc: "Crispy dosa served with spicy potato filling, sambar and chutney.", category: "Main Course", img: "images/masala-dosa.png", special: "" },
    { id: 14, name: "Gulab Jamun", price: 99, desc: "Soft and warm milk-solid dumplings soaked in sweet syrup.", category: "Desserts", img: "images/gulab-jamun.png", special: "Bestseller" },
    { id: 15, name: "Chocolate Brownie", price: 129, desc: "Rich, soft chocolate brownie served as a delicious dessert.", category: "Desserts", img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80", special: "Chef's Special" }
];

let cart = JSON.parse(localStorage.getItem('gfr_cart')) || [];
const DELIVERY_FEE = 40;

// --- Single Page Application Navigation ---
function navigateTo(viewId) {
    document.querySelectorAll('.page-view').forEach(page => {
        page.classList.remove('active');
    });

    document.getElementById(viewId).classList.add('active');

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if(link.getAttribute('onclick') && link.getAttribute('onclick').includes(viewId)) {
            if(viewId === 'home-view' && link.innerText !== 'Home') return;
            link.classList.add('active');
        }
    });

    document.querySelector('.nav-links').classList.remove('active');
    
    if(viewId === 'checkout-view') renderCheckout();
    
    setTimeout(() => window.dispatchEvent(new Event('scroll')), 50);
}

// --- Core UI Functions ---
function toggleMenu() {
    document.querySelector('.nav-links').classList.toggle('active');
}

function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('open');
    document.getElementById('cart-overlay').classList.toggle('show');
}

function goToCheckout() {
    if(cart.length === 0) {
        alert("Your cart is empty. Please add items to order.");
        return;
    }
    toggleCart(); 
    navigateTo('checkout-view');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Scroll Reveal Logic (Back to top logic removed)
window.addEventListener('scroll', () => {
    const reveals = document.querySelectorAll('.section-reveal');
    reveals.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 60) el.classList.add('visible');
    });
});


// ==========================================
// NEW: Casino Slot Machine Logic
// ==========================================
let spinInterval;
let wonDishId = null;

function openDiceModal() {
    document.getElementById('dice-modal').classList.add('show');
    resetSlot();
}

function closeDiceModal(e) {
    if (e && e.target !== document.getElementById('dice-modal') && e.target !== document.querySelector('.close-dice')) {
        return; // Prevents closing if clicking inside the modal content box
    }
    document.getElementById('dice-modal').classList.remove('show');
    clearInterval(spinInterval);
}

function resetSlot() {
    document.getElementById('slot-img').src = "images/logo.png";
    document.getElementById('slot-img').style.opacity = 1;
    document.getElementById('slot-name').innerText = "Ready to Roll?";
    document.getElementById('slot-price').innerText = "Tap the button below!";
    
    const spinBtn = document.getElementById('spin-btn');
    spinBtn.innerText = "Roll the Dice 🎲";
    spinBtn.disabled = false;
    
    document.getElementById('add-won-btn').classList.add('hidden');
    wonDishId = null;
}

function startSpin() {
    const spinBtn = document.getElementById('spin-btn');
    spinBtn.disabled = true;
    spinBtn.innerText = "🎰 Spinning... 🎰";
    document.getElementById('add-won-btn').classList.add('hidden');

    const slotImg = document.getElementById('slot-img');
    const slotName = document.getElementById('slot-name');
    const slotPrice = document.getElementById('slot-price');

    let counter = 0;
    const maxSpins = 20; // Will spin 20 times quickly
    const spinSpeed = 100; // changes image every 100 milliseconds

    // Rapid shuffle simulation
    spinInterval = setInterval(() => {
        const randomDish = menuDishes[Math.floor(Math.random() * menuDishes.length)];
        
        // Quick blink effect
        slotImg.style.opacity = 0.6;
        setTimeout(() => slotImg.style.opacity = 1, 50);

        slotImg.src = randomDish.img;
        slotName.innerText = randomDish.name;
        slotPrice.innerText = `₹${randomDish.price}`;
        
        counter++;

        // Stop the spin
        if (counter >= maxSpins) {
            clearInterval(spinInterval);
            finishSpin();
        }
    }, spinSpeed);
}

function finishSpin() {
    // Pick the final winner
    const finalDish = menuDishes[Math.floor(Math.random() * menuDishes.length)];
    wonDishId = finalDish.id;

    document.getElementById('slot-img').src = finalDish.img;
    document.getElementById('slot-name').innerText = `🎉 ${finalDish.name} 🎉`;
    document.getElementById('slot-price').innerText = `₹${finalDish.price}`;

    const spinBtn = document.getElementById('spin-btn');
    spinBtn.innerText = "Roll Again 🎲";
    spinBtn.disabled = false;

    // Show the Add to Cart button
    const addBtn = document.getElementById('add-won-btn');
    addBtn.classList.remove('hidden');
}

function addWonDish() {
    if(wonDishId) {
        addToCart(wonDishId);
        document.getElementById('dice-modal').classList.remove('show');
        toggleCart(); // Open cart to show user it was added
    }
}
// ==========================================


// --- Render Specials Section ---
function renderSpecials() {
    const grid = document.getElementById('specials-grid');
    if(!grid) return;

    const specials = menuDishes.filter(d => d.special !== "");
    
    grid.innerHTML = specials.map(dish => {
        const cartItem = cart.find(c => c.id === dish.id);
        const qty = cartItem ? cartItem.qty : 0;
        
        let actionHTML = qty === 0 
            ? `<button class="add-btn" onclick="addToCart(${dish.id})">Add to Cart</button>`
            : `<div class="qty-controls">
                 <button class="qty-btn" onclick="updateQty(${dish.id}, -1)">-</button>
                 <span>${qty}</span>
                 <button class="qty-btn" onclick="updateQty(${dish.id}, 1)">+</button>
               </div>`;

        return `
            <div class="special-card">
                <span class="special-badge">${dish.special}</span>
                <div class="special-img-wrapper"><img src="${dish.img}" alt="${dish.name}" loading="lazy"></div>
                <div class="special-content">
                    <h3>${dish.name}</h3>
                    <p>${dish.desc}</p>
                    <div class="special-bottom">
                        <span class="price">₹${dish.price}</span>
                        <div id="special-action-${dish.id}">${actionHTML}</div>
                    </div>
                </div>
            </div>`;
    }).join('');
}


// --- Menu Logic ---
function renderMenu(category) {
    const grid = document.getElementById('menu-grid');
    if(!grid) return;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.includes(category) || (category === 'All' && btn.innerText.includes('All')));
    });

    grid.innerHTML = '';
    const filtered = category === 'All' ? menuDishes : menuDishes.filter(d => d.category === category);
    
    filtered.forEach((dish, index) => {
        const cartItem = cart.find(c => c.id === dish.id);
        const qty = cartItem ? cartItem.qty : 0;
        
        let actionHTML = qty === 0 
            ? `<button class="add-btn" onclick="addToCart(${dish.id})">Add to Cart</button>`
            : `<div class="qty-controls">
                 <button class="qty-btn" onclick="updateQty(${dish.id}, -1)">-</button>
                 <span>${qty}</span>
                 <button class="qty-btn" onclick="updateQty(${dish.id}, 1)">+</button>
               </div>`;

        grid.innerHTML += `
            <div class="menu-card" style="animation-delay: ${index * 0.04}s">
                <div class="menu-img-wrapper"><img src="${dish.img}" alt="${dish.name}" loading="lazy"></div>
                <div class="menu-content">
                    <h3>${dish.name}</h3>
                    <p>${dish.desc}</p>
                    <div class="menu-bottom">
                        <span class="price">₹${dish.price}</span>
                        <div id="action-${dish.id}">${actionHTML}</div>
                    </div>
                </div>
            </div>`;
    });
}

function filterMenu(cat) {
    renderMenu(cat);
}


// --- Cart Logic ---
function addToCart(id) {
    const dish = menuDishes.find(d => d.id === id);
    const existing = cart.find(c => c.id === id);
    if(existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...dish, qty: 1 });
    }
    saveCart();
    renderSpecials();
    renderMenu(document.querySelector('.filter-btn.active')?.innerText.replace(' Dishes', '') || 'All');
}

function updateQty(id, delta) {
    const item = cart.find(c => c.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(c => c.id !== id);
    saveCart();
    
    renderSpecials();
    renderMenu(document.querySelector('.filter-btn.active')?.innerText.replace(' Dishes', '') || 'All');
    
    if(document.getElementById('checkout-view').classList.contains('active')){
        renderCheckout();
    }
}

function removeFromCart(id) {
    cart = cart.filter(c => c.id !== id);
    saveCart();
    renderSpecials();
    renderMenu(document.querySelector('.filter-btn.active')?.innerText.replace(' Dishes', '') || 'All');
    if(document.getElementById('checkout-view').classList.contains('active')){
        renderCheckout();
    }
}

function saveCart() {
    localStorage.setItem('gfr_cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    if(cartCount) cartCount.innerText = cart.reduce((sum, item) => sum + item.qty, 0);

    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = `<div class="empty-cart-msg">
            <p>Your culinary cart is empty</p>
            <br><button class="btn btn-primary" onclick="toggleCart(); navigateTo('home-view'); setTimeout(() => document.getElementById('menu-section').scrollIntoView({behavior: 'smooth'}), 100);">Explore Menu</button>
        </div>`;
        document.getElementById('cart-subtotal').innerText = `₹0`;
        document.getElementById('cart-total').innerText = `₹0`;
        return;
    }

    let subtotal = 0;
    cartItems.innerHTML = cart.map(item => {
        subtotal += item.price * item.qty;
        return `
        <div class="cart-item">
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">₹${item.price} x ${item.qty}</p>
                <div class="qty-controls" style="margin-top:6px; width: fit-content; transform: scale(0.85); transform-origin: left;">
                    <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
        </div>`;
    }).join('');

    document.getElementById('cart-subtotal').innerText = `₹${subtotal}`;
    document.getElementById('cart-total').innerText = `₹${subtotal + DELIVERY_FEE}`;
}


// --- Checkout Logic ---
function renderCheckout() {
    const container = document.getElementById('checkout-items');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = `<p class="empty-cart-msg">Your cart is empty. <br><br> <a href="#" class="text-primary fw-600" onclick="navigateTo('home-view'); setTimeout(() => document.getElementById('menu-section').scrollIntoView({behavior: 'smooth'}), 100);">Go to Menu</a></p>`;
        document.getElementById('chk-subtotal').innerText = `₹0`;
        document.getElementById('chk-total').innerText = `₹0`;
        return;
    }

    let subtotal = 0;
    container.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;
        return `
        <div class="summary-item">
            <div>
                <span class="fw-600">${item.name}</span> <br>
                <small class="text-muted">₹${item.price} × ${item.qty}</small>
            </div>
            <div class="fw-600 text-primary">₹${itemTotal}</div>
        </div>`;
    }).join('');

    document.getElementById('chk-subtotal').innerText = `₹${subtotal}`;
    document.getElementById('chk-total').innerText = `₹${subtotal + DELIVERY_FEE}`;
}

function processCheckout(e) {
    e.preventDefault();
    if (cart.length === 0) {
        alert("Your cart is empty! Please add some dishes to proceed.");
        return;
    }

    const name = document.getElementById('c-name').value;
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0) + DELIVERY_FEE;
    const orderId = 'GFR-' + Math.floor(100000 + Math.random() * 900000);

    document.getElementById('s-id').innerText = orderId;
    document.getElementById('s-name').innerText = name;
    document.getElementById('s-total').innerText = `₹${total}`;
    
    cart = [];
    localStorage.removeItem('gfr_cart');
    updateCartUI();
    renderSpecials();
    renderMenu('All');

    navigateTo('success-view');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    renderSpecials();
    renderMenu('All');
    updateCartUI();
    setTimeout(() => window.dispatchEvent(new Event('scroll')), 100);
});