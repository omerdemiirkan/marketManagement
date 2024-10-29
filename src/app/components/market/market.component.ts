import {Component, OnInit, ViewChild} from '@angular/core';
import {MarketService} from '../../services/market.service';
import {DepartmentComponent} from '../department/department.component';
import {CommonModule} from '@angular/common';
import * as bootstrap from 'bootstrap';
import {FormsModule} from '@angular/forms';
import {AddProductModalComponent} from '../add-product-modal/add-product-modal.component';
import {Department, Market, Product} from '../../models/market.model';
import {NavbarComponent} from "../navbar/navbar.component";
import {EditProductModalComponent} from "../edit-product-modal/edit-product-modal.component";

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css'],
  standalone: true,
  imports: [CommonModule, DepartmentComponent, FormsModule, AddProductModalComponent,NavbarComponent,EditProductModalComponent]
})
export class MarketComponent implements OnInit {
  selectedMarket: string = '';
  markets: Market[] = [];
  products: Product[] = [];
  selectedDepartment: string = '';
  selectedDepartmentId: number = 0;
  filteredMarkets: Market[] = [];
  filteredProducts: Product[] = [];
  @ViewChild(EditProductModalComponent) editProductModalComponent!: EditProductModalComponent;

  selectedMarketName: string = '';
  selectedProductId: string
  constructor(private marketService: MarketService) {
    this.selectedProductId = '';

  }

  ngOnInit(): void {
    this.loadMarkets();
    this.marketService.getMarkets().subscribe(markets => {
      this.products = markets.flatMap(market =>
        market.departments.flatMap(department => department.products)
      );
      this.filteredProducts = this.products;
    });
  }

  onSearchTermChanged(searchTerm: string): void {
    if (searchTerm) {
      this.filteredMarkets = this.markets.map(market => ({
        ...market,
        departments: market.departments.map(department => ({
          ...department,
          products: department.products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        })).filter(department => department.products.length > 0)
      })).filter(market => market.departments.length > 0);
    } else {
      this.filteredMarkets = this.markets;
    }
  }

  loadMarkets(): void {
    this.marketService.getMarkets().subscribe(markets => {
      this.markets = markets;
      this.filteredMarkets = markets;
    });
  }

  openAddDepartmentModal(marketName: string): void {
    this.selectedMarket = marketName;
    const modalElement = document.getElementById('addDepartmentModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  openAddProductModal(marketName: string, department: Department): void {
    this.selectedMarket = marketName;
    this.selectedDepartment = department.name;
    this.selectedDepartmentId = department.id;

    const modalElement = document.getElementById('addProductModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  onProductAdded(): void {
    this.loadMarkets();
  }
  onDepartmentAdded(): void {
    this.loadMarkets();
  }
  confirmDelete(departmentId: number, marketName: string): void {
    const confirmation = confirm('Bu reyonu silmek istediğinize emin misiniz?');
    if (confirmation) {
      const success = this.marketService.deleteDepartment(marketName, departmentId);
      if (success) {
        alert('Reyon başarıyla silindi.');
        this.loadMarkets();
      } else {
        alert('Reyon silinirken bir hata oluştu.');
      }
    }
  }

  openEditProductModal(marketName: string, departmentId: number, productId: string): void {
    this.selectedMarketName = marketName;
    this.selectedDepartmentId = departmentId;
    this.selectedProductId = productId;
    this.editProductModalComponent.marketName = marketName;
    this.editProductModalComponent.departmentId = departmentId;
    this.editProductModalComponent.productId = productId;
    const modalElement = document.getElementById('editProductModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
    this.editProductModalComponent.loadProduct();

  }

  onProductUpdated(updatedProduct: any) {
    console.log('Ürün güncellendi:', updatedProduct);
  }

  onProductDeleted(deletedProductId: string) {
    console.log('Ürün silindi:', deletedProductId);
  }
}
