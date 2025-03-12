import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { GraphqlService } from '../services/graphql.service';
import {
  ImagesList,
  ImagesListInput,
  ImagesListPartialInput,
  GetAllImagesListsWithCategoriesQuery
} from '../graphql/generated';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import {NgbModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';

declare var bootstrap: any;

@Component({
  selector: 'app-list-management',
  templateUrl: './list-management.component.html',
  styleUrls: ['./list-management.component.scss'],
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
    NgbModule
  ],
  standalone: true
})
export class ListManagementComponent implements OnInit {
  @ViewChild('deleteModal') deleteModalTemplate!: ElementRef;
  deleteModal: any;

  loading = false;
  error: string | null = null;
  imageLists: any[] = [];
  selectedList: any = null;
  selectedListId: string | null = null;
  isCreatingNewList = false;
  newList: Partial<ImagesList> = {
    name: '',
    endpoint: '',
    description: '',
    latestVersion: '',
    url: ''
  };

  @ViewChild('newListInput') newListInput!: ElementRef;

  constructor(
    private graphqlService: GraphqlService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.loadImageLists();
  }


  loadImageLists() {
    this.loading = true;
    this.graphqlService.getImagesListsWithCategories().valueChanges.subscribe({
      next: ({ data }: { data: GetAllImagesListsWithCategoriesQuery }) => {
        this.loading = false;
        if (data?.imagesLists) {
          this.imageLists = data.imagesLists.map(list => ({
            ...list,
            isEditing: false,
            editedName: list.name,
            editedEndpoint: list.endpoint,
            editedDescription: list.description,
            editedLatestVersion: list.latestVersion,
            editedUrl: list.url
          }));

          if (this.imageLists.length > 0) {
            this.setActiveList(this.imageLists[0].id);
          }
        }
      },
      error: err => {
        this.loading = false;
        this.error = err.message || 'Error loading image lists';
      }
    });
  }

  setActiveList(id: string, event?: Event) {
    event?.stopPropagation();
    this.selectedListId = id;
    this.selectedList = this.imageLists.find(list => list.id === id);
  }

  startEditing(list: any) {
    list.isEditing = true;
    Object.assign(list, {
      editedName: list.name,
      editedEndpoint: list.endpoint,
      editedDescription: list.description,
      editedLatestVersion: list.latestVersion,
      editedUrl: list.url
    });
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
      next: () => {
        Object.assign(list, {
          name: input.name,
          endpoint: input.endpoint,
          description: input.description,
          latestVersion: input.latestVersion,
          url: input.url,
          isEditing: false
        });

        if (this.selectedListId === list.id) {
          this.selectedList = list;
        }
      },
      error: err => {
        this.error = err.message || 'Error updating list';
      }
    });
  }

  confirmDelete(list: any) {
    this.selectedList = list;
    this.modalService.open(this.deleteModalTemplate, {
      ariaLabelledBy: 'deleteConfirmationModalLabel',
      centered: true
    });
  }

  deleteList(id?: string) {
    if (!id) return;

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
        this.deleteModal.hide();
        this.modalService.dismissAll();
      },
      error: err => {
        this.error = err.message || 'Error deleting list';
        this.modalService.dismissAll();
      }
    });
  }

  toggleNewListForm() {
    this.isCreatingNewList = !this.isCreatingNewList;
    if (this.isCreatingNewList) {
      setTimeout(() => {
        this.newListInput.nativeElement.focus();
      }, 100);
    }
  }

  createList() {
    if (!this.newList.name?.trim()) return;

    const input: ImagesListInput = {
      name: this.newList.name,
      endpoint: this.newList.endpoint || '',
      description: this.newList.description || '',
      latestVersion: this.newList.latestVersion || '',
      url: this.newList.url || '',
      imageIds: []
    };

    this.graphqlService.createImagesList(input).subscribe({
      next: (result: any) => {
        const newList = result.data.createImagesList;
        this.imageLists.push({
          ...newList,
          isEditing: false,
          editedName: newList.name,
          editedEndpoint: newList.endpoint,
          editedDescription: newList.description,
          editedLatestVersion: newList.latestVersion,
          editedUrl: newList.url
        });

        this.setActiveList(newList.id);
        this.isCreatingNewList = false;
        this.newList = { name: '', endpoint: '', description: '', latestVersion: '', url: '' };
      },
      error: err => {
        this.error = err.message || 'Error creating list';
      }
    });
  }

  trackById(index: number, item: any) {
    return item.id;
  }
}
