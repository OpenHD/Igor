import { Component, ElementRef, ViewChild, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { GraphqlService } from '../services/graphql.service';
import {
  OsCategoryFragmentFragment,
  GetOsCategoriesDocument,
  UpdateOsCategoryPartialDocument
} from '../graphql/generated';
import { catchError, of } from 'rxjs';

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

  @ViewChild('newCategoryInput') newCategoryInput!: ElementRef;

  categories: (OsCategoryFragmentFragment & {
    isEditing?: boolean;
    editedName?: string;
    editedDescription?: string;
    editedIcon?: string;
  })[] = [];
  newCategory = { name: '', description: '', icon: '' };
  loading = true;
  error: string | null = null;

  ngOnInit() {
    this.loadCategories();
  }

  ngAfterViewInit(): void {
    // Falls gewünscht, kann hier initialer Fokus gesetzt werden
  }

  focusNewCategoryInput() {
    if (this.newCategoryInput) {
      this.newCategoryInput.nativeElement.focus();
    }
  }

  loadCategories() {
    this.loading = true;
    this.error = null;
    this.apollo.watchQuery({
      query: GetOsCategoriesDocument,
      fetchPolicy: 'cache-and-network'
    }).valueChanges.subscribe({
      next: ({ data }) => {
        const categoriesCopy = [...(data as any).osCategories];
        this.categories = categoriesCopy
          .sort((a: OsCategoryFragmentFragment, b: OsCategoryFragmentFragment) => a.position - b.position)
          .map((c: OsCategoryFragmentFragment) => ({
            ...c,
            isEditing: false,
            editedName: c.name,
            editedDescription: c.description,
            editedIcon: c.icon
          }));
        this.loading = false;
      },
      error: (err) => {
        this.handleError('Failed to load categories', err);
        this.loading = false;
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
    const previousIndex = event.previousIndex;
    const newIndex = event.currentIndex;

    // Originalzustand sichern
    const originalCategories = [...this.categories];

    // Array-Referenz brechen und neu zuweisen
    const reorderedCategories = [...this.categories];
    moveItemInArray(reorderedCategories, previousIndex, newIndex);

    // Positionen aller Kategorien neu berechnen
    this.categories = reorderedCategories.map((category, index) => ({
      ...category,
      position: index // Backend-kompatible 0-basierte Position
    }));

    // Update für die verschobene Kategorie
    const movedCategory = this.categories[newIndex];

    this.graphql.updateOsCategoryPartial({
      id: movedCategory.id,
      position: newIndex
    }).pipe(
      catchError((err) => {
        // Rollback mit Originalpositionen
        this.categories = originalCategories.map((c, i) => ({ ...c, position: i }));
        this.handleError('Neuanordnung fehlgeschlagen', err);
        return of(null);
      })
    ).subscribe();
  }

  private handleError(context: string, error: any) {
    this.error = `${context}: ${error.message}`;
    console.error(context, error);
    setTimeout(() => this.error = null, 5000);
  }

  trackByCategoryId(index: number, category: OsCategoryFragmentFragment) {
    return category.id;
  }
}
