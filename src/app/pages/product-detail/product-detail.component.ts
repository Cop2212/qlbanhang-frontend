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
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SettingService } from '../../services/setting.service';
import { Setting } from '../../models/setting';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  activeTab: 'description' | 'reviews' | 'specifications' = 'description';

  product: any;
  similarProducts: any[] = [];
  setting?: Setting;

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
  isZoomed: boolean = false;
  isLoading: boolean = true;
  isSubmitting: boolean = false;

  consultationForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private reviewService: ReviewService,
    private http: HttpClient,
    private traderService: TraderService,
    private fb: FormBuilder,
    private settingService: SettingService,
    public auth: AuthService
  ) {
    this.consultationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^(03|05|07|08|09)\d{8}$/)]],
      email: ['', [Validators.email]],
      message: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit() {
    this.settingService.getSetting().subscribe(res => {
      this.setting = res;
    });

    this.route.queryParams.subscribe(params => {
      if (params['ref']) {
        localStorage.setItem('ref_code', params['ref']);
      }
    });

    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');

      if (slug) {
        this.isLoading = true;
        this.productService.getProductDetail(slug)
          .subscribe({
            next: (res) => {
              this.product = res.product;
              this.similarProducts = res.similar_products;
              this.mainImage = this.product.thumbnail;
              this.loadReviews();
              this.isLoading = false;
              window.scrollTo(0, 0);
            },
            error: () => {
              this.isLoading = false;
            }
          });
      }
    });
  }

  zoomOrigin = 'center center';

  changeImage(img: string) {
    this.mainImage = img;
    this.isZoomed = false;
  }

  toggleZoom(e: MouseEvent) {
    this.isZoomed = !this.isZoomed;
    if (this.isZoomed) {
      this.updateZoomOrigin(e);
    }
  }

  private updateZoomOrigin(e: MouseEvent) {
    const container = e.currentTarget as HTMLElement;
    const { left, top, width, height } = container.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    this.zoomOrigin = `${x}% ${y}%`;
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
            comment: this.review.comment,
            created_at: new Date()
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
    if (this.consultationForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const ref = localStorage.getItem('ref_code');
      const traderId = localStorage.getItem('trader_id');

      const data = {
        ...this.consultationForm.value,
        product_id: this.product.id,
        trader_id: traderId,
        ref_code: ref
      };

      this.http.post(`${environment.apiUrl}/consultations`, data)
        .subscribe({
          next: () => {
            alert('Cảm ơn bạn! Yêu cầu hỗ trợ của bạn đã được gửi. Chuyên viên sẽ liên hệ lại sớm nhất.');
            this.consultationForm.reset();
            this.isSubmitting = false;
            this.closeForm();
          },
          error: (err) => {
            console.error('Lỗi khi gửi tư vấn:', err);
            alert('Gửi yêu cầu thất bại. Vui lòng thử lại sau.');
            this.isSubmitting = false;
          }
        });
    }
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