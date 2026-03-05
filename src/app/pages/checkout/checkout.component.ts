import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {

  orderItems = [
    { name: 'Sản phẩm 1', price: 500000, quantity: 1 },
    { name: 'Sản phẩm 2', price: 800000, quantity: 2 }
  ];

  get total() {
    return this.orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

}