// src/app/edit-image-modal/edit-image-modal.component.ts
import { Component, inject, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';

import {Image, ImageFragment, ImageListFragment, OsCategoryFragment} from '../graphql/generated';
import { GraphqlService } from '../services/graphql.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './edit-image-modal.component.html',
  styleUrls: ['./edit-image-modal.component.scss']
})
export class EditImageModalComponent {
  @Output() imageCreated = new EventEmitter<ImageFragment>();

  modal = inject(NgbActiveModal);
  image?: ImageFragment;
  categories: OsCategoryFragment[] = [];
  iconPreview?: string;
  graphql = inject(GraphqlService);
  imagesLists: ImageListFragment[] = [];
  
  // New properties for the redesigned modal
  currentIcon?: string;
  newUrlInput = '';
  imageUrls: Array<{url: string, isAvailable: boolean | null, isDefault: boolean}> = [];
  availableLists: ImageListFragment[] = [];
  iconLoaded = false;
  iconLoading = false;

  updateIconPreview() {
    this.iconPreview = this.imageForm.get('icon')?.value;
    this.currentIcon = this.imageForm.get('icon')?.value;
  }

  onIconChange(event: any) {
    const value = event.target.value;
    this.currentIcon = value;
    this.iconPreview = value;
    this.iconLoaded = false;
    this.iconLoading = !!value;
  }

  onIconLoad() {
    this.iconLoaded = true;
    this.iconLoading = false;
  }

  onIconError() {
    this.iconLoaded = false;
    this.iconLoading = false;
  }

  addUrl() {
    if (this.newUrlInput.trim()) {
      this.imageUrls.push({
        url: this.newUrlInput.trim(),
        isAvailable: null, // Will be checked later
        isDefault: this.imageUrls.length === 0 // First URL is default
      });
      this.newUrlInput = '';
    }
  }

  toggleFavorite(index: number) {
    // Remove default from all URLs
    this.imageUrls.forEach(url => url.isDefault = false);
    // Set clicked URL as default
    this.imageUrls[index].isDefault = true;
  }

  removeUrl(index: number) {
    this.imageUrls.splice(index, 1);
  }

  isListSelected(listId: string): boolean {
    const numericId = Number(listId);
    const currentLists = this.imageForm.get('imagesLists')?.value || [];
    return currentLists.includes(numericId);
  }

  toggleList(listId: string, event: any) {
    const numericId = Number(listId);
    const currentLists = this.imageForm.get('imagesLists')?.value || [];
    
    if (event.target.checked) {
      if (!currentLists.includes(numericId)) {
        this.imageForm.get('imagesLists')?.setValue([...currentLists, numericId]);
      }
    } else {
      const newValue = currentLists.filter(id => id !== numericId);
      this.imageForm.get('imagesLists')?.setValue(newValue);
    }
    this.imageForm.get('imagesLists')?.markAsTouched();
  }


  imageForm = new FormGroup({
    name: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    description: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    icon: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    urls: new FormArray<FormGroup<{
      url: FormControl<string>;
      isDefault: FormControl<boolean>;
    }>>([]),
    extractSize: new FormControl<number>(0, {nonNullable: true}),
    extractSha256: new FormControl<string>(''),
    imageDownloadSize: new FormControl<number>(0, {nonNullable: true}),
    isEnabled: new FormControl<boolean>(true, {nonNullable: true}),
    categoryId: new FormControl<string>(''),
    redirectsCount: new FormControl<number>(0, {nonNullable: true}),
    imagesLists: new FormControl<number[]>([], {
      nonNullable: true,
      validators: [Validators.required]
    }),
  });

  get urls() {
    return this.imageForm.get('urls') as FormArray;
  }


  ngOnInit() {
    // Initialize available lists
    this.availableLists = this.imagesLists;
    
    if (this.image?.id) {
      this.imageForm.patchValue({
        name: this.image.name,
        description: this.image.description,
        icon: this.image.icon,
        extractSize: this.image.extractSize,
        extractSha256: this.image.extractSha256 || '',
        imageDownloadSize: this.image.imageDownloadSize,
        isEnabled: this.image.isEnabled,
        categoryId: this.image.category?.id || '',
        redirectsCount: this.image.redirectsCount || 0
      });
      
      // Load URLs into new format
      this.imageUrls = this.image.urls.map(url => ({
        url: url.url,
        isAvailable: url.isAvailable,
        isDefault: url.isDefault || false
      }));
      
      if (this.image?.icon) {
        this.iconPreview = this.image.icon;
        this.currentIcon = this.image.icon;
      }
    }
    if (this.image?.imagesLists) {
      const listIds = this.image.imagesLists.map(id => Number(id));
      this.imageForm.patchValue({
        imagesLists: listIds
      });
    }
  }

  toggleListSelection(listId: string) {
    const numericId = Number(listId);
    const currentLists = this.imageForm.get('imagesLists')?.value || [];
    const index = currentLists.indexOf(numericId);

    if (index === -1) {
      this.imageForm.get('imagesLists')?.setValue([...currentLists, numericId]);
    } else {
      const newValue = currentLists.filter(id => id !== numericId);
      this.imageForm.get('imagesLists')?.setValue(newValue);
    }
    this.imageForm.get('imagesLists')?.markAsTouched();
  }


  setDefaultUrl(index: number) {
    this.urls.controls.forEach((control, i) =>
      control.get('isDefault')?.setValue(i === index)
    );
  }

  onSubmit() {
    if (this.imageForm.invalid) return;

    const formValue = this.imageForm.getRawValue();

    const input = {
      ...formValue,
      isEnabled: String(formValue.isEnabled) === 'true', // Convert to boolean properly
      imagesLists: formValue.imagesLists,
      urls: this.imageUrls.map(u => ({
        url: u.url,
        isDefault: u.isDefault
      })),
      extractSize: Number(formValue.extractSize),
      imageDownloadSize: Number(formValue.imageDownloadSize),
    };

    if (this.image?.id) {
      // Update
      this.graphql.updateImagePartial(this.image.id, input).subscribe({
        next: () => this.modal.close(true),
        error: (err: any) => console.error('Update failed', err)
      });
    } else {
      // Create
      this.graphql.createImage(input).subscribe({
        next: (response) => {
          const newImage = (response.data as { createImage: ImageFragment }).createImage;
          this.imageCreated.emit(newImage);
          this.modal.close(true);
        },
        error: (err: any) => console.error('Create failed', err)
      });
    }
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  protected readonly Number = Number;
}
