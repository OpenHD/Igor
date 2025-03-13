// src/app/image-management/image-management.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditImageModalComponent } from '../edit-image-modal/edit-image-modal.component';
import {GraphqlService} from '../services/graphql.service';
import {Image, ImageFragment, OsCategoryFragment, ImageListFragment} from '../graphql/generated';

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

  images: ImageFragment[] = [];
  categories: OsCategoryFragment[] = [];
  currentView: 'grid' | 'list' = 'grid';
  imagesLists: ImageListFragment[] = [];
  selectedListId: string | null = null;

  ngOnInit() {
    this.graphql.getImagesListsWithCategories().valueChanges.subscribe({
      next: ({ data }) => {
        const previousSelectedId = this.selectedListId; // Vorherige ID speichern
        this.imagesLists = data.imagesLists;
        this.categories = data.osCategories;

        // Behalte die ausgewählte Liste, wenn sie noch existiert
        if (this.imagesLists.length > 0) {
          const existingList = this.imagesLists.find(list => list.id === previousSelectedId);
          this.selectedListId = existingList ? existingList.id : this.imagesLists[0].id;
        } else {
          this.selectedListId = null;
        }
      },
      error: (err) => console.error('Error loading data', err)
    });
  }

  trackListById(index: number, list: ImageListFragment) {
    return list.id;
  }

  setActiveList(listId: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.selectedListId = listId;
  }

  get selectedList(): ImageListFragment | undefined {
    return this.imagesLists.find(list => list.id === this.selectedListId);
  }

  selectImage(image: Image) {
    this.openEditModal(image);
  }

  getAvailability(image: ImageFragment): string {
    const available = image.urls.filter(u => u.isAvailable).length;
    return `${available}/${image.urls.length}`;
  }

  openEditModal(image?: ImageFragment) {
    const modalRef = this.modalService.open(EditImageModalComponent, { size: 'xl' });
    modalRef.componentInstance.categories = this.categories;
    modalRef.componentInstance.imagesLists = this.imagesLists; // <-- Hinzufügen

    if (image) {
      modalRef.componentInstance.image = { ...image };
    }

    modalRef.componentInstance.imageCreated.subscribe((newImage: ImageFragment) => {
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

  updateCategory(image: ImageFragment, categoryId: string) {
    this.graphql.updateImagePartial(image.id, { categoryId }).subscribe({
      next: () => {
        // Direktes Update im State
        const updatedImage = {...image, category: this.categories.find(c => c.id === categoryId)};
        this.imagesLists = this.imagesLists.map(list => ({
          ...list,
          images: list.images.map(img => img.id === image.id ? updatedImage : img)
        }));
      }
    });
  }

  updateStatus(image: ImageFragment, isEnabled: boolean) {
    this.graphql.updateImagePartial(image.id, { isEnabled }).subscribe({
      next: () => {
        // Manuelles Update des Zustands ohne Neuladen der gesamten Liste
        const updatedImage = {...image, isEnabled};
        this.imagesLists = this.imagesLists.map(list => ({
          ...list,
          images: list.images.map(img => img.id === image.id ? updatedImage : img)
        }));
      }
    });
  }

  deleteImage(image: ImageFragment, event: Event) {
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

  trackById(index: number, item: ImageFragment) {
    return item.id;
  }

  getAvailableCount(image: ImageFragment): number {
    return image.urls.filter(url => url.isAvailable).length;
  }

  // In der ImageManagementComponent-Klasse
  getCategoryImageCount(categoryId: string): number {
    return this.images.filter(img => img.category?.id === categoryId).length;
  }

  getImagesForCategory(categoryId: string): ImageFragment[] {
    return this.images.filter(img => img.category?.id === categoryId);
  }

  // Für die Sortierung der Kategorien (optional)
  get sortedCategories() {
    return [...this.categories].sort((a, b) => a.name.localeCompare(b.name));
  }

  getCategoriesForList(list: ImageListFragment): OsCategoryFragment[] {
    const categories = list.images
      .map(image => image.category)
      .filter((cat): cat is OsCategoryFragment => !!cat);
    const uniqueCategories = Array.from(new Map(categories.map(cat => [cat.id, cat])).values());
    return uniqueCategories.sort((a, b) => a.position - b.position || a.name.localeCompare(b.name));
  }

  getImagesForCategoryInList(list: ImageListFragment, categoryId: string): ImageFragment[] {
    return list.images.filter(image => image.category?.id === categoryId);
  }


}
