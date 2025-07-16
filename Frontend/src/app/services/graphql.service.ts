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
import { Observable, catchError, throwError } from 'rxjs';
import { ErrorBannerService } from './error-banner.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class GraphqlService {
  private apollo = inject(Apollo);
  private errorBannerService = inject(ErrorBannerService);
  private authService = inject(AuthService);

  private handleError = (error: any) => {
    console.error('GraphQL Error:', error);
    
    if (error.networkError) {
      this.errorBannerService.setBackendConnectivity(false);
      
      if (error.networkError.status === 401) {
        console.warn('Authentication failed in GraphQL request, logging out user');
        this.authService.logout();
        return throwError(() => error);
      }
    }
    
    if (error.graphQLErrors) {
      for (const graphQLError of error.graphQLErrors) {
        if (graphQLError.extensions?.code === 'UNAUTHENTICATED' || 
            graphQLError.message?.toLowerCase().includes('unauthorized') ||
            graphQLError.message?.toLowerCase().includes('authentication') ||
            graphQLError.message?.toLowerCase().includes('invalid token') ||
            graphQLError.message?.toLowerCase().includes('jwt')) {
          console.warn('Authentication failed in GraphQL response, logging out user');
          this.authService.logout();
          return throwError(() => error);
        }
      }
    }
    
    return throwError(() => error);
  };

  getImagesWithCategories() {
    const query = this.apollo.watchQuery<GetAllImagesWithCategoriesQuery>({
      query: GetAllImagesWithCategoriesDocument,
      fetchPolicy: 'cache-and-network'
    });
    
    query.valueChanges.pipe(
      catchError(this.handleError)
    ).subscribe({
      next: () => this.errorBannerService.setBackendConnectivity(true),
      error: () => {} // Already handled in handleError
    });
    
    return query;
  }

  createImage(input: ImageInput) {
    return this.apollo.mutate({
      mutation: CreateImageDocument,
      variables: { input },
      update: (cache, { data }) => {
        // Cache-Update-Logik (ggf. implementieren)
      }
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateImagePartial(id: string, input: ImagePartialInput) {
    return this.apollo.mutate({
      mutation: UpdateImagePartialDocument,
      variables: { id, input }
    }).pipe(
      catchError(this.handleError)
    );
  }

  deleteImage(id: string) {
    return this.apollo.mutate({
      mutation: DeleteImageDocument,
      variables: { id }
    }).pipe(
      catchError(this.handleError)
    );
  }

  getOsCategories() {
    const query = this.apollo.watchQuery({
      query: GetOsCategoriesDocument,
      fetchPolicy: 'cache-and-network'
    });
    
    query.valueChanges.pipe(
      catchError(this.handleError)
    ).subscribe({
      next: () => this.errorBannerService.setBackendConnectivity(true),
      error: () => {}
    });
    
    return query;
  }

  createOsCategory(input: OsCategoryInput): Observable<any> {
    return this.apollo.mutate({
      mutation: CreateOsCategoryDocument,
      variables: { input },
      refetchQueries: [GetOsCategoriesDocument]
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateOsCategoryPartial(input: OsCategoryInputUpdate): Observable<any> {
    return this.apollo.mutate({
      mutation: UpdateOsCategoryPartialDocument,
      variables: { input },
      refetchQueries: [GetOsCategoriesDocument]
    }).pipe(
      catchError(this.handleError)
    );
  }

  deleteOsCategory(id: string): Observable<any> {
    return this.apollo.mutate({
      mutation: DeleteOsCategoryDocument,
      variables: { id },
      refetchQueries: [GetOsCategoriesDocument]
    }).pipe(
      catchError(this.handleError)
    );
  }

  getImagesListsWithCategories() {
    const query = this.apollo.watchQuery<GetAllImagesListsWithCategoriesQuery>({
      query: GetAllImagesListsWithCategoriesDocument,
      fetchPolicy: 'cache-and-network'
    });
    
    query.valueChanges.pipe(
      catchError(this.handleError)
    ).subscribe({
      next: () => this.errorBannerService.setBackendConnectivity(true),
      error: () => {}
    });
    
    return query;
  }

  createImagesList(input: ImagesListInput): Observable<any> {
    return this.apollo.mutate({
      mutation: CreateImagesListDocument,
      variables: { input },
      refetchQueries: [GetAllImagesListsWithCategoriesDocument]
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateImagesListPartial(id: string, input: ImagesListPartialInput): Observable<any> {
    return this.apollo.mutate({
      mutation: UpdateImagesListPartialDocument,
      variables: { id, input }
    }).pipe(
      catchError(this.handleError)
    );
  }

  deleteImagesList(id: string): Observable<any> {
    return this.apollo.mutate({
      mutation: DeleteImagesListDocument,
      variables: { id },
      refetchQueries: [GetAllImagesListsWithCategoriesDocument]
    }).pipe(
      catchError(this.handleError)
    );
  }
}
