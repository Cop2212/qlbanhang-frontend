import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ReviewService } from '../../services/review.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { TraderService } from '../../services/trader.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  activeTab: 'description' | 'reviews' | 'specifications' = 'description';

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
  isZoomed: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private reviewService: ReviewService,
    private http: HttpClient,
    private traderService: TraderService,
    public auth: AuthService
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
    this.isZoomed = false;
  }

  toggleZoom() {
    this.isZoomed = !this.isZoomed;
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
    // Validate Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.review.email)) {
      alert("Vui lòng nhập định dạng Email hợp lệ!");
      return;
    }

    this.review.product_id = this.product.id;

    this.reviewService
      .createReview(this.review)
      .subscribe({
        next: (res: any) => {
          alert("Gửi đánh giá thành công! Dữ liệu của bạn đã được ghi nhận.");

          // Thêm vào danh sách hiển thị (bao gồm cả email)
          const newReview = {
            name: this.review.name,
            email: this.review.email,
            rating: Number(this.review.rating),
            comment: this.review.comment
          };
          
          // Kiểm tra nếu email này đã đánh giá rồi thì thay thế cái cũ trong list hiện tại
          const index = this.filteredReviews.findIndex(r => r.email === this.review.email);
          if (index !== -1) {
            this.filteredReviews[index] = newReview;
          } else {
            this.filteredReviews = [newReview, ...this.filteredReviews];
            this.totalReviews++;
          }

          // Reset form
          this.review = {
            product_id: 0,
            name: '',
            email: '',
            rating: '5',
            comment: ''
          };
        },
        error: (err) => {
          alert(err.error?.message || "Lỗi khi gửi đánh giá.");
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

  copyLink() {
    if (!this.product?.id) return;

    this.traderService.generateLink(this.product.id).subscribe({
      next: (res: any) => {
        if (res.link) {
          navigator.clipboard.writeText(res.link).then(() => {
            alert("Đã sao chép link Affiliate!");
          });
        }
      },
      error: (err) => {
        console.error('Lỗi khi lấy link:', err);
        alert("Không thể lấy link Affiliate lúc này.");
      }
    });
  }

}