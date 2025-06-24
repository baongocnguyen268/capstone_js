export class CartItem {
    constructor(product, quantity = 1) {
        this.product = product;
        this.quantity = quantity;
    }

    calculatePrice() {
        return this.product.price * this.quantity;
    }
}

export class Cart {
    constructor() {
        this.items = this.loadFromLocalStorage() || [];
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.product.id === product.id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            const newItem = new CartItem(product);
            this.items.push(newItem);
        }
        this.saveToLocalStorage();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.product.id !== productId);
        this.saveToLocalStorage();
    }

    updateQuantity(productId, newQuantity) {
        const itemToUpdate = this.items.find(item => item.product.id === productId);
        if (itemToUpdate) {
            if (newQuantity > 0) {
                itemToUpdate.quantity = newQuantity;
            } else {
                this.removeItem(productId);
            }
        }
        this.saveToLocalStorage();
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => total + item.calculatePrice(), 0);
    }

    getTotalCount() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    saveToLocalStorage() {
        localStorage.setItem('shoppingCart', JSON.stringify(this.items));
    }

    loadFromLocalStorage() {
        const savedCart = localStorage.getItem('shoppingCart');
        if (savedCart) {
            const parsed = JSON.parse(savedCart);
            return parsed.map(item => new CartItem(item.product, item.quantity));
        }
        return null;
    }

    clearCart() {
        this.items = [];
        this.saveToLocalStorage();
    }
} 