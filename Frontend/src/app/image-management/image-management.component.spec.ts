import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { of } from 'rxjs';

import { ImageManagementComponent } from './image-management.component';
import { GraphqlService } from '../services/graphql.service';

describe('ImageManagementComponent', () => {
  let component: ImageManagementComponent;
  let fixture: ComponentFixture<ImageManagementComponent>;
  let mockGraphqlService: jasmine.SpyObj<GraphqlService>;

  beforeEach(async () => {
    const graphqlServiceSpy = jasmine.createSpyObj('GraphqlService', [
      'getAllImages', 
      'deleteImage',
      'getImagesListsWithCategories'
    ]);

    // Configure return values for mocked methods
    const queryRef = {
      valueChanges: of({ data: { imagesLists: [] } })
    };
    graphqlServiceSpy.getImagesListsWithCategories.and.returnValue(queryRef);

    await TestBed.configureTestingModule({
      imports: [ImageManagementComponent, NoopAnimationsModule, ApolloTestingModule],
      providers: [
        { provide: GraphqlService, useValue: graphqlServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageManagementComponent);
    component = fixture.componentInstance;
    mockGraphqlService = TestBed.inject(GraphqlService) as jasmine.SpyObj<GraphqlService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
