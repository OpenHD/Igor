import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GraphqlService } from '../services/graphql.service';
import {
  ImagesList,
  ImagesListInput,
  ImagesListPartialInput,
  GetAllImagesListsWithCategoriesQuery
} from '../graphql/generated';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-list-management',
  templateUrl: './list-management.component.html',
  imports: [
    NgIf,
    FormsModule,
    NgForOf
  ],
  styleUrls: ['./list-management.component.scss']
})
export class ListManagementComponent implements OnInit {
  loading: boolean = false;
  error: string | null = null;
  imageLists: any[] = []; // Array of ImagesList plus editing flags
  newList: Partial<ImagesList> = {
    name: '',
    endpoint: '',
    description: '',
    latestVersion: '',
    url: ''
  };

  // Optional: Referenz zum neuen Listeneingabefeld
  @ViewChild('newListInput') newListInput!: ElementRef;

  constructor(private graphqlService: GraphqlService) {}

  ngOnInit(): void {
    this.loadImageLists();
  }

  loadImageLists() {
    this.loading = true;
    this.graphqlService.getImagesListsWithCategories().valueChanges.subscribe({
      next: ({ data }: { data: GetAllImagesListsWithCategoriesQuery }) => {
        this.loading = false;
        if (data && data.imagesLists) {
          this.imageLists = data.imagesLists.map(list => ({
            ...list,
            isEditing: false,
            editedName: list.name,
            editedEndpoint: list.endpoint,
            editedDescription: list.description,
            editedLatestVersion: list.latestVersion,
            editedUrl: list.url
          }));
        }
      },
      error: err => {
        this.loading = false;
        this.error = err.message || 'Fehler beim Laden der Listen';
      }
    });
  }

  focusNewListInput() {
    if (this.newListInput) {
      this.newListInput.nativeElement.focus();
    }
  }

  createList() {
    if (!this.newList.name?.trim()) {
      return;
    }
    const input: ImagesListInput = {
      name: this.newList.name,
      endpoint: this.newList.endpoint || '',
      description: this.newList.description || '',
      latestVersion: this.newList.latestVersion || '',
      url: this.newList.url || '',
      imageIds: [] // initial leer; kann angepasst werden
    };

    this.graphqlService.createImagesList(input).subscribe({
      next: (result: any) => {
        const newImageList = result.data.createImagesList;
        this.imageLists.push({
          ...newImageList,
          isEditing: false,
          editedName: newImageList.name,
          editedEndpoint: newImageList.endpoint,
          editedDescription: newImageList.description,
          editedLatestVersion: newImageList.latestVersion,
          editedUrl: newImageList.url
        });
        // Formular zurücksetzen
        this.newList = { name: '', endpoint: '', description: '', latestVersion: '', url: '' };
      },
      error: err => {
        this.error = err.message || 'Fehler beim Erstellen der Liste';
      }
    });
  }

  startEditing(list: any) {
    list.isEditing = true;
    list.editedName = list.name;
    list.editedEndpoint = list.endpoint;
    list.editedDescription = list.description;
    list.editedLatestVersion = list.latestVersion;
    list.editedUrl = list.url;
  }

  cancelEditing(list: any) {
    list.isEditing = false;
  }

  saveList(list: any) {
    const input: ImagesListPartialInput = {
      name: list.editedName,
      endpoint: list.editedEndpoint,
      description: list.editedDescription,
      latestVersion: list.editedLatestVersion,
      url: list.editedUrl
    };

    this.graphqlService.updateImagesListPartial(list.id, input).subscribe({
      next: (result: any) => {
        list.name = list.editedName;
        list.endpoint = list.editedEndpoint;
        list.description = list.editedDescription;
        list.latestVersion = list.editedLatestVersion;
        list.url = list.editedUrl;
        list.isEditing = false;
      },
      error: err => {
        this.error = err.message || 'Fehler beim Aktualisieren der Liste';
      }
    });
  }

  deleteList(id: string) {
    this.graphqlService.deleteImagesList(id).subscribe({
      next: () => {
        this.imageLists = this.imageLists.filter(list => list.id !== id);
      },
      error: err => {
        this.error = err.message || 'Fehler beim Löschen der Liste';
      }
    });
  }

  trackById(index: number, item: any) {
    return item.id;
  }
}
