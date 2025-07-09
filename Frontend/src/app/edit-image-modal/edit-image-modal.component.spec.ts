import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApolloTestingModule } from 'apollo-angular/testing';

import { EditImageModalComponent } from './edit-image-modal.component';
import { GraphqlService } from '../services/graphql.service';

describe('EditImageModalComponent', () => {
  let component: EditImageModalComponent;
  let fixture: ComponentFixture<EditImageModalComponent>;
  let mockGraphqlService: jasmine.SpyObj<GraphqlService>;
  let mockActiveModal: jasmine.SpyObj<NgbActiveModal>;

  beforeEach(async () => {
    const graphqlServiceSpy = jasmine.createSpyObj('GraphqlService', ['updateImage']);
    const activeModalSpy = jasmine.createSpyObj('NgbActiveModal', ['close', 'dismiss']);

    await TestBed.configureTestingModule({
      imports: [EditImageModalComponent, NoopAnimationsModule, ApolloTestingModule],
      providers: [
        { provide: GraphqlService, useValue: graphqlServiceSpy },
        { provide: NgbActiveModal, useValue: activeModalSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditImageModalComponent);
    component = fixture.componentInstance;
    mockGraphqlService = TestBed.inject(GraphqlService) as jasmine.SpyObj<GraphqlService>;
    mockActiveModal = TestBed.inject(NgbActiveModal) as jasmine.SpyObj<NgbActiveModal>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
