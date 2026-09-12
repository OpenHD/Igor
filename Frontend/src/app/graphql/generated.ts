/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type ImageInput = {
  categoryId?: string | number | null | undefined;
  description: string;
  extractSha256?: string | null | undefined;
  extractSize: number;
  icon: string;
  imageDownloadSize: number;
  imagesLists?: Array<number | null | undefined> | null | undefined;
  isEnabled: boolean;
  name: string;
  urls: Array<ImageUrlInput>;
};

export type ImagePartialInput = {
  backupUrls?: Array<string | null | undefined> | null | undefined;
  categoryId?: string | number | null | undefined;
  description?: string | null | undefined;
  extractSha256?: string | null | undefined;
  extractSize?: number | null | undefined;
  icon?: string | null | undefined;
  imageDownloadSize?: number | null | undefined;
  imagesLists?: Array<number | null | undefined> | null | undefined;
  isEnabled?: boolean | null | undefined;
  name?: string | null | undefined;
  redirectsCount?: number | null | undefined;
  releaseDate?: string | null | undefined;
  urls?: Array<ImageUrlInput> | null | undefined;
};

export type ImageUrlInput = {
  isDefault: boolean;
  url: string;
};

export type ImagesListInput = {
  description: string;
  endpoint: string;
  imageIds?: Array<string | number | null | undefined> | null | undefined;
  latestVersion: string;
  name: string;
  url: string;
};

export type ImagesListPartialInput = {
  description?: string | null | undefined;
  endpoint?: string | null | undefined;
  latestVersion?: string | null | undefined;
  name?: string | null | undefined;
  url?: string | null | undefined;
};

export type OsCategoryInput = {
  description: string;
  icon: string;
  name: string;
};

export type OsCategoryInputUpdate = {
  description?: string | null | undefined;
  icon?: string | null | undefined;
  id: string | number;
  name?: string | null | undefined;
  position?: number | null | undefined;
};

export type Role =
  | 'ADMIN'
  | 'OWNER'
  | 'USER';

export type UserInput = {
  password: string;
  roles: Array<Role>;
  username: string;
};

export type UserUpdateInput = {
  roles?: Array<Role> | null | undefined;
  username?: string | null | undefined;
};

export type ImageFragment = { id: string, name: string, description: string, icon: string, extractSize: number, extractSha256: string | null, imageDownloadSize: number, isEnabled: boolean, releaseDate: string, redirectsCount: number | null, imagesLists: Array<string | null> | null, urls: Array<{ url: string, isAvailable: boolean, isDefault: boolean }>, category: { id: string, name: string, description: string, icon: string, position: number } | null };

export type OsCategoryFragment = { id: string, name: string, description: string, icon: string, position: number };

export type ImageListFragment = { id: string, name: string, endpoint: string, description: string, url: string, latestVersion: string, images: Array<{ id: string, name: string, description: string, icon: string, extractSize: number, extractSha256: string | null, imageDownloadSize: number, isEnabled: boolean, releaseDate: string, redirectsCount: number | null, imagesLists: Array<string | null> | null, urls: Array<{ url: string, isAvailable: boolean, isDefault: boolean }>, category: { id: string, name: string, description: string, icon: string, position: number } | null }> };

export type UserFragment = { id: string, username: string, roles: Array<Role> };

export type GetAllImagesWithCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllImagesWithCategoriesQuery = { images: Array<{ id: string, name: string, description: string, icon: string, extractSize: number, extractSha256: string | null, imageDownloadSize: number, isEnabled: boolean, releaseDate: string, redirectsCount: number | null, imagesLists: Array<string | null> | null, urls: Array<{ url: string, isAvailable: boolean, isDefault: boolean }>, category: { id: string, name: string, description: string, icon: string, position: number } | null }>, osCategories: Array<{ id: string, name: string, description: string, icon: string, position: number }> };

export type GetOsCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOsCategoriesQuery = { osCategories: Array<{ id: string, name: string, description: string, icon: string, position: number }> };

export type GetAllImagesListsWithCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllImagesListsWithCategoriesQuery = { imagesLists: Array<{ id: string, name: string, endpoint: string, description: string, url: string, latestVersion: string, images: Array<{ id: string, name: string, description: string, icon: string, extractSize: number, extractSha256: string | null, imageDownloadSize: number, isEnabled: boolean, releaseDate: string, redirectsCount: number | null, imagesLists: Array<string | null> | null, urls: Array<{ url: string, isAvailable: boolean, isDefault: boolean }>, category: { id: string, name: string, description: string, icon: string, position: number } | null }> }>, osCategories: Array<{ id: string, name: string, description: string, icon: string, position: number }> };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { users: Array<{ id: string, username: string, roles: Array<Role> }> };

export type GetUserQueryVariables = Exact<{
  id: string | number;
}>;


export type GetUserQuery = { user: { id: string, username: string, roles: Array<Role> } | null };

export type CreateImageMutationVariables = Exact<{
  input: ImageInput;
}>;


export type CreateImageMutation = { createImage: { id: string, name: string, description: string, icon: string, extractSize: number, extractSha256: string | null, imageDownloadSize: number, isEnabled: boolean, releaseDate: string, redirectsCount: number | null, imagesLists: Array<string | null> | null, urls: Array<{ url: string, isAvailable: boolean, isDefault: boolean }>, category: { id: string, name: string, description: string, icon: string, position: number } | null } };

export type DeleteImageMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteImageMutation = { deleteImage: boolean | null };

export type UpdateImagePartialMutationVariables = Exact<{
  id: string | number;
  input: ImagePartialInput;
}>;


export type UpdateImagePartialMutation = { updateImagePartial: { id: string, name: string, description: string, icon: string, extractSize: number, extractSha256: string | null, imageDownloadSize: number, isEnabled: boolean, releaseDate: string, redirectsCount: number | null, imagesLists: Array<string | null> | null, urls: Array<{ url: string, isAvailable: boolean, isDefault: boolean }>, category: { id: string, name: string, description: string, icon: string, position: number } | null } };

export type CreateOsCategoryMutationVariables = Exact<{
  input: OsCategoryInput;
}>;


export type CreateOsCategoryMutation = { createOsCategory: { id: string, name: string, description: string, icon: string, position: number } };

export type UpdateOsCategoryPartialMutationVariables = Exact<{
  input: OsCategoryInputUpdate;
}>;


export type UpdateOsCategoryPartialMutation = { updateOsCategoryPartial: { id: string, name: string, description: string, icon: string, position: number } };

export type DeleteOsCategoryMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteOsCategoryMutation = { deleteOsCategory: boolean | null };

export type CreateImagesListMutationVariables = Exact<{
  input: ImagesListInput;
}>;


export type CreateImagesListMutation = { createImagesList: { id: string, name: string, endpoint: string, description: string, url: string, latestVersion: string, images: Array<{ id: string, name: string, description: string, icon: string, extractSize: number, extractSha256: string | null, imageDownloadSize: number, isEnabled: boolean, releaseDate: string, redirectsCount: number | null, imagesLists: Array<string | null> | null, urls: Array<{ url: string, isAvailable: boolean, isDefault: boolean }>, category: { id: string, name: string, description: string, icon: string, position: number } | null }> } };

export type UpdateImagesListPartialMutationVariables = Exact<{
  id: string | number;
  input: ImagesListPartialInput;
}>;


export type UpdateImagesListPartialMutation = { updateImagesListPartial: { id: string, name: string, endpoint: string, description: string, url: string, latestVersion: string, images: Array<{ id: string, name: string, description: string, icon: string, extractSize: number, extractSha256: string | null, imageDownloadSize: number, isEnabled: boolean, releaseDate: string, redirectsCount: number | null, imagesLists: Array<string | null> | null, urls: Array<{ url: string, isAvailable: boolean, isDefault: boolean }>, category: { id: string, name: string, description: string, icon: string, position: number } | null }> } };

export type DeleteImagesListMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteImagesListMutation = { deleteImagesList: boolean | null };

export type CreateUserMutationVariables = Exact<{
  input: UserInput;
}>;


export type CreateUserMutation = { createUser: { id: string, username: string, roles: Array<Role> } };

export type UpdateUserMutationVariables = Exact<{
  id: string | number;
  input: UserUpdateInput;
}>;


export type UpdateUserMutation = { updateUser: { id: string, username: string, roles: Array<Role> } };

export type UpdateUserPasswordMutationVariables = Exact<{
  id: string | number;
  newPassword: string;
}>;


export type UpdateUserPasswordMutation = { updateUserPassword: { id: string, username: string, roles: Array<Role> } };

export type DeleteUserMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteUserMutation = { deleteUser: boolean | null };

export const OsCategoryFragmentDoc = gql`
    fragment OsCategory on OsCategory {
  id
  name
  description
  icon
  position
}
    `;
export const ImageFragmentDoc = gql`
    fragment Image on Image {
  id
  name
  description
  icon
  urls {
    url
    isAvailable
    isDefault
  }
  extractSize
  extractSha256
  imageDownloadSize
  isEnabled
  category {
    ...OsCategory
  }
  releaseDate
  redirectsCount
  imagesLists
}
    ${OsCategoryFragmentDoc}`;
export const ImageListFragmentDoc = gql`
    fragment ImageList on ImagesList {
  id
  name
  endpoint
  description
  url
  latestVersion
  images {
    ...Image
  }
}
    ${ImageFragmentDoc}`;
export const UserFragmentDoc = gql`
    fragment User on User {
  id
  username
  roles
}
    `;
export const GetAllImagesWithCategoriesDocument = gql`
    query GetAllImagesWithCategories {
  images {
    ...Image
  }
  osCategories {
    ...OsCategory
  }
}
    ${ImageFragmentDoc}
${OsCategoryFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetAllImagesWithCategoriesGQL extends Apollo.Query<GetAllImagesWithCategoriesQuery, GetAllImagesWithCategoriesQueryVariables> {
    document = GetAllImagesWithCategoriesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetOsCategoriesDocument = gql`
    query GetOsCategories {
  osCategories {
    ...OsCategory
  }
}
    ${OsCategoryFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetOsCategoriesGQL extends Apollo.Query<GetOsCategoriesQuery, GetOsCategoriesQueryVariables> {
    document = GetOsCategoriesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetAllImagesListsWithCategoriesDocument = gql`
    query GetAllImagesListsWithCategories {
  imagesLists {
    id
    name
    endpoint
    description
    url
    latestVersion
    images {
      ...Image
    }
  }
  osCategories {
    ...OsCategory
  }
}
    ${ImageFragmentDoc}
${OsCategoryFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetAllImagesListsWithCategoriesGQL extends Apollo.Query<GetAllImagesListsWithCategoriesQuery, GetAllImagesListsWithCategoriesQueryVariables> {
    document = GetAllImagesListsWithCategoriesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetUsersDocument = gql`
    query GetUsers {
  users {
    ...User
  }
}
    ${UserFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetUsersGQL extends Apollo.Query<GetUsersQuery, GetUsersQueryVariables> {
    document = GetUsersDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetUserDocument = gql`
    query GetUser($id: ID!) {
  user(id: $id) {
    ...User
  }
}
    ${UserFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetUserGQL extends Apollo.Query<GetUserQuery, GetUserQueryVariables> {
    document = GetUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateImageDocument = gql`
    mutation CreateImage($input: ImageInput!) {
  createImage(input: $input) {
    ...Image
  }
}
    ${ImageFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateImageGQL extends Apollo.Mutation<CreateImageMutation, CreateImageMutationVariables> {
    document = CreateImageDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteImageDocument = gql`
    mutation DeleteImage($id: ID!) {
  deleteImage(id: $id)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteImageGQL extends Apollo.Mutation<DeleteImageMutation, DeleteImageMutationVariables> {
    document = DeleteImageDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateImagePartialDocument = gql`
    mutation UpdateImagePartial($id: ID!, $input: ImagePartialInput!) {
  updateImagePartial(id: $id, input: $input) {
    ...Image
  }
}
    ${ImageFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateImagePartialGQL extends Apollo.Mutation<UpdateImagePartialMutation, UpdateImagePartialMutationVariables> {
    document = UpdateImagePartialDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateOsCategoryDocument = gql`
    mutation CreateOsCategory($input: OsCategoryInput!) {
  createOsCategory(input: $input) {
    ...OsCategory
  }
}
    ${OsCategoryFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateOsCategoryGQL extends Apollo.Mutation<CreateOsCategoryMutation, CreateOsCategoryMutationVariables> {
    document = CreateOsCategoryDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateOsCategoryPartialDocument = gql`
    mutation UpdateOsCategoryPartial($input: OsCategoryInputUpdate!) {
  updateOsCategoryPartial(input: $input) {
    ...OsCategory
  }
}
    ${OsCategoryFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateOsCategoryPartialGQL extends Apollo.Mutation<UpdateOsCategoryPartialMutation, UpdateOsCategoryPartialMutationVariables> {
    document = UpdateOsCategoryPartialDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteOsCategoryDocument = gql`
    mutation DeleteOsCategory($id: ID!) {
  deleteOsCategory(id: $id)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteOsCategoryGQL extends Apollo.Mutation<DeleteOsCategoryMutation, DeleteOsCategoryMutationVariables> {
    document = DeleteOsCategoryDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateImagesListDocument = gql`
    mutation CreateImagesList($input: ImagesListInput!) {
  createImagesList(input: $input) {
    ...ImageList
  }
}
    ${ImageListFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateImagesListGQL extends Apollo.Mutation<CreateImagesListMutation, CreateImagesListMutationVariables> {
    document = CreateImagesListDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateImagesListPartialDocument = gql`
    mutation UpdateImagesListPartial($id: ID!, $input: ImagesListPartialInput!) {
  updateImagesListPartial(id: $id, input: $input) {
    ...ImageList
  }
}
    ${ImageListFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateImagesListPartialGQL extends Apollo.Mutation<UpdateImagesListPartialMutation, UpdateImagesListPartialMutationVariables> {
    document = UpdateImagesListPartialDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteImagesListDocument = gql`
    mutation DeleteImagesList($id: ID!) {
  deleteImagesList(id: $id)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteImagesListGQL extends Apollo.Mutation<DeleteImagesListMutation, DeleteImagesListMutationVariables> {
    document = DeleteImagesListDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateUserDocument = gql`
    mutation CreateUser($input: UserInput!) {
  createUser(input: $input) {
    ...User
  }
}
    ${UserFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateUserGQL extends Apollo.Mutation<CreateUserMutation, CreateUserMutationVariables> {
    document = CreateUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateUserDocument = gql`
    mutation UpdateUser($id: ID!, $input: UserUpdateInput!) {
  updateUser(id: $id, input: $input) {
    ...User
  }
}
    ${UserFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateUserGQL extends Apollo.Mutation<UpdateUserMutation, UpdateUserMutationVariables> {
    document = UpdateUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateUserPasswordDocument = gql`
    mutation UpdateUserPassword($id: ID!, $newPassword: String!) {
  updateUserPassword(id: $id, newPassword: $newPassword) {
    ...User
  }
}
    ${UserFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateUserPasswordGQL extends Apollo.Mutation<UpdateUserPasswordMutation, UpdateUserPasswordMutationVariables> {
    document = UpdateUserPasswordDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteUserDocument = gql`
    mutation DeleteUser($id: ID!) {
  deleteUser(id: $id)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteUserGQL extends Apollo.Mutation<DeleteUserMutation, DeleteUserMutationVariables> {
    document = DeleteUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }