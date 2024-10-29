import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Product} from '../../models/market.model';
import {MarketService} from '../../services/market.service';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-edit-product-modal',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './edit-product-modal.component.html',
  styleUrl: './edit-product-modal.component.css'
})
export class EditProductModalComponent implements OnInit {
  @Input() marketName!: string;
  @Input() departmentId!: number;
  @Input() productId!: string;
  @Output() productUpdated = new EventEmitter<Product>();
  @Output() productDeleted = new EventEmitter<string>();
  product!: Product | undefined;
  updatedName: string = '';
  currentDepartmentName!: string;
  departments: any[] = [];
  markets: any[] = [];
  selectedMarketId!: number;
  selectedDepartmentId!: number;

  constructor(private marketService: MarketService) {}

  ngOnInit(): void {
    this.loadMarkets();
    this.loadDepartments();
    this.loadProduct();
  }

  loadDepartments(): void {
    const market = this.marketService.markets.find(m => m.name === this.marketName);
    this.departments = market ? market.departments : [];
  }

  loadMarkets(): void {
    this.marketService.markets$.subscribe(data => {
      this.markets = data;
    });
  }
  loadProduct(): void {
    const markets = this.marketService.markets;
    const market = markets.find(m => m.name === this.marketName);
    if (market) {
      const department = market.departments.find(dep => dep.id === this.departmentId);
      if (department) {
        this.product = department.products.find(prod => prod.id === this.productId);
        if (this.product) {
          this.updatedName = this.product.name;
          this.currentDepartmentName=department.type
          this.selectedDepartmentId = department.id;
          this.selectedMarketId=market.id
        }
      }
    }
  }

  updateProduct(): void {
    if (this.product) {
      const success = this.marketService.updateProduct(this.marketName, this.departmentId, this.productId, this.updatedName);
      if (success) {
        alert('Ürün başarıyla güncellendi!');
        this.productUpdated.emit(this.product);
        this.closeModal();
      } else {
        alert('Ürün güncellenirken bir hata oluştu.');
      }
    }
  }

  deleteProduct(): void {
    const success = this.marketService.deleteProduct(this.marketName, this.departmentId, this.productId);
    if (success) {
      alert('Ürün başarıyla silindi!');
      this.productDeleted.emit(this.productId);
      this.closeModal()
    } else {
      alert('Ürün silinirken bir hata oluştu.');
    }
  }
  closeModal(): void {
    const modalElement = document.getElementById('editProductModal');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide();
    }
  }
}
