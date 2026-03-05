import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {

  categories = ['Điện thoại', 'Laptop', 'Phụ kiện'];

  products = Array.from({ length: 9 }, (_, i) => ({
    name: `Sản phẩm ${i + 1}`,
    price: 500000 + i * 100000
  }));

}