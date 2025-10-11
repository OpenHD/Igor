import { Component, ElementRef, ViewChild, AfterViewInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { GraphqlService } from '../services/graphql.service';
import {
  OsCategoryFragment,
  GetOsCategoriesDocument,
  UpdateOsCategoryPartialDocument
} from '../graphql/generated';
import { catchError, of } from 'rxjs';
import { LoadingStateService } from '../services/loading-state.service';

@Component({
  selector: 'app-os-category-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CdkDropList, CdkDrag],
  templateUrl: './os-category-management.component.html',
  styleUrls: ['./os-category-management.component.scss']
})
export class OsCategoryManagementComponent implements AfterViewInit {
  private graphql = inject(GraphqlService);
  private apollo = inject(Apollo);
  private loadingStateService = inject(LoadingStateService);
  private platformId = inject(PLATFORM_ID);

  @ViewChild('newCategoryInput') newCategoryInput!: ElementRef;

  categories: (OsCategoryFragment & {
    isEditing?: boolean;
    editedName?: string;
    editedDescription?: string;
    editedIcon?: string;
  })[] = [];
  newCategory = { name: '', description: '', icon: '' };
  loading = true;
  error: string | null = null;
  
  isLoading$;

  constructor() {
    this.isLoading$ = this.loadingStateService.getLoadingState('category-management');
  }

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.loadCategories();
  }

  ngAfterViewInit(): void {
    // Falls gewünscht, kann hier initialer Fokus gesetzt werden
  }

  focusNewCategoryInput() {
    if (isPlatformBrowser(this.platformId) && this.newCategoryInput) {
      this.newCategoryInput.nativeElement.focus();
    }
  }

  loadCategories() {
    this.loading = true;
    this.loadingStateService.setLoading('category-management', true);
    this.error = null;
    
    this.apollo.watchQuery({
      query: GetOsCategoriesDocument,
      fetchPolicy: 'cache-and-network'
    }).valueChanges.subscribe({
      next: ({ data }) => {
        const categoriesCopy = [...(data as any).osCategories];
        this.categories = categoriesCopy
          .sort((a: OsCategoryFragment, b: OsCategoryFragment) => a.position - b.position)
          .map((c: OsCategoryFragment) => ({
            ...c,
            isEditing: false,
            editedName: c.name,
            editedDescription: c.description,
            editedIcon: c.icon
          }));
        this.loading = false;
        this.loadingStateService.setLoading('category-management', false);
      },
      error: (err) => {
        this.handleError('Failed to load categories', err);
        this.loading = false;
        this.loadingStateService.setLoading('category-management', false);
      }
    });
  }

  createCategory() {
    if (!this.newCategory.name.trim()) return;
    this.graphql.createOsCategory(this.newCategory).subscribe({
      next: () => {
        this.newCategory = { name: '', description: '', icon: '' };
        this.loadCategories();
      },
      error: (err) => this.handleError('Creation failed', err)
    });
  }

  startEditing(category: any) {
    if (!category.isEditing) {
      category.isEditing = true;
      category.editedName = category.name;
      category.editedDescription = category.description;
      category.editedIcon = category.icon;
    }
  }

  cancelEditing(category: any) {
    category.isEditing = false;
    category.editedName = category.name;
    category.editedDescription = category.description;
    category.editedIcon = category.icon;
  }

  saveCategory(category: any) {
    const updateInput = {
      id: category.id,
      name: category.editedName,
      description: category.editedDescription,
      icon: category.editedIcon,
      position: category.position
    };

    this.graphql.updateOsCategoryPartial(updateInput).subscribe({
      next: () => {
        category.name = updateInput.name;
        category.description = updateInput.description;
        category.icon = updateInput.icon;
        category.isEditing = false;
      },
      error: (err) => {
        this.handleError('Update failed', err);
        category.isEditing = false;
      }
    });
  }

  deleteCategory(id: string) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.graphql.deleteOsCategory(id).subscribe({
        next: () => {
          this.categories = this.categories.filter(c => c.id !== id);
        },
        error: (err) => this.handleError('Deletion failed', err)
      });
    }
  }

  onDrop(event: CdkDragDrop<any>) {
    if (event.previousIndex === event.currentIndex) {
      return;
    }

    // Originalzustand für Rollback sichern
    const originalCategories = [...this.categories];

    // Update UI sofort
    moveItemInArray(this.categories, event.previousIndex, event.currentIndex);

    // Die verschobene Kategorie
    const movedCategory = this.categories[event.currentIndex];
    
    // Update nur die verschobene Kategorie mit der neuen Position
    this.graphql.updateOsCategoryPartial({
      id: movedCategory.id,
      position: event.currentIndex
    }).pipe(
      catchError((err) => {
        this.handleError('Position update failed', err);
        // Rollback bei Fehler
        this.categories = originalCategories;
        return of(null);
      })
    ).subscribe((result) => {
      if (result) {
        // Erfolgreich - lade neu um korrekte Positionen zu bekommen
        this.loadCategories();
      }
    });
  }

  private handleError(context: string, error: any) {
    this.error = `${context}: ${error.message}`;
    console.error(context, error);
    setTimeout(() => this.error = null, 5000);
  }

  trackByCategoryId(index: number, category: OsCategoryFragment) {
    return category.id;
  }
}
