import ProductServices from "../services/product-services-cus.js";
import Products from "../model/productCus.js";
import { Cart }  from "../model/cart.js";

const services = new ProductServices()
const product = new Products()
const cart = new Cart();
let productList = [];

export const getEle = (id) => {
    return document.getElementById(id);
};

const getProductList = () => {
    const promise = services.getProductListApi();
    promise
        .then((result) => {
            productList = result.data;
            renderProductList(productList);
        })
        .catch((error) => {
            console.log(error);
        });
};

const renderProductList = (data) => {
    let contentHTML = "";
    for (let i = 0; i < data.length; i++) {
        const product = data[i];
        contentHTML += `
        <div class="group bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center text-center transition-transform duration-200 hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden">
            <div class="w-28 h-28 flex items-center justify-center mb-3 bg-gray-50 rounded-xl overflow-hidden">
                <img src="../../asset/image/${product.img}" alt="${product.name}" class="object-contain w-full h-full transition-transform duration-300 group-hover:scale-110" />
            </div>
            <h3 class="text-lg font-bold text-gray-800 mb-1 truncate w-full">${product.name}</h3>
            <div class="flex flex-col gap-1 text-gray-600 text-sm w-full">
                <div><span class="font-medium">Màn hình:</span> ${product.screen}</div>
                <div><span class="font-medium">Camera trước:</span> ${product.frontCamera}</div>
                <div><span class="font-medium">Camera sau:</span> ${product.backCamera}</div>
            </div>
            <div class="flex items-center justify-center gap-2 mt-2 mb-3 w-full">
                <span class="text-purple-600 font-extrabold text-xl">${Number(product.price).toLocaleString()}₫</span>
            </div>
            <button class="add-to-cart mt-auto bg-gradient-to-r from-purple-500 to-purple-700 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:from-purple-600 hover:to-purple-800 transition-all duration-200" data-product-id="${product.id}">
                <i class="fas fa-cart-plus mr-2"></i>Thêm vào giỏ hàng
            </button>
        </div>
        `;
    }

    getEle("tbodyCustomerProducts").innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            ${contentHTML}
        </div>
    `;

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.currentTarget.dataset.productId;
            const productToAdd = productList.find(p => p.id == productId);
            if (productToAdd) {
                cart.addItem(productToAdd);
                updateCartBadge();
            }
        });
    });
};

getProductList();

const updateCartBadge = () => {
    const badge = getEle('cartBadge');
    const totalCount = cart.getTotalCount();
    if (badge) {
        if (totalCount > 0) {
            badge.innerText = totalCount;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }
};

const renderCart = () => {
    const cartBody = getEle('sideCartBody');
    const cartTotal = getEle('sideCartTotal');

    if (!cartBody || !cartTotal) return;

    cartBody.innerHTML = '';

    if (cart.items.length === 0) {
        cartBody.innerHTML = '<p class="text-center text-gray-500">Giỏ hàng của bạn đang trống.</p>';
        cartTotal.innerText = '0₫';
        return;
    }

    cart.items.forEach(item => {
        const itemHTML = `
            <div class="flex items-center gap-4 mb-4 p-2 border-b">
                 <img src="../../asset/image/${item.product.img}" alt="${item.product.name}" class="w-16 h-16 object-cover rounded">
                <div class="flex-grow">
                    <h3 class="font-semibold text-sm">${item.product.name}</h3>
                    <p class="text-xs text-gray-600">${item.quantity} x ${Number(item.product.price).toLocaleString()}₫</p>
                    <div class="flex items-center gap-2 mt-1">
                        <button class="quantity-change border rounded-full w-6 h-6 leading-none" data-product-id="${item.product.id}" data-change="-1">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-change border rounded-full w-6 h-6 leading-none" data-product-id="${item.product.id}" data-change="1">+</button>
                    </div>
                </div>
                <button class="remove-from-cart text-red-500 hover:text-red-700" data-product-id="${item.product.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cartBody.innerHTML += itemHTML;
    });

    cartTotal.innerText = `${Number(cart.getTotalPrice()).toLocaleString()}₫`;

    document.querySelectorAll('.remove-from-cart').forEach(button => {
        button.addEventListener('click', e => {
            const productId = e.currentTarget.dataset.productId;
            cart.removeItem(productId);
            renderCart();
            updateCartBadge();
        });
    });

    document.querySelectorAll('.quantity-change').forEach(button => {
        button.addEventListener('click', e => {
            const productId = e.currentTarget.dataset.productId;
            const change = parseInt(e.currentTarget.dataset.change);
            const currentItem = cart.items.find(item => item.product.id === productId);
            if (currentItem) {
                const newQuantity = currentItem.quantity + change;
                cart.updateQuantity(productId, newQuantity);
                renderCart();
                updateCartBadge();
            }
        });
    });
};

const openCart = () => {
    renderCart();
    getEle('sideCartModal').classList.remove('translate-x-full');
    getEle('sideCartOverlay').classList.remove('hidden');
};

const closeCart = () => {
    getEle('sideCartModal').classList.add('translate-x-full');
    getEle('sideCartOverlay').classList.add('hidden');
};

getEle('cartBtn').addEventListener('click', (e) => {
    e.preventDefault();
    openCart();
});

getEle('closeSideCart').addEventListener('click', closeCart);
getEle('sideCartOverlay').addEventListener('click', closeCart);

// Thêm sự kiện cho nút Thanh toán
const checkoutBtn = document.querySelector('#sideCartModal button.w-full');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.items.length === 0) {
            alert('Giỏ hàng của bạn đang trống!');
            return;
        }
        alert('Thanh toán thành công! Cảm ơn bạn đã mua hàng.');
        cart.clearCart();
        renderCart();
        updateCartBadge();
        closeCart();
    });
}

getProductList();