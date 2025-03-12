// src/app/image-management/image-management.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditImageModalComponent } from '../edit-image-modal/edit-image-modal.component';
import {GraphqlService} from '../services/graphql.service';
import {Image, ImageFragmentFragment, OsCategoryFragmentFragment, ImageListFragmentFragment} from '../graphql/generated';

@Component({
  selector: 'app-image-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './image-management.component.html',
  styleUrls: ['./image-management.component.scss']
})
export class ImageManagementComponent {
  private modalService = inject(NgbModal);
  private graphql = inject(GraphqlService);

  images: ImageFragmentFragment[] = [];
  categories: OsCategoryFragmentFragment[] = [];
  currentView: 'grid' | 'list' = 'grid';
  imagesLists: ImageListFragmentFragment[] = [];
  selectedListId: string | null = null;

  ngOnInit() {
    this.graphql.getImagesListsWithCategories().valueChanges.subscribe({
      next: ({ data }) => {
        this.imagesLists = data.imagesLists;
        this.categories = data.osCategories;
        if (this.imagesLists.length > 0) {
          this.selectedListId = this.imagesLists[0].id;
        }
      },
      error: (err) => console.error('Error loading data', err)
    });
  }

  get selectedList(): ImageListFragmentFragment | undefined {
    return this.imagesLists.find(list => list.id === this.selectedListId);
  }

  selectImage(image: Image) {
    this.openEditModal(image);
  }

  getAvailability(image: ImageFragmentFragment): string {
    const available = image.urls.filter(u => u.isAvailable).length;
    return `${available}/${image.urls.length}`;
  }

  openEditModal(image?: ImageFragmentFragment) {
    const modalRef = this.modalService.open(EditImageModalComponent, { size: 'xl' });
    modalRef.componentInstance.categories = this.categories;

    if (image) {
      modalRef.componentInstance.image = { ...image };
    }

    modalRef.componentInstance.imageCreated.subscribe((newImage: ImageFragmentFragment) => {
      this.images = [...this.images, newImage]; // Use spread operator to add new image
    });

    modalRef.result.then(
      (result) => this.handleImageUpdate(result),
      () => {}
    );
  }


  private handleImageUpdate(result: any) {
    // Handle create/update logic
  }

  updateCategory(image: Image, categoryId: string) {
    this.graphql.updateImagePartial(image.id, { categoryId }).subscribe({
      next: () => console.log('Update successful'),
      error: (err) => console.error('Update failed', err)
    });
  }

  updateStatus(image: ImageFragmentFragment, isEnabled: boolean) {
    this.graphql.updateImagePartial(image.id, { isEnabled }).subscribe();
  }

  deleteImage(image: ImageFragmentFragment, event: Event) {
    event.stopPropagation();
    if (confirm(`Delete ${image.name}?`)) {
      this.graphql.deleteImage(image.id).subscribe({
        next: () => {
          this.graphql.getImagesListsWithCategories().refetch();
        },
        error: (err) => console.error('Delete failed', err)
      });
    }
  }

  trackById(index: number, item: ImageFragmentFragment) {
    return item.id;
  }

  getAvailableCount(image: ImageFragmentFragment): number {
    return image.urls.filter(url => url.isAvailable).length;
  }

  // In der ImageManagementComponent-Klasse
  getCategoryImageCount(categoryId: string): number {
    return this.images.filter(img => img.category?.id === categoryId).length;
  }

  getImagesForCategory(categoryId: string): ImageFragmentFragment[] {
    return this.images.filter(img => img.category?.id === categoryId);
  }

  // Für die Sortierung der Kategorien (optional)
  get sortedCategories() {
    return [...this.categories].sort((a, b) => a.name.localeCompare(b.name));
  }

  getCategoriesForList(list: ImageListFragmentFragment): OsCategoryFragmentFragment[] {
    const categories = list.images
      .map(image => image.category)
      .filter((cat): cat is OsCategoryFragmentFragment => !!cat);
    const uniqueCategories = Array.from(new Map(categories.map(cat => [cat.id, cat])).values());
    return uniqueCategories.sort((a, b) => a.position - b.position || a.name.localeCompare(b.name));
  }

  getImagesForCategoryInList(list: ImageListFragmentFragment, categoryId: string): ImageFragmentFragment[] {
    return list.images.filter(image => image.category?.id === categoryId);
  }


}
