import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dialogo',
  templateUrl: './dialogo.component.html',
  styleUrls: ['./dialogo.component.scss'],
})
export class DialogoComponent {
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogoComponent>,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      conversa: this.fb.array([]),
    });

    let conversaArray = this.form.get('conversa') as FormArray;

    if (data?.conversa) {
      data.conversa.forEach((element: any) => {
        conversaArray.push(
          this.fb.group({
            personagem: [element.personagem, Validators.required],
            mensagem: [element.mensagem, Validators.required],
          })
        );
      });

      conversaArray.patchValue(data.conversa);
    } else {
      conversaArray.push(
        this.fb.group({
          personagem: ['M', Validators.required],
          mensagem: ['Olá, como posso te ajudar?', Validators.required],
        })
      );
    }
  }

  saveDialogo() {
    this.dialogRef.close(this.form.value);
  }

  closeDialog() {
    if (this.form.valid) this.dialogRef.close();
  }

  addDialogo() {
    let conversaArray = this.form.get('conversa') as FormArray;

    const lastConversa = conversaArray.controls[conversaArray.length - 1];

    let personagem = lastConversa.get('personagem')?.value == 'M' ? 'P' : 'M';

    conversaArray.push(
      this.fb.group({
        personagem: [personagem, Validators.required],
        mensagem: [null, Validators.required],
      })
    );
  }

  removeDialogo(index: number) {
    let conversaArray = this.form.get('conversa') as FormArray;
    conversaArray.removeAt(index);
  }

  drop(event: any) {
    let conversaArray = this.form.get('conversa') as FormArray;
    let conversa = conversaArray.controls[event.previousIndex];
    conversaArray.removeAt(event.previousIndex);
    conversaArray.insert(event.currentIndex, conversa);
  }

  get conversa() {
    return this.form.get('conversa')?.value;
  }

  get conversaForm() {
    return this.form.get('conversa') as FormArray;
  }
}
