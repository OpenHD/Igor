import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GraphqlService } from '../services/graphql.service';
import {
  ImagesList,
  ImagesListInput,
  ImagesListPartialInput,
  GetAllImagesListsWithCategoriesQuery
} from '../graphql/generated';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-list-management',
  templateUrl: './list-management.component.html',
  imports: [
    FormsModule,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./list-management.component.css']
})
export class ListManagementComponent implements OnInit {
  loading = false;
  error: string | null = null;
  imageLists: any[] = [];
  selectedList: any = null;
  selectedListId: string | null = null;
  isCreatingNewList: boolean = false;
  newList: Partial<ImagesList> = {
    name: '',
    endpoint: '',
    description: '',
    latestVersion: '',
    url: ''
  };

  @ViewChild('newListInput') newListInput!: ElementRef;

  constructor(private graphqlService: GraphqlService) { }

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
          // Setze die erste Liste als aktiv (falls vorhanden)
          if (this.imageLists.length > 0) {
            this.setActiveList(this.imageLists[0].id);
          }
        }
      },
      error: err => {
        this.loading = false;
        this.error = err.message || 'Fehler beim Laden der Listen';
      }
    });
  }

  setActiveList(id: string, event?: Event) {
    if (event) { event.stopPropagation(); }
    this.selectedListId = id;
    this.selectedList = this.imageLists.find(list => list.id === id);
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
        if (this.selectedListId === list.id) {
          this.selectedList = list;
        }
      },
      error: err => {
        this.error = err.message || 'Fehler beim Aktualisieren der Liste';
      }
    });
  }

  deleteList(id: string, event?: Event) {
    if (event) { event.stopPropagation(); }
    this.graphqlService.deleteImagesList(id).subscribe({
      next: () => {
        this.imageLists = this.imageLists.filter(list => list.id !== id);
        if (this.selectedListId === id) {
          this.selectedList = null;
          this.selectedListId = null;
          if (this.imageLists.length > 0) {
            this.setActiveList(this.imageLists[0].id);
          }
        }
      },
      error: err => {
        this.error = err.message || 'Fehler beim Löschen der Liste';
      }
    });
  }

  toggleNewListForm() {
    this.isCreatingNewList = !this.isCreatingNewList;
    if (this.isCreatingNewList) {
      setTimeout(() => {
        if (this.newListInput) {
          this.newListInput.nativeElement.focus();
        }
      }, 100);
    }
  }

  createList() {
    if (!this.newList.name?.trim()) { return; }
    const input: ImagesListInput = {
      name: this.newList.name,
      endpoint: this.newList.endpoint || '',
      description: this.newList.description || '',
      latestVersion: this.newList.latestVersion || '',
      url: this.newList.url || '',
      imageIds: [] // Anfangs leer
    };
    this.graphqlService.createImagesList(input).subscribe({
      next: (result: any) => {
        const newImageList = result.data.createImagesList;
        const listObj = {
          ...newImageList,
          isEditing: false,
          editedName: newImageList.name,
          editedEndpoint: newImageList.endpoint,
          editedDescription: newImageList.description,
          editedLatestVersion: newImageList.latestVersion,
          editedUrl: newImageList.url
        };
        this.imageLists.push(listObj);
        this.setActiveList(newImageList.id);
        this.isCreatingNewList = false;
        this.newList = { name: '', endpoint: '', description: '', latestVersion: '', url: '' };
      },
      error: err => {
        this.error = err.message || 'Fehler beim Erstellen der Liste';
      }
    });
  }

  trackById(index: number, item: any) {
    return item.id;
  }
}
