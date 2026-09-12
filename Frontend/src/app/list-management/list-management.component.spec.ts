import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { of } from 'rxjs';

import { ListManagementComponent } from './list-management.component';
import { GraphqlService } from '../services/graphql.service';
import { createSpyObj, SpyObj } from '../../testing/create-spy-obj';

describe('ListManagementComponent', () => {
  let component: ListManagementComponent;
  let fixture: ComponentFixture<ListManagementComponent>;
  let mockGraphqlService: SpyObj<GraphqlService>;

  beforeEach(async () => {
    const graphqlServiceSpy = createSpyObj<GraphqlService>('GraphqlService', [
      'getAllLists', 
      'deleteList',
      'getImagesListsWithCategories'
    ]);

    // Configure return values for mocked methods
    const queryRef = {
      valueChanges: of({ data: { imagesLists: [] } })
    };
    graphqlServiceSpy.getImagesListsWithCategories.mockReturnValue(queryRef as any);

    await TestBed.configureTestingModule({
      imports: [ListManagementComponent, NoopAnimationsModule, ApolloTestingModule],
      providers: [
        { provide: GraphqlService, useValue: graphqlServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListManagementComponent);
    component = fixture.componentInstance;
    mockGraphqlService = TestBed.inject(GraphqlService) as unknown as SpyObj<GraphqlService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
