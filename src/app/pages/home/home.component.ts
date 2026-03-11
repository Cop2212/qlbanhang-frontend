import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SliderService } from '../../services/slider.service';
import { ProductService } from '../../services/product.service';
import { Slider } from '../../models/slider';
import { Product } from '../../models/product';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  sliders: Slider[] = [];
  products: Product[] = [];

  constructor(private sliderService: SliderService, private productService: ProductService) { }
  currentSlide = 0;
  slideInterval: any;

  ngOnInit() {
    this.sliderService.getSliders().subscribe(data => {
      this.sliders = data;
    });

    this.productService.getProducts().subscribe(data => {
      this.products = data;
    });

    this.startAutoSlide();
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
}