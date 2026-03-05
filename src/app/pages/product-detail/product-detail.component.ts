import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent {

  activeTab: 'description' | 'reviews' = 'description';

  similarProducts = Array.from({ length: 4 }, (_, i) => ({
    name: `Sản phẩm tương tự ${i + 1}`,
    price: 600000 + i * 150000
  }));

}