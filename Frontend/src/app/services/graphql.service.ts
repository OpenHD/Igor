import { Injectable, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
  GetAllImagesWithCategoriesDocument,
  CreateImageDocument,
  UpdateImagePartialDocument,
  DeleteImageDocument,
  ImageInput,
  ImagePartialInput,
  GetAllImagesWithCategoriesQuery,
  OsCategoryInputUpdate,
  GetOsCategoriesDocument,
  OsCategoryInput,
  CreateOsCategoryDocument,
  UpdateOsCategoryPartialDocument,
  DeleteOsCategoryDocument,
  GetAllImagesListsWithCategoriesQuery,
  GetAllImagesListsWithCategoriesDocument,
  ImagesListInput,
  CreateImagesListDocument,
  ImagesListPartialInput,
  UpdateImagesListPartialDocument,
  DeleteImagesListDocument
} from '../graphql/generated';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GraphqlService {
  private apollo = inject(Apollo);

  getImagesWithCategories() {
    return this.apollo.watchQuery<GetAllImagesWithCategoriesQuery>({
      query: GetAllImagesWithCategoriesDocument,
      fetchPolicy: 'cache-and-network'
    });
  }

  createImage(input: ImageInput) {
    return this.apollo.mutate({
      mutation: CreateImageDocument,
      variables: { input },
      update: (cache, { data }) => {
        // Cache-Update-Logik (ggf. implementieren)
      }
    });
  }

  updateImagePartial(id: string, input: ImagePartialInput) {
    return this.apollo.mutate({
      mutation: UpdateImagePartialDocument,
      variables: { id, input }
    });
  }

  deleteImage(id: string) {
    return this.apollo.mutate({
      mutation: DeleteImageDocument,
      variables: { id }
    });
  }

  getOsCategories() {
    return this.apollo.watchQuery({
      query: GetOsCategoriesDocument,
      fetchPolicy: 'cache-and-network'
    });
  }

  createOsCategory(input: OsCategoryInput): Observable<any> {
    return this.apollo.mutate({
      mutation: CreateOsCategoryDocument,
      variables: { input },
      refetchQueries: [GetOsCategoriesDocument]
    });
  }

  updateOsCategoryPartial(input: OsCategoryInputUpdate): Observable<any> {
    return this.apollo.mutate({
      mutation: UpdateOsCategoryPartialDocument,
      variables: { input },
      optimisticResponse: (vars) => ({
        __typename: 'Mutation',
        updateOsCategoryPartial: {
          ...vars.input,
          __typename: 'OsCategory'
        }
      })
    });
  }

  deleteOsCategory(id: string): Observable<any> {
    return this.apollo.mutate({
      mutation: DeleteOsCategoryDocument,
      variables: { id },
      refetchQueries: [GetOsCategoriesDocument]
    });
  }

  getImagesListsWithCategories() {
    return this.apollo.watchQuery<GetAllImagesListsWithCategoriesQuery>({
      query: GetAllImagesListsWithCategoriesDocument,
      fetchPolicy: 'cache-and-network'
    });
  }

  createImagesList(input: ImagesListInput): Observable<any> {
    return this.apollo.mutate({
      mutation: CreateImagesListDocument,
      variables: { input },
      refetchQueries: [GetAllImagesListsWithCategoriesDocument]
    });
  }

  updateImagesListPartial(id: string, input: ImagesListPartialInput): Observable<any> {
    return this.apollo.mutate({
      mutation: UpdateImagesListPartialDocument,
      variables: { id, input }
    });
  }

  deleteImagesList(id: string): Observable<any> {
    return this.apollo.mutate({
      mutation: DeleteImagesListDocument,
      variables: { id },
      refetchQueries: [GetAllImagesListsWithCategoriesDocument]
    });
  }
}
