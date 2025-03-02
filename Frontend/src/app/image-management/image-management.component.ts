import { Component } from '@angular/core';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import {ImageService} from '../services/image.service';
import {Image} from '../models/image';
import {EditImageModalComponent} from '../edit-image-modal/edit-image-modal.component';
import {NgClass, NgForOf} from '@angular/common';
import {Category} from '../models/category';
import {CategoryService} from '../services/category.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-image-management',
  imports: [NgbModalModule, NgClass, NgForOf, FormsModule],
  standalone: true,
  templateUrl: './image-management.component.html',
  styleUrl: './image-management.component.scss'
})
export class ImageManagementComponent {
  images: Image[] = [];
  categories: Category[] = [];

  constructor(
    private imageService: ImageService,
    private categoryService: CategoryService,
    private modalService: NgbModal
  ) {
    this.loadImages();
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(data => this.categories = data);
  }

  updateCategory(image: Image, categoryName: string): void {
    image.category = { name: categoryName };
    this.imageService.updateImage(image).subscribe(); // Neuen updateImage Service erstellen
  }

  loadImages(): void {
    this.imageService.getImages().subscribe(data => this.images = data);
  }

  openEditModal(image?: Image): void {
    const modalRef = this.modalService.open(EditImageModalComponent, {
      centered: true,
      size: 'lg'
    });

    // Übergabe eines Kopie-Objekts, um direkte Bindungen zu vermeiden
    modalRef.componentInstance.image = image ? { ...image } : {
      id: '',
      name: '',
      description: '',
      icon: '',
      url: '',
      backupUrls: [],
      extractSize: 0,
      extractSha256: '',
      imageDownloadSize: 0,
      isEnabled: true,
      category: { name: 'Uncategorized' }
    };

    modalRef.result.then((result) => {
      if (result) {
        if (result.action === 'update') {
          // Finde das Element und ersetze es
          const index = this.images.findIndex(i => i.id === result.image.id);
          if (index !== -1) {
            this.images[index] = result.image;
          }
        } else if (result.action === 'create') {
          // Neues Element zur Liste hinzufügen
          this.images.push(result.image);
        }
      }
    }).catch(() => {});
  }

  selectImage(image: Image): void {
    // Hier kannst du ebenfalls das Edit-Modal mit dem ausgewählten Bild öffnen
    const modalRef = this.modalService.open(EditImageModalComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.image = image;
    modalRef.result.then((result) => {
      if (result) {
        this.loadImages();
      }
    }).catch(() => {});
  }

  updateStatus(image: Image, newStatus: boolean): void {
    this.imageService.updateImageStatus(image.id, newStatus).subscribe(updatedImage => {
      image.isEnabled = updatedImage.isEnabled;
    });
  }

  deleteImage(image: Image, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete?')) {
      this.imageService.deleteImage(image.id).subscribe(() => {
        // Entferne das Bild aus dem lokalen Array
        this.images = this.images.filter(i => i.id !== image.id);
      });
    }
  }


  trackById(index: number, image: Image): string {
    return image.id;
  }


}
