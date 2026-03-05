import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})
export class CartComponent {

    cartItems = [
        { id: 1, name: 'Sản phẩm 1', price: 500000, quantity: 1 },
        { id: 2, name: 'Sản phẩm 2', price: 800000, quantity: 2 }
    ];

    increase(item: any) {
        item.quantity++;
    }

    decrease(item: any) {
        if (item.quantity > 1) {
            item.quantity--;
        }
    }

    removeItem(id: number) {
        this.cartItems = this.cartItems.filter(item => item.id !== id);
    }

    updateCart() {
        alert('Giỏ hàng đã được cập nhật!');
    }

    get total() {
        return this.cartItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
    }

}