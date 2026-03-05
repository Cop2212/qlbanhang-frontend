import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  products = [
    { name: 'Sản phẩm 1', price: 500000 },
    { name: 'Sản phẩm 2', price: 650000 },
    { name: 'Sản phẩm 3', price: 800000 },
    { name: 'Sản phẩm 4', price: 1200000 }
  ];

}