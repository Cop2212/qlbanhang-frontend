import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SliderService } from '../../services/slider.service';
import { ProductService } from '../../services/product.service';
import { Slider } from '../../models/slider';
import { Product } from '../../models/product';
import { ConsultationService } from '../../services/consultation.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  sliders: Slider[] = [];
  featuredProducts: Product[] = [];
  consultationForm: FormGroup;

  currentSlide = 0;
  slideInterval: any;
  isLoadingSliders = true;
  isLoadingFeatured = true;
  isSubmitting = false;

  constructor(
    private sliderService: SliderService,
    private productService: ProductService,
    private consultationService: ConsultationService,
    private fb: FormBuilder
  ) {
    this.consultationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^(03|05|07|08|09)\d{8}$/)]],
      email: ['', [Validators.email]],
      message: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit() {
    // load slider
    this.isLoadingSliders = true;
    this.sliderService.getSliders().subscribe({
      next: (data) => {
        this.sliders = data;
        this.isLoadingSliders = false;
        this.startAutoSlide();
      },
      error: () => {
        this.isLoadingSliders = false;
      }
    });

    // load sản phẩm nổi bật
    this.loadFeaturedProducts();
  }

  loadFeaturedProducts() {
    this.isLoadingFeatured = true;
    this.productService.getFeaturedProducts()
      .subscribe({
        next: (res: any) => {
          this.featuredProducts = res;
          this.isLoadingFeatured = false;
        },
        error: () => {
          this.isLoadingFeatured = false;
        }
      });
  }

  startAutoSlide() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide() {
    this.currentSlide++;
    if (this.currentSlide >= this.sliders.length) {
      this.currentSlide = 0;
    }
  }

  prevSlide() {
    this.currentSlide--;
    if (this.currentSlide < 0) {
      this.currentSlide = this.sliders.length - 1;
    }
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  submitForm() {
    if (this.consultationForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.consultationService.sendConsultation(this.consultationForm.value)
        .subscribe({
          next: () => {
            alert('Cảm ơn bạn! Yêu cầu của bạn đã được gửi thành công. Chúng tôi sẽ liên hệ lại sớm nhất.');
            this.consultationForm.reset();
            this.isSubmitting = false;
          },
          error: (err) => {
            console.error(err);
            alert('Gửi yêu cầu thất bại. Vui lòng thử lại sau.');
            this.isSubmitting = false;
          }
        });
    }
  }
}