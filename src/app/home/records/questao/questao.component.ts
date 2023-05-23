import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-questao',
  templateUrl: './questao.component.html',
  styleUrls: ['./questao.component.scss'],
})
export class QuestaoComponent {
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<QuestaoComponent>,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      pergunta: [data?.pergunta, Validators.required],
      respostas: this.fb.array([
        this.fb.group({
          texto: [null],
          isCorrect: [true],
          proxFluxo: [null],
          pontuacao: [0],
        }),
        this.fb.group({
          texto: [null],
          isCorrect: [false],
          proxFluxo: [null],
          pontuacao: [0],
        }),
        this.fb.group({
          texto: [null],
          isCorrect: [false],
          proxFluxo: [null],
          pontuacao: [0],
        }),
        this.fb.group({
          texto: [null],
          isCorrect: [false],
          proxFluxo: [null],
          pontuacao: [0],
        }),
      ]),
    });

    if (data) {
      this.form.patchValue(data);
    }
  }

  saveQuestao() {
    this.dialogRef.close(this.form.value);
  }

  closeDialog() {
    if (this.form.valid) this.dialogRef.close();
  }
}
