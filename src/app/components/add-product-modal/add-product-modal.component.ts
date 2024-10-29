import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarketService } from '../../services/market.service';
import { Product } from '../../models/market.model';

@Component({
  selector: 'app-add-product-modal',
  templateUrl: './add-product-modal.component.html',
  styleUrls: ['./add-product-modal.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class AddProductModalComponent {
  @Input() selectedMarketName: string = '';
  @Input() selectedDepartmentId: number = 0;
  @Input() selectedDepartmentName: string = '';
  @Output() productAdded = new EventEmitter<Product>();
  productName: string = '';
  productId: string = '';

  constructor(private marketService: MarketService) {}

  addProduct(): void {
    if (this.productId && this.productName) {
      const marketName = this.selectedMarketName;
      const departmentId = this.selectedDepartmentId;
      const newProduct = this.marketService.addProduct(marketName, departmentId, this.productName);
      if (newProduct) {
        this.productAdded.emit(newProduct);
        this.productName = '';
        this.productId = '';
      } else {
        alert('Ürün eklenemedi. Lütfen kontrol edin.');
      }
    } else {
      alert('Ürün ID ve Ürün Adı alanlarını doldurun.');
    }
  }
}
