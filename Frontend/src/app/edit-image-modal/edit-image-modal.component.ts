// src/app/edit-image-modal/edit-image-modal.component.ts
import { Component, inject, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Image, ImageFragmentFragment, OsCategoryFragmentFragment } from '../graphql/generated';
import { GraphqlService } from '../services/graphql.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-image-modal.component.html',
  styleUrls: ['./edit-image-modal.component.scss']
})
export class EditImageModalComponent {
  @Output() imageCreated = new EventEmitter<ImageFragmentFragment>();

  modal = inject(NgbActiveModal);
  image?: ImageFragmentFragment;
  categories: OsCategoryFragmentFragment[] = [];
  iconPreview?: string;
  graphql = inject(GraphqlService);

  updateIconPreview() {
    this.iconPreview = this.imageForm.get('icon')?.value;
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
    categoryId: new FormControl<string>('')
  });

  get urls() {
    return this.imageForm.get('urls') as FormArray;
  }

  ngOnInit() {
    if (this.image?.id) {
      this.imageForm.patchValue({
        name: this.image.name,
        description: this.image.description,
        icon: this.image.icon,
        extractSize: this.image.extractSize,
        extractSha256: this.image.extractSha256 || '',
        imageDownloadSize: this.image.imageDownloadSize,
        isEnabled: this.image.isEnabled,
        categoryId: this.image.category?.id || ''
      });
      this.image.urls.forEach(url => {
        this.addUrl(url.url, url.isDefault);
      });
      if (this.image?.icon) {
        this.iconPreview = this.image.icon;
      }
    }

  }

  addUrl(url = '', isDefault = false) {
    this.urls.push(new FormGroup({
      url: new FormControl<string>(url, {nonNullable: true}),
      isDefault: new FormControl<boolean>(isDefault, {nonNullable: true})
    }));
  }

  removeUrl(index: number) {
    this.urls.removeAt(index);
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
      urls: formValue.urls.map(u => ({
        url: u.url,
        isDefault: u.isDefault
      })),
      extractSize: Number(formValue.extractSize),
      imageDownloadSize: Number(formValue.imageDownloadSize),
      url: formValue.urls.length > 0 ? formValue.urls[0].url : ''
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
          const newImage = (response.data as { createImage: ImageFragmentFragment }).createImage;
          this.imageCreated.emit(newImage);
          this.modal.close(true);
        },
        error: (err: any) => console.error('Create failed', err)
      });
    }
  }
}
