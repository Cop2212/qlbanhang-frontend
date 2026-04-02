import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ReviewService } from '../../services/review.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { TraderService } from '../../services/trader.service';

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

  showForm = false;
  consult: any = {};

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private reviewService: ReviewService,
    private http: HttpClient,
    private traderService: TraderService
  ) { }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      if (params['ref']) {
        localStorage.setItem('ref_code', params['ref']);
      }
    });

    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');

      if (slug) {
        this.productService.getProductDetail(slug)
          .subscribe(res => {

            this.product = res.product;
            this.similarProducts = res.similar_products;

            this.mainImage = this.product.thumbnail;

            this.loadReviews();
            window.scrollTo(0, 0);
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

  openForm() {
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
  }

  submitConsultation() {

    const ref = localStorage.getItem('ref_code');
    const traderId = localStorage.getItem('trader_id');

    const data = {
      ...this.consult,
      product_id: this.product.id,
      trader_id: traderId,
      ref_code: ref
    };

    console.log('CONSULT DATA:', data);

    this.http.post(`${environment.apiUrl}/consultations`, data)
      .subscribe(() => {
        alert('Đã gửi!');
        this.closeForm();
      });
  }

}