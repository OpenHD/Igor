import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ApolloTestingModule } from 'apollo-angular/testing';

import { OsCategoryManagementComponent } from './os-category-management.component';
import { GraphqlService } from '../services/graphql.service';

describe('OsCategoryManagementComponent', () => {
  let component: OsCategoryManagementComponent;
  let fixture: ComponentFixture<OsCategoryManagementComponent>;
  let mockGraphqlService: jasmine.SpyObj<GraphqlService>;

  beforeEach(async () => {
    const graphqlServiceSpy = jasmine.createSpyObj('GraphqlService', ['getAllOsCategories', 'deleteOsCategory']);

    await TestBed.configureTestingModule({
      imports: [OsCategoryManagementComponent, NoopAnimationsModule, ApolloTestingModule],
      providers: [
        { provide: GraphqlService, useValue: graphqlServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OsCategoryManagementComponent);
    component = fixture.componentInstance;
    mockGraphqlService = TestBed.inject(GraphqlService) as jasmine.SpyObj<GraphqlService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
