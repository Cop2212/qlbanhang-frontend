import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SliderService } from '../../services/slider.service';
import { ProductService } from '../../services/product.service';
import { Slider } from '../../models/slider';
import { Product } from '../../models/product';
import { ConsultationService } from '../../services/consultation.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  sliders: Slider[] = [];
  featuredProducts: Product[] = [];

  currentSlide = 0;
  slideInterval: any;

  constructor(
    private sliderService: SliderService,
    private productService: ProductService,
    private consultationService: ConsultationService
  ) { }

  ngOnInit() {

    // load slider
    this.sliderService.getSliders().subscribe(data => {
      this.sliders = data;
    });

    // load sản phẩm nổi bật
    this.loadFeaturedProducts();

    this.startAutoSlide();
  }

  loadFeaturedProducts() {

    this.productService.getFeaturedProducts()
      .subscribe((res: any) => {
        this.featuredProducts = res;
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

  form = {
    name: '',
    phone: '',
    email: '',
    message: ''
  };

  submitForm() {
    this.consultationService.sendConsultation(this.form)
      .subscribe({
        next: () => {
          alert('Gửi thành công!');
          this.form = { name: '', phone: '', email: '', message: '' };
        },
        error: (err) => {
          console.error(err);
          alert('Gửi thất bại!');
        }
      });
  }
}