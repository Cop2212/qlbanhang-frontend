import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ReviewService } from '../../services/review.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  activeTab: 'description' | 'reviews' = 'description';

  product: any;
  similarProducts: any[] = [];

  avgRating = 0;
  totalReviews = 0;
  ratingStats: any = {};

  reviews: any[] = [];
  review = {
    product_id: 0,
    name: '',
    email: '',
    rating: '',
    comment: ''
  };

  currentPage = 1;
  lastPage = 1;

  selectedRating: number | null = null;
  filteredReviews: any[] = [];

  mainImage: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private reviewService: ReviewService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');

      if (slug) {
        this.productService.getProductDetail(slug)
          .subscribe(res => {

            this.product = res.product;
            this.similarProducts = res.similar_products;

            this.mainImage = this.product.thumbnail;

            this.loadReviews();
            window.scrollTo(0, 0); // scroll lên đầu (optional)
          });
      }
    });
  }

  changeImage(img: string) {
    this.mainImage = img;
  }

  loadReviews(page: number = 1) {

    this.reviewService
      .getReviews(this.product.id, page)
      .subscribe((res: any) => {

        this.reviews = res.reviews.data;
        this.filteredReviews = this.reviews;

        this.currentPage = res.reviews.current_page;
        this.lastPage = res.reviews.last_page;

        this.avgRating = res.stats.avg_rating;
        this.totalReviews = res.stats.total_reviews;
        this.ratingStats = res.breakdown;

      });

  }

  filterByRating(star: number | null) {

    this.selectedRating = star;

    if (!star) {
      this.filteredReviews = this.reviews;
      return;
    }

    this.filteredReviews = this.reviews.filter(
      r => r.rating === star
    );

  }

  submitReview() {

    this.review.product_id = this.product.id;

    this.reviewService
      .createReview(this.review)
      .subscribe({

        next: (res: any) => {

          alert("Đánh giá đã gửi");

          this.review = {
            product_id: 0,
            name: '',
            email: '',
            rating: '',
            comment: ''
          };

        },

        error: (err) => {

          alert(err.error.message);

        }

      });

  }

}