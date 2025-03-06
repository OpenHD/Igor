import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Long: { input: number; output: number; }
};

export type Image = {
  __typename?: 'Image';
  backupUrls?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  category?: Maybe<OsCategory>;
  description: Scalars['String']['output'];
  extractSha256?: Maybe<Scalars['String']['output']>;
  extractSize: Scalars['Long']['output'];
  icon: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  imageDownloadSize: Scalars['Long']['output'];
  imagesLists?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  isAvailable?: Maybe<Scalars['Boolean']['output']>;
  isEnabled: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  redirectsCount?: Maybe<Scalars['Long']['output']>;
  releaseDate: Scalars['String']['output'];
  url: Scalars['String']['output'];
  urls: Array<ImageUrl>;
};

export type ImageInput = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  description: Scalars['String']['input'];
  extractSha256?: InputMaybe<Scalars['String']['input']>;
  extractSize: Scalars['Long']['input'];
  icon: Scalars['String']['input'];
  imageDownloadSize: Scalars['Long']['input'];
  isEnabled: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  url: Scalars['String']['input'];
  urls: Array<ImageUrlInput>;
};

export type ImagePartialInput = {
  backupUrls?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  extractSha256?: InputMaybe<Scalars['String']['input']>;
  extractSize?: InputMaybe<Scalars['Long']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  imageDownloadSize?: InputMaybe<Scalars['Long']['input']>;
  isAvailable?: InputMaybe<Scalars['Boolean']['input']>;
  isEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  redirectsCount?: InputMaybe<Scalars['Long']['input']>;
  releaseDate?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  urls?: InputMaybe<Array<ImageUrlInput>>;
};

export type ImageUrl = {
  __typename?: 'ImageUrl';
  isAvailable: Scalars['Boolean']['output'];
  isDefault: Scalars['Boolean']['output'];
  url: Scalars['String']['output'];
};

export type ImageUrlInput = {
  isDefault: Scalars['Boolean']['input'];
  url: Scalars['String']['input'];
};

export type ImagesList = {
  __typename?: 'ImagesList';
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  endpoint: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  images: Array<Image>;
  latestVersion: Scalars['String']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type ImagesListInput = {
  description: Scalars['String']['input'];
  endpoint: Scalars['String']['input'];
  imageIds: Array<Scalars['ID']['input']>;
  latestVersion: Scalars['String']['input'];
  name: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

export type ImagesListPartialInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  endpoint?: InputMaybe<Scalars['String']['input']>;
  latestVersion?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createImage: Image;
  createImagesList: ImagesList;
  createOsCategory: OsCategory;
  deleteImage?: Maybe<Scalars['Boolean']['output']>;
  deleteImagesList?: Maybe<Scalars['Boolean']['output']>;
  deleteOsCategory?: Maybe<Scalars['Boolean']['output']>;
  updateImage: Image;
  updateImagePartial: Image;
  updateImagesList: ImagesList;
  updateImagesListPartial: ImagesList;
  updateOsCategory: OsCategory;
  updateOsCategoryPartial: OsCategory;
};


export type MutationCreateImageArgs = {
  input: ImageInput;
};


export type MutationCreateImagesListArgs = {
  input: ImagesListInput;
};


export type MutationCreateOsCategoryArgs = {
  input: OsCategoryInput;
};


export type MutationDeleteImageArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteImagesListArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteOsCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateImageArgs = {
  id: Scalars['ID']['input'];
  input: ImageInput;
};


export type MutationUpdateImagePartialArgs = {
  id: Scalars['ID']['input'];
  input: ImagePartialInput;
};


export type MutationUpdateImagesListArgs = {
  id: Scalars['ID']['input'];
  input: ImagesListInput;
};


export type MutationUpdateImagesListPartialArgs = {
  id: Scalars['ID']['input'];
  input: ImagesListPartialInput;
};


export type MutationUpdateOsCategoryArgs = {
  id: Scalars['ID']['input'];
  input: OsCategoryInput;
};


export type MutationUpdateOsCategoryPartialArgs = {
  input: OsCategoryInputUpdate;
};

export type OsCategory = {
  __typename?: 'OsCategory';
  description: Scalars['String']['output'];
  icon: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type OsCategoryInput = {
  description: Scalars['String']['input'];
  icon: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type OsCategoryInputUpdate = {
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  image?: Maybe<Image>;
  images: Array<Image>;
  imagesList?: Maybe<ImagesList>;
  imagesListByEndpoint?: Maybe<ImagesList>;
  imagesLists: Array<ImagesList>;
  osCategories: Array<OsCategory>;
};


export type QueryImageArgs = {
  id: Scalars['ID']['input'];
};


export type QueryImagesListArgs = {
  id: Scalars['ID']['input'];
};


export type QueryImagesListByEndpointArgs = {
  endpoint: Scalars['String']['input'];
};

export type GetAllImagesWithCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllImagesWithCategoriesQuery = { __typename?: 'Query', images: Array<{ __typename?: 'Image', id: string, name: string, description: string, icon: string, extractSize: number, extractSha256?: string | null, imageDownloadSize: number, isEnabled: boolean, releaseDate: string, url: string, redirectsCount?: number | null, urls: Array<{ __typename?: 'ImageUrl', url: string, isAvailable: boolean, isDefault: boolean }>, category?: { __typename?: 'OsCategory', id: string, name: string, description: string, icon: string } | null }>, osCategories: Array<{ __typename?: 'OsCategory', id: string, name: string, description: string, icon: string }> };

export type CreateImageMutationVariables = Exact<{
  input: ImageInput;
}>;


export type CreateImageMutation = { __typename?: 'Mutation', createImage: { __typename?: 'Image', id: string, name: string, description: string, icon: string, extractSize: number, extractSha256?: string | null, imageDownloadSize: number, isEnabled: boolean, releaseDate: string, url: string, redirectsCount?: number | null, urls: Array<{ __typename?: 'ImageUrl', url: string, isAvailable: boolean, isDefault: boolean }>, category?: { __typename?: 'OsCategory', id: string, name: string, description: string, icon: string } | null } };

export type UpdateImagePartialMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: ImagePartialInput;
}>;


export type UpdateImagePartialMutation = { __typename?: 'Mutation', updateImagePartial: { __typename?: 'Image', id: string, name: string, description: string, icon: string, extractSize: number, extractSha256?: string | null, imageDownloadSize: number, isEnabled: boolean, releaseDate: string, url: string, redirectsCount?: number | null, urls: Array<{ __typename?: 'ImageUrl', url: string, isAvailable: boolean, isDefault: boolean }>, category?: { __typename?: 'OsCategory', id: string, name: string, description: string, icon: string } | null } };

export type DeleteImageMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteImageMutation = { __typename?: 'Mutation', deleteImage?: boolean | null };

export type ImageFragmentFragment = { __typename?: 'Image', id: string, name: string, description: string, icon: string, extractSize: number, extractSha256?: string | null, imageDownloadSize: number, isEnabled: boolean, releaseDate: string, url: string, redirectsCount?: number | null, urls: Array<{ __typename?: 'ImageUrl', url: string, isAvailable: boolean, isDefault: boolean }>, category?: { __typename?: 'OsCategory', id: string, name: string, description: string, icon: string } | null };

export type OsCategoryFragmentFragment = { __typename?: 'OsCategory', id: string, name: string, description: string, icon: string };

export const OsCategoryFragmentFragmentDoc = gql`
    fragment OsCategoryFragment on OsCategory {
  id
  name
  description
  icon
}
    `;
export const ImageFragmentFragmentDoc = gql`
    fragment ImageFragment on Image {
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
    ...OsCategoryFragment
  }
  releaseDate
  url
  redirectsCount
}
    ${OsCategoryFragmentFragmentDoc}`;
export const GetAllImagesWithCategoriesDocument = gql`
    query GetAllImagesWithCategories {
  images {
    ...ImageFragment
  }
  osCategories {
    ...OsCategoryFragment
  }
}
    ${ImageFragmentFragmentDoc}
${OsCategoryFragmentFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetAllImagesWithCategoriesGQL extends Apollo.Query<GetAllImagesWithCategoriesQuery, GetAllImagesWithCategoriesQueryVariables> {
    document = GetAllImagesWithCategoriesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateImageDocument = gql`
    mutation CreateImage($input: ImageInput!) {
  createImage(input: $input) {
    ...ImageFragment
  }
}
    ${ImageFragmentFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateImageGQL extends Apollo.Mutation<CreateImageMutation, CreateImageMutationVariables> {
    document = CreateImageDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateImagePartialDocument = gql`
    mutation UpdateImagePartial($id: ID!, $input: ImagePartialInput!) {
  updateImagePartial(id: $id, input: $input) {
    ...ImageFragment
  }
}
    ${ImageFragmentFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateImagePartialGQL extends Apollo.Mutation<UpdateImagePartialMutation, UpdateImagePartialMutationVariables> {
    document = UpdateImagePartialDocument;
    
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