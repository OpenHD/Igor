  import {Component, Input, OnInit} from '@angular/core';
  import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
  import {CommonModule} from '@angular/common';
  import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
  import {Image} from '../models/image';
  import {ImageService} from '../services/image.service';
  import {CategoryService} from '../services/category.service';
  import {OsCategory} from '../models/osCategory';

  @Component({
    selector: 'app-edit-image-modal',
    imports: [CommonModule, ReactiveFormsModule],
    standalone: true,
    templateUrl: './edit-image-modal.component.html',
    styleUrl: './edit-image-modal.component.scss'
  })
  export class EditImageModalComponent implements OnInit {
    @Input() image?: Image;
    imageForm!: FormGroup;
    iconPreview: string = '';

    categories: OsCategory[] = [];

    constructor(
      public modal: NgbActiveModal,
      private fb: FormBuilder,
      private imageService: ImageService,
      private categoryService: CategoryService
    ) {}

    ngOnInit(): void {
      this.categoryService.getCategories().subscribe(cats => this.categories = cats);

      this.imageForm = this.fb.group({
        id: [this.image?.id || ''],
        name: [this.image?.name || '', Validators.required],
        description: [this.image?.description || '', Validators.required],
        icon: [this.image?.icon || '', [Validators.required]],
        url: [this.image?.url || '', [Validators.required]],
        urls: this.fb.array([], Validators.required),
        backupUrls: this.fb.array(this.image?.backupUrls?.length ? this.image.backupUrls : []),
        extractSize: [this.image?.extractSize || 0, [Validators.required, Validators.min(0)]],
        extractSha256: [this.image?.extractSha256 || '', Validators.required],
        imageDownloadSize: [this.image?.imageDownloadSize || 0, [Validators.required, Validators.min(0)]],
        isEnabled: [this.image?.isEnabled || false],
        category: [this.image?.category?.name || '', Validators.required]
      });


      // Initialisiere die Icon-Vorschau basierend auf dem aktuellen Wert
      this.iconPreview = this.getIconUrl();

      // Aktualisiere die Vorschau, wenn sich der Icon-Wert ändert
      this.imageForm.get('icon')?.valueChanges.subscribe(() => {
        this.iconPreview = this.getIconUrl();
      });


    }

    // URL-Handling:
    get urlForms() {
      return this.imageForm.get('urls') as FormArray;
    }

    addUrl() {
      this.urlForms.push(this.fb.group({
        url: ['', Validators.required],
        isDefault: [false]
      }));
    }

    // Getter für das Backup URLs FormArray
    get backupUrls(): FormArray {
      return this.imageForm.get('backupUrls') as FormArray;
    }

    addBackupUrl(): void {
      this.backupUrls.push(this.fb.control(''));
    }

    removeBackupUrl(index: number): void {
      this.backupUrls.removeAt(index);
    }

    getIconUrl(): string {
      const iconValue = this.imageForm.get('icon')?.value;
      if (!iconValue) return '';
      return iconValue.startsWith('http') ? iconValue : `/images/icons/${iconValue}`;
    }

    updateIconPreview(): void {
      this.iconPreview = this.getIconUrl();
    }

    onSubmit(): void {
      if (this.imageForm.invalid) {
        // Alle Felder als touched markieren, um die Fehleranzeigen zu triggern
        this.imageForm.markAllAsTouched();
        return;
      }

      const formValue = {
        ...this.imageForm.value,
        category: {name: this.imageForm.value.category},
        csrfToken: 'TODO-ADD-CSRF-TOKEN' // WICHTIG!
      };

      if (formValue.id) {
        // Bestehendes Bild updaten
        this.imageService.updateImage(formValue).subscribe(updatedImage => {
          this.modal.close({action: 'update', image: updatedImage});
        });
      } else {
        // Neues Bild erstellen
        formValue.id = ''; // Service generiert eine neue ID
        this.imageService.saveImage(formValue).subscribe(newImage => {
          this.modal.close({action: 'create', image: newImage});
        });
      }
    }

  }
