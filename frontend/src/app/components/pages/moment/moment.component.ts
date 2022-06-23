import { Comment } from './../../../Comment';
import { CommentService } from './../../../services/comment.service';
import { MessagesService } from 'src/app/services/messages.service';
import { faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import { MomentService } from 'src/app/services/moment.service';
import { Moment } from 'src/app/Moment';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-moment',
  templateUrl: './moment.component.html',
  styleUrls: ['./moment.component.css'],
})
export class MomentComponent implements OnInit {
  moment?: Moment;
  baseApiUrl = environment.baseApiUrl;

  faTimes = faTimes;
  faEdit = faEdit;

  commentForm!: FormGroup;

  constructor(
    private momentService: MomentService,
    private route: ActivatedRoute,
    private messagesService: MessagesService,
    private router: Router,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    // id q está na url
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.momentService.getMoment(id).subscribe((item) => {
      this.moment = item.data;
    });

    this.commentForm = new FormGroup({
      text: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
    });
  }

  get text() {
    return this.commentForm.get('text')!;
  }

  get username() {
    return this.commentForm.get('username')!;
  }

  async removeHandler(id: number) {
    // console.log('Testando delete');
    await this.momentService.removeMoment(id).subscribe();

    this.messagesService.add('Moment excluído com sucesso!');

    this.router.navigate(['/']);
  }

  async onSubmit(formDirective: FormGroupDirective) {
    // console.log('formDirective');
    if (this.commentForm.invalid) {
      return;
    }

    const data: Comment = this.commentForm.value;

    data.momentId = Number(this.moment!.id);

    await this.commentService
      .createComment(data)
      .subscribe((comment) => this.moment!.comments!.push(comment.data));

    this.messagesService.add('Comentário adicionado!');

    // reset o form
    this.commentForm.reset();

    formDirective.resetForm();
  }
}
