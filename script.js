// Custom Toast Notification
function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `✅ ${message}`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Splash Screen
window.addEventListener('load', () => {
    setTimeout(() => {
        const splashScreen = document.getElementById('splash-screen');
        if(splashScreen) splashScreen.classList.add('hidden');
    }, 2000); 
});

// Menu Database
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

// Navigation & Global UI
function navigateTo(viewId) {
    document.querySelectorAll('.page-view').forEach(page => page.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    
    // Desktop Nav
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if(link.getAttribute('onclick') && link.getAttribute('onclick').includes(viewId)) {
            if(viewId === 'home-view' && link.innerText !== 'Home') return;
            link.classList.add('active');
        }
    });
    
    // Bottom Nav
    document.querySelectorAll('.bottom-nav-item').forEach(link => {
        link.classList.remove('active');
        if(link.getAttribute('onclick') && link.getAttribute('onclick').includes(viewId)) {
            link.classList.add('active');
        }
    });

    document.querySelector('.nav-links').classList.remove('active');
    if(viewId === 'checkout-view') renderCheckout();
    setTimeout(() => window.dispatchEvent(new Event('scroll')), 50);
}

function toggleMenu() { document.querySelector('.nav-links').classList.toggle('active'); }
function toggleCart() { document.getElementById('cart-sidebar').classList.toggle('open'); document.getElementById('cart-overlay').classList.toggle('show'); }
function goToCheckout() {
    if(cart.length === 0) return showToast("Your cart is empty. Please add items to order.");
    toggleCart(); navigateTo('checkout-view'); window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Scroll Reveals
window.addEventListener('scroll', () => {
    document.querySelectorAll('.section-reveal').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 60) el.classList.add('visible');
    });
});

// Casino Dice Logic
let spinInterval; let wonDishId = null;
function openDiceModal() { document.getElementById('dice-modal').classList.add('show'); resetSlot(); }
function closeDiceModal(e) {
    if (e && e.target !== document.getElementById('dice-modal') && e.target !== document.querySelector('.close-dice')) return;
    document.getElementById('dice-modal').classList.remove('show'); clearInterval(spinInterval);
}
function resetSlot() {
    document.getElementById('slot-img').src = "images/Logo.png"; document.getElementById('slot-img').style.opacity = 1;
    document.getElementById('slot-name').innerText = "Ready to Roll?"; document.getElementById('slot-price').innerText = "Tap the button below!";
    document.getElementById('spin-btn').innerText = "Roll the Dice 🎲"; document.getElementById('spin-btn').disabled = false;
    document.getElementById('add-won-btn').classList.add('hidden'); wonDishId = null;
}
function startSpin() {
    const spinBtn = document.getElementById('spin-btn'); spinBtn.disabled = true; spinBtn.innerText = "🎰 Spinning... 🎰";
    document.getElementById('add-won-btn').classList.add('hidden');
    const slotImg = document.getElementById('slot-img'), slotName = document.getElementById('slot-name'), slotPrice = document.getElementById('slot-price');
    let counter = 0;
    spinInterval = setInterval(() => {
        const randomDish = menuDishes[Math.floor(Math.random() * menuDishes.length)];
        slotImg.style.opacity = 0.6; setTimeout(() => slotImg.style.opacity = 1, 50);
        slotImg.src = randomDish.img; slotName.innerText = randomDish.name; slotPrice.innerText = `₹${randomDish.price}`;
        counter++;
        if (counter >= 20) { clearInterval(spinInterval); finishSpin(); }
    }, 100);
}
function finishSpin() {
    const finalDish = menuDishes[Math.floor(Math.random() * menuDishes.length)]; wonDishId = finalDish.id;
    document.getElementById('slot-img').src = finalDish.img; document.getElementById('slot-name').innerText = `🎉 ${finalDish.name} 🎉`;
    document.getElementById('slot-price').innerText = `₹${finalDish.price}`;
    document.getElementById('spin-btn').innerText = "Roll Again 🎲"; document.getElementById('spin-btn').disabled = false;
    document.getElementById('add-won-btn').classList.remove('hidden');
}
function addWonDish() {
    if(wonDishId) { addToCart(wonDishId); document.getElementById('dice-modal').classList.remove('show'); toggleCart(); }
}

// Menu & Cart Rendering with Skeletons
function renderSpecials() {
    const grid = document.getElementById('specials-grid'); if(!grid) return;
    
    // Skeleton Illusion
    grid.innerHTML = Array(3).fill(`<div class="skeleton-card"><div class="skeleton-img shimmer"></div><div class="skeleton-text shimmer"></div><div class="skeleton-text short shimmer"></div><div class="skeleton-text shimmer"></div><div class="skeleton-btn shimmer"></div></div>`).join('');
    
    setTimeout(() => {
        grid.innerHTML = menuDishes.filter(d => d.special !== "").map((dish, index) => {
            const qty = cart.find(c => c.id === dish.id)?.qty || 0;
            let actionHTML = qty === 0 ? `<button class="add-btn" onclick="addToCart(${dish.id})">Add</button>` : `<div class="qty-controls"><button class="qty-btn" onclick="updateQty(${dish.id}, -1)">-</button><span>${qty}</span><button class="qty-btn" onclick="updateQty(${dish.id}, 1)">+</button></div>`;
            return `
            <div class="new-menu-card" style="animation-delay: ${index * 0.04}s">
                <div class="card-img-container">
                    <img src="${dish.img}" alt="${dish.name}" loading="lazy">
                    <span class="img-badge top-left ${dish.name.includes('Chicken') ? 'badge-non-veg' : 'badge-veg'}">
                        ${dish.name.includes('Chicken') ? 'Non-veg' : 'Veg'}
                    </span>
                    ${dish.special ? `<span class="img-badge bottom-right badge-bestseller">${dish.special}</span>` : ''}
                </div>
                <div class="card-body">
                    <div class="meta-row">
                        <span class="pill-category">${dish.category}</span>
                        <span class="pill-rating">4.7/5</span> 
                    </div>
                    <h3>${dish.name}</h3>
                    <p class="card-stats">30 min / 328+ ratings</p>
                    <p class="card-desc">${dish.desc}</p>
                    <div class="discount-tag">10% off</div>
                    <div class="card-footer">
                        <span class="card-price">₹${dish.price}</span>
                        <div>${actionHTML}</div>
                    </div>
                </div>
            </div>`;
        }).join('');
    }, 500);
}

function renderMenu(category) {
    const grid = document.getElementById('menu-grid'); if(!grid) return;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.toggle('active', btn.innerText.includes(category) || (category === 'All' && btn.innerText.includes('All'))));
    
    // Skeleton Illusion
    grid.innerHTML = Array(4).fill(`<div class="skeleton-card"><div class="skeleton-img shimmer"></div><div class="skeleton-text shimmer"></div><div class="skeleton-text short shimmer"></div><div class="skeleton-text shimmer"></div><div class="skeleton-btn shimmer"></div></div>`).join('');
    
    setTimeout(() => {
        const filtered = category === 'All' ? menuDishes : menuDishes.filter(d => d.category === category);
        grid.innerHTML = filtered.map((dish, index) => {
            const qty = cart.find(c => c.id === dish.id)?.qty || 0;
            let actionHTML = qty === 0 ? `<button class="add-btn" onclick="addToCart(${dish.id})">Add</button>` : `<div class="qty-controls"><button class="qty-btn" onclick="updateQty(${dish.id}, -1)">-</button><span>${qty}</span><button class="qty-btn" onclick="updateQty(${dish.id}, 1)">+</button></div>`;
            return `
            <div class="new-menu-card" style="animation-delay: ${index * 0.04}s">
                <div class="card-img-container">
                    <img src="${dish.img}" alt="${dish.name}" loading="lazy">
                    <span class="img-badge top-left ${dish.name.includes('Chicken') ? 'badge-non-veg' : 'badge-veg'}">
                        ${dish.name.includes('Chicken') ? 'Non-veg' : 'Veg'}
                    </span>
                    ${dish.special ? `<span class="img-badge bottom-right badge-bestseller">${dish.special}</span>` : ''}
                </div>
                <div class="card-body">
                    <div class="meta-row">
                        <span class="pill-category">${dish.category}</span>
                        <span class="pill-rating">4.7/5</span> 
                    </div>
                    <h3>${dish.name}</h3>
                    <p class="card-stats">30 min / 328+ ratings</p>
                    <p class="card-desc">${dish.desc}</p>
                    <div class="discount-tag">10% off</div>
                    <div class="card-footer">
                        <span class="card-price">₹${dish.price}</span>
                        <div>${actionHTML}</div>
                    </div>
                </div>
            </div>`;
        }).join('');
    }, 600);
}
function filterMenu(cat) { renderMenu(cat); }

function addToCart(id) {
    const dish = menuDishes.find(d => d.id === id); const existing = cart.find(c => c.id === id);
    if(existing) existing.qty += 1; else cart.push({ ...dish, qty: 1 });
    saveCart(); showToast(`${dish.name} added to cart!`);
    
    // Quick rerender without skeletons to avoid UI jump on add
    const activeCat = document.querySelector('.filter-btn.active')?.innerText.split(' ')[1] || 'All';
    renderMenuNoSkeleton(activeCat); renderSpecialsNoSkeleton();
}

function updateQty(id, delta) {
    const item = cart.find(c => c.id === id); if (!item) return;
    item.qty += delta; if (item.qty <= 0) cart = cart.filter(c => c.id !== id);
    saveCart(); 
    
    const activeCat = document.querySelector('.filter-btn.active')?.innerText.split(' ')[1] || 'All';
    renderMenuNoSkeleton(activeCat); renderSpecialsNoSkeleton();
    if(document.getElementById('checkout-view').classList.contains('active')) renderCheckout();
}

function removeFromCart(id) {
    cart = cart.filter(c => c.id !== id); saveCart(); 
    const activeCat = document.querySelector('.filter-btn.active')?.innerText.split(' ')[1] || 'All';
    renderMenuNoSkeleton(activeCat); renderSpecialsNoSkeleton();
    if(document.getElementById('checkout-view').classList.contains('active')) renderCheckout();
}

// Helpers for silent rerendering
function renderMenuNoSkeleton(category) {
    const grid = document.getElementById('menu-grid'); if(!grid) return;
    const filtered = category === 'All' ? menuDishes : menuDishes.filter(d => d.category === category || d.category === category + ' Course' || d.category === category + ' Dishes');
    grid.innerHTML = filtered.map((dish) => {
        const qty = cart.find(c => c.id === dish.id)?.qty || 0;
        let actionHTML = qty === 0 ? `<button class="add-btn" onclick="addToCart(${dish.id})">Add</button>` : `<div class="qty-controls"><button class="qty-btn" onclick="updateQty(${dish.id}, -1)">-</button><span>${qty}</span><button class="qty-btn" onclick="updateQty(${dish.id}, 1)">+</button></div>`;
        return `<div class="new-menu-card"><div class="card-img-container"><img src="${dish.img}"><span class="img-badge top-left ${dish.name.includes('Chicken') ? 'badge-non-veg' : 'badge-veg'}">${dish.name.includes('Chicken') ? 'Non-veg' : 'Veg'}</span>${dish.special ? `<span class="img-badge bottom-right badge-bestseller">${dish.special}</span>` : ''}</div><div class="card-body"><div class="meta-row"><span class="pill-category">${dish.category}</span><span class="pill-rating">4.7/5</span></div><h3>${dish.name}</h3><p class="card-stats">30 min / 328+ ratings</p><p class="card-desc">${dish.desc}</p><div class="discount-tag">10% off</div><div class="card-footer"><span class="card-price">₹${dish.price}</span><div>${actionHTML}</div></div></div></div>`;
    }).join('');
}

function renderSpecialsNoSkeleton() {
    const grid = document.getElementById('specials-grid'); if(!grid) return;
    grid.innerHTML = menuDishes.filter(d => d.special !== "").map((dish) => {
        const qty = cart.find(c => c.id === dish.id)?.qty || 0;
        let actionHTML = qty === 0 ? `<button class="add-btn" onclick="addToCart(${dish.id})">Add</button>` : `<div class="qty-controls"><button class="qty-btn" onclick="updateQty(${dish.id}, -1)">-</button><span>${qty}</span><button class="qty-btn" onclick="updateQty(${dish.id}, 1)">+</button></div>`;
        return `<div class="new-menu-card"><div class="card-img-container"><img src="${dish.img}"><span class="img-badge top-left ${dish.name.includes('Chicken') ? 'badge-non-veg' : 'badge-veg'}">${dish.name.includes('Chicken') ? 'Non-veg' : 'Veg'}</span>${dish.special ? `<span class="img-badge bottom-right badge-bestseller">${dish.special}</span>` : ''}</div><div class="card-body"><div class="meta-row"><span class="pill-category">${dish.category}</span><span class="pill-rating">4.7/5</span></div><h3>${dish.name}</h3><p class="card-stats">30 min / 328+ ratings</p><p class="card-desc">${dish.desc}</p><div class="discount-tag">10% off</div><div class="card-footer"><span class="card-price">₹${dish.price}</span><div>${actionHTML}</div></div></div></div>`;
    }).join('');
}


function saveCart() { localStorage.setItem('gfr_cart', JSON.stringify(cart)); updateCartUI(); }

function updateCartUI() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const cartCount = document.getElementById('cart-count'); if(cartCount) cartCount.innerText = totalQty;
    const bottomCartCount = document.getElementById('bottom-cart-count'); if(bottomCartCount) bottomCartCount.innerText = totalQty;
    
    const cartItems = document.getElementById('cart-items'); if (!cartItems) return;
    if (cart.length === 0) {
        cartItems.innerHTML = `<div class="empty-cart-msg"><p>Your culinary cart is empty</p><br><button class="btn btn-primary" onclick="toggleCart(); navigateTo('home-view'); setTimeout(() => document.getElementById('menu-section').scrollIntoView({behavior: 'smooth'}), 100);">Explore Menu</button></div>`;
        document.getElementById('cart-subtotal').innerText = `₹0`; document.getElementById('cart-total').innerText = `₹0`; return;
    }
    let subtotal = 0;
    cartItems.innerHTML = cart.map(item => {
        subtotal += item.price * item.qty;
        return `<div class="cart-item"><img src="${item.img}" alt="${item.name}"><div class="cart-item-info"><h4>${item.name}</h4><p class="cart-item-price">₹${item.price} x ${item.qty}</p><div class="qty-controls" style="margin-top:6px; transform: scale(0.85); transform-origin: left;"><button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button><span>${item.qty}</span><button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button></div></div><button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button></div>`;
    }).join('');
    document.getElementById('cart-subtotal').innerText = `₹${subtotal}`; document.getElementById('cart-total').innerText = `₹${subtotal + DELIVERY_FEE}`;
}

// Checkout & Forms
function renderCheckout() {
    const container = document.getElementById('checkout-items'); if (!container) return;
    if (cart.length === 0) {
        container.innerHTML = `<p class="empty-cart-msg">Your cart is empty. <br><br> <a href="#" class="text-primary fw-600" onclick="navigateTo('home-view'); setTimeout(() => document.getElementById('menu-section').scrollIntoView({behavior: 'smooth'}), 100);">Go to Menu</a></p>`;
        document.getElementById('chk-subtotal').innerText = `₹0`; document.getElementById('chk-total').innerText = `₹0`; return;
    }
    let subtotal = 0;
    container.innerHTML = cart.map(item => {
        subtotal += item.price * item.qty;
        return `<div class="summary-item"><div><span class="fw-600">${item.name}</span><br><small class="text-muted">₹${item.price} × ${item.qty}</small></div><div class="fw-600 text-primary">₹${item.price * item.qty}</div></div>`;
    }).join('');
    document.getElementById('chk-subtotal').innerText = `₹${subtotal}`; document.getElementById('chk-total').innerText = `₹${subtotal + DELIVERY_FEE}`;
}

function processCheckout(e) {
    e.preventDefault(); if (cart.length === 0) return showToast("Your cart is empty! Please add some dishes.");
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0) + DELIVERY_FEE;
    document.getElementById('s-id').innerText = 'GFR-' + Math.floor(100000 + Math.random() * 900000);
    document.getElementById('s-name').innerText = document.getElementById('c-name').value;
    document.getElementById('s-total').innerText = `₹${total}`;
    cart = []; localStorage.removeItem('gfr_cart'); updateCartUI(); renderSpecialsNoSkeleton(); renderMenuNoSkeleton('All');
    navigateTo('success-view'); window.scrollTo({ top: 0, behavior: 'smooth' });
}

// New Form Handlers with Toast
function handleReservation(e) {
    e.preventDefault();
    showToast("Table request received! We'll confirm via SMS.");
    e.target.reset();
}

function handleNewsletter(e) {
    e.preventDefault();
    showToast("Welcome to the VIP Club!");
    e.target.reset();
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    renderSpecials(); renderMenu('All'); updateCartUI();
    setTimeout(() => window.dispatchEvent(new Event('scroll')), 100);
});
// Open Dish Detail Page
function openDishDetail(id) {
    const dish = menuDishes.find(d => d.id === id);
    if(!dish) return;
    
    document.getElementById('detail-img').src = dish.img;
    document.getElementById('detail-category').innerText = dish.category;
    document.getElementById('detail-name').innerText = dish.name;
    document.getElementById('detail-desc').innerText = dish.desc;
    document.getElementById('detail-price').innerText = `₹${dish.price}`;
    
    updateDetailAction(dish.id);
    navigateTo('dish-detail-view');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Update Add to Cart button inside Detail Page
function updateDetailAction(id) {
    const actionContainer = document.getElementById('detail-action');
    if(!actionContainer) return;
    const qty = cart.find(c => c.id === id)?.qty || 0;
    
    if(qty === 0) {
        actionContainer.innerHTML = `<button class="add-btn" style="background:#216e41; color:white; padding:10px 24px; border-radius:8px; border:none; font-weight:600; cursor:pointer;" onclick="addToCart(${id}); updateDetailAction(${id})">Add to Cart</button>`;
    } else {
        actionContainer.innerHTML = `<div class="qty-controls" style="background:#216e41; color:white; padding:6px 12px; border-radius:8px; display:flex; gap:12px; align-items:center;"><button class="qty-btn" style="border:none; border-radius:50%; width:26px; height:26px; color:#216e41; font-weight:bold; cursor:pointer;" onclick="updateQty(${id}, -1); updateDetailAction(${id})">-</button><span>${qty}</span><button class="qty-btn" style="border:none; border-radius:50%; width:26px; height:26px; color:#216e41; font-weight:bold; cursor:pointer;" onclick="updateQty(${id}, 1); updateDetailAction(${id})">+</button></div>`;
    }
}