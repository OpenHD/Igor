import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApolloTestingModule } from 'apollo-angular/testing';

import { EditImageModalComponent } from './edit-image-modal.component';
import { GraphqlService } from '../services/graphql.service';
import { createSpyObj, SpyObj } from '../../testing/create-spy-obj';

describe('EditImageModalComponent', () => {
  let component: EditImageModalComponent;
  let fixture: ComponentFixture<EditImageModalComponent>;
  let mockGraphqlService: SpyObj<GraphqlService>;
  let mockActiveModal: SpyObj<NgbActiveModal>;

  beforeEach(async () => {
    const graphqlServiceSpy = createSpyObj<GraphqlService>('GraphqlService', ['updateImage']);
    const activeModalSpy = createSpyObj<NgbActiveModal>('NgbActiveModal', ['close', 'dismiss']);

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
    mockGraphqlService = TestBed.inject(GraphqlService) as unknown as SpyObj<GraphqlService>;
    mockActiveModal = TestBed.inject(NgbActiveModal) as unknown as SpyObj<NgbActiveModal>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
