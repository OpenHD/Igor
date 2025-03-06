// src/app/services/graphql.service.ts
import { Injectable, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
  GetAllImagesWithCategoriesDocument,
  CreateImageDocument,
  UpdateImagePartialDocument,
  DeleteImageDocument, ImageInput, ImagePartialInput, GetAllImagesWithCategoriesQuery
} from '../graphql/generated';

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
        // Cache Update Logic
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
}
