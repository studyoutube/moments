import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Moment } from 'src/app/Moment';

@Component({
  selector: 'app-moment-form',
  templateUrl: './moment-form.component.html',
  styleUrls: ['./moment-form.component.css'],
})
export class MomentFormComponent implements OnInit {
  @Input() btnText!: string;
  momentForm!: UntypedFormGroup;
  @Input() momentData: Moment | null = null;

  @Output() onSubmit = new EventEmitter<Moment>();

  constructor() {}

  ngOnInit(): void {
    this.momentForm = new UntypedFormGroup({
      id: new UntypedFormControl(this.momentData ? this.momentData.id : ''),
      title: new UntypedFormControl(
        this.momentData ? this.momentData.title : '',
        [Validators.required]
      ),
      description: new UntypedFormControl(
        this.momentData ? this.momentData.description : '',
        [Validators.required]
      ),
      image: new UntypedFormControl(''),
    });
  }

  get title() {
    return this.momentForm.get('title')!;
  }

  get description() {
    return this.momentForm.get('description')!;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    this.momentForm.patchValue({ image: file });
  }

  submit() {
    if (this.momentForm.invalid) {
      return;
    }

    // console.log('Formulário moment form!');
    console.log(this.momentForm.value);
    this.onSubmit.emit(this.momentForm.value);
  }
}
