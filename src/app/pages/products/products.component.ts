import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { SettingService } from '../../services/setting.service';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  categories: any[] = [];
  selectedCategoryId: number | null = null;

  products: any[] = [];
  bestSellers: any[] = [];
  totalProducts: number = 0;
  
  currentPage = 1;
  lastPage = 1;

  sort: string = 'default';
  searchQuery: string = '';
  perPage: number = 12;

  isMobileFiltersOpen: boolean = false;
  sitePhone: string = '';
  setting: any;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private settingService: SettingService,
    public auth: AuthService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
    this.loadBestSellers();
    
    // Lấy thông tin cấu hình
    this.settingService.getSetting().subscribe(res => {
      this.setting = res;
      this.sitePhone = res.phone;
    });
  }

  loadProducts(page: number = 1) {
    this.currentPage = page;
    this.productService
      .getProducts(page, this.selectedCategoryId, this.sort, this.perPage, this.searchQuery)
      .subscribe(res => {
        this.products = res.data;
        this.totalProducts = res.total;
        this.currentPage = res.current_page;
        this.lastPage = res.last_page;
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

  filterByCategory(id: number | null) {
    this.selectedCategoryId = id;
    this.loadProducts(1);
    this.isMobileFiltersOpen = false;
  }

  onSortChange(event: any) {
    this.sort = event.target.value;
    this.loadProducts(1);
  }

  onSearch() {
    this.loadProducts(1);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.lastPage) {
      this.loadProducts(page);
    }
  }

  resetFilters() {
    this.selectedCategoryId = null;
    this.searchQuery = '';
    this.sort = 'default';
    this.loadProducts(1);
  }

  toggleMobileFilters() {
    this.isMobileFiltersOpen = !this.isMobileFiltersOpen;
  }

  openZalo(item: any) {
    const url = `https://zalo.me/${this.sitePhone}?text=Tôi cần tư vấn về sản phẩm: ${item.name}`;
    window.open(url, '_blank');
  }

  copyLink(item: any) {
    this.http.post(`${environment.apiUrl}/trader/links`, {
      product_id: item.id
    }).subscribe((res: any) => {
      navigator.clipboard.writeText(res.link);
      alert('Đã copy link!');
    });
  }
}