import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  activeTab: 'description' | 'reviews' = 'description';

  product: any;
  similarProducts: any[] = [];

  mainImage: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) { }

  ngOnInit(): void {

    const slug = this.route.snapshot.paramMap.get('slug');

    if (slug) {
      this.productService.getProductDetail(slug)
        .subscribe(res => {

          this.product = res.product;

          this.similarProducts = res.similar_products;

          this.mainImage = this.product.thumbnail;

        });
    }

  }

  changeImage(img: string) {
    this.mainImage = img;
  }

}