import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  categories: any[] = [];
  selectedCategory: number | null = null;

  products: any[] = [];
  bestSellers: any[] = [];
  currentPage = 1;
  lastPage = 1;

  sort: string = 'default';
  perPage: number = 8;

  constructor(private productService: ProductService, private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
    this.loadBestSellers();
  }

  loadProducts(page: number = 1) {
    this.productService
      .getProducts(page, this.selectedCategory, this.sort, this.perPage)
      .subscribe(res => {

        this.products = res.data;
        this.currentPage = res.current_page;
        this.lastPage = res.last_page;

      });
  }

  loadBestSellers() {
    this.productService.getBestSeller().subscribe((res: any) => {
      this.bestSellers = res;
    });
  }

  loadCategories() {
    this.categoryService.getCategories()
      .subscribe(res => {
        this.categories = res;
      });
  }

  selectCategory(id: number | null) {
    this.selectedCategory = id;
    this.loadProducts(1);
  }

  changeSort(type: string) {
    this.sort = type;
    this.loadProducts(1);
  }

  changePerPage() {
    this.loadProducts(1);
  }
}