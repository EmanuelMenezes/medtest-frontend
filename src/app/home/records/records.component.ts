import { Questao } from './estrutura';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogoComponent } from './dialogo/dialogo.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { QuestaoComponent } from './questao/questao.component';
@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss'],
})
export class RecordsComponent {
  cursorPosition = {
    x: 0,
    y: 0,
  };

  deleting: boolean = false;

  drawing: boolean = false;

  dragging: boolean = false;

  boardEventContainer: any;

  lineDrawer = {
    origin: {
      x: 0,
      y: 0,
    },
    destiny: {
      x: 0,
      y: 0,
    },
    originId: -1,
    destinyId: -1,
  };

  casoClinico: any = {
    paciente: {
      idPersonagem: 1,
      nome: 'João',
      descricao: 'Paciente com 25 anos de idade',
    },
    idCenario: 1,
    idMedico: 1,
    descricao: 'Paciente com 25 anos de idade',
    nome: 'Caso Clinico 1',
    fluxo: [
      {
        idFluxo: 0,
        transicao: {
          tipo: 'S',
          proxFluxo: false,
        },
      },
      {
        idFluxo: 1,
        transicao: {
          tipo: 'V',
        },
      },
    ],
  };
  formCase: FormGroup;

  cardsPosition: any = {};

  constructor(public dialog: MatDialog, private fb: FormBuilder) {
    this.formCase = this.fb.group({
      caso: [this.casoClinico],
    });

    this.formCase.valueChanges.subscribe((value) => {
      console.log(value);
    });
    if (localStorage.getItem('casoClinico')) {
      this.casoClinico = JSON.parse(localStorage.getItem('casoClinico')!);
    }
  }

  saveCardsPosition() {
    let cards: any = document.querySelectorAll('.card');
    console.log(this.cardsPosition);
    cards.forEach((card: HTMLElement) => {
      this.cardsPosition[card.id] = card.style.transform;
    });

    localStorage.setItem('cardsPosition', JSON.stringify(this.cardsPosition));
  }

  loadCardsPosition() {
    this.cardsPosition = JSON.parse(
      localStorage.getItem('cardsPosition') || '{}'
    );
    let cards: any = document.querySelectorAll('.card');
    cards.forEach((card: HTMLElement) => {
      card.style.transform = this.cardsPosition[card.id];
    });
  }

  onDrag(event: any) {
    if (!this.dragging) {
      let pathsTo = document.querySelectorAll(
        `[to="${event.source.data.idFluxo}"]`
      );
      let pathsFrom = document.querySelectorAll(
        `[from="${event.source.data.idFluxo}"]`
      );

      let card = document.querySelector(
        `[id="card${event.source.data.idFluxo}"]`
      );

      pathsTo.forEach((pathTo) => {
        let d = pathTo.getAttribute('d');
        let rect = card?.getBoundingClientRect()!;
        let xFinal = rect.x - 10;
        let yFinal = rect.y - 50;

        let m = d?.split('c')![0];
        let [x1, y1] = m?.replace('M ', '')?.split(',')!;
        pathTo.setAttribute(
          'd',
          `M ${x1},${Number(y1)} c ${(xFinal - Number(x1)) * 0.4},${
            (yFinal - Number(y1)) * 0.2
          } ${(xFinal - Number(x1)) * 0.6},${yFinal - Number(y1)} ${
            xFinal - Number(x1)
          },${yFinal - Number(y1)}`
        );
      });

      pathsFrom.forEach((pathFrom) => {
        if (pathFrom) {
          let to = pathFrom.getAttribute('to');
          let cardTo = document.querySelector(`[id="card${to}"]`);
          let rectTo = cardTo?.getBoundingClientRect()!;
          let xFinal = rectTo.x - 10;
          let yFinal = rectTo.y - 50;

          let rectFrom = card?.getBoundingClientRect()!;
          let xOrigin = rectFrom.x + 70;
          let yOrigin = pathFrom.getAttribute('saida')
            ? rectFrom.y - 100 + 20 * Number(pathFrom.getAttribute('saida'))
            : rectFrom.y - 50;

          pathFrom.setAttribute(
            'd',
            `M ${xOrigin},${yOrigin} c ${(xFinal - xOrigin) * 0.4},${
              (yFinal - yOrigin) * 0.2
            } ${(xFinal - xOrigin) * 0.6},${yFinal - yOrigin} ${
              xFinal - xOrigin
            },${yFinal - yOrigin}`
          );
        }
      });
    } else {
      this.dragAllTogether(event);
    }
  }

  afterDrag(event: any) {
    if (this.dragging) {
      let cards: any = document.querySelectorAll('.card');
      cards.forEach((card: HTMLElement) => {
        card.removeAttribute('baseX');
        card.removeAttribute('baseY');
      });
    }
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

    setTimeout(() => {
      this.loadCardsPosition();
      this.moveCardUntilNotOverlapping(this.casoClinico.fluxo.length - 1);
      this.initializePaths();
    }, 100);
    document.addEventListener('mousemove', (event) => {
      this.cursorPosition.x = event.clientX;
      this.cursorPosition.y = event.clientY - 80;
    });
    this.boardEventContainer = document.getElementById('board');

    document.addEventListener('contextmenu', (event) => {
      if (this.drawing) {
        event.preventDefault();
        this.boardEventContainer.removeAllListeners('mousemove');
        document.querySelector('path:not([to])')?.remove();
        this.drawing = false;
      }
      if (this.deleting) {
        event.preventDefault();
        this.deleteToggle();
      }
      if (this.dragging) {
        event.preventDefault();
        this.dragToggle();
      }
    });

    setInterval(() => {
      if (this.formCase.controls['caso'].value != this.casoClinico)
        this.salvarCasoClinico();
    }, 10000);

    window.onresize = () => {
      this.recalculatePaths();
    };
  }

  //DIALOGO

  insertDialogo() {
    let dialogRef = this.dialog.open(DialogoComponent, {
      maxWidth: '90vw',
      width: '500px',
      maxHeight: '80vh',
      disableClose: true,
      backdropClass: 'custom-backdrop',
      panelClass: 'dialog-container',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.casoClinico.fluxo.push({
          idFluxo: this.casoClinico.fluxo.length,
          dialogo: {
            ...result,
            proxFluxo: 0,
          },
        });
        setTimeout(() => {
          this.moveCardUntilNotOverlapping(this.casoClinico.fluxo.length - 1);
        }, 100);
      }
    });
  }

  editDialogo(fluxoId: any) {
    let dialogo = this.casoClinico.fluxo.find(
      (f: any) => f.idFluxo == fluxoId
    ).dialogo;
    let dialogRef = this.dialog.open(DialogoComponent, {
      maxWidth: '90vw',
      width: '500px',
      maxHeight: '80vh',
      data: dialogo,
      disableClose: true,
      backdropClass: 'custom-backdrop',
      panelClass: 'dialog-container',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.casoClinico.fluxo.find((f: any) => f.idFluxo == fluxoId).dialogo =
          {
            ...result,
            proxFluxo: dialogo.proxFluxo,
          };
      }
    });
  }

  //QUESTAO

  insertQuestao() {
    let dialogRef = this.dialog.open(QuestaoComponent, {
      maxWidth: '90vw',
      width: '700px',
      maxHeight: '80vh',
      disableClose: true,
      backdropClass: 'custom-backdrop',
      panelClass: 'dialog-container',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.casoClinico.fluxo.push({
          idFluxo: this.casoClinico.fluxo.length,
          questao: {
            ...result,
          },
        });
        setTimeout(() => {
          this.moveCardUntilNotOverlapping(this.casoClinico.fluxo.length - 1);
        }, 100);
      }
    });
  }

  editQuestao(fluxoId: any) {
    let questao = this.casoClinico.fluxo.find(
      (f: any) => f.idFluxo == fluxoId
    ).questao;
    let dialogRef = this.dialog.open(QuestaoComponent, {
      maxWidth: '90vw',
      width: '700px',
      maxHeight: '80vh',
      data: questao,
      disableClose: true,
      backdropClass: 'custom-backdrop',
      panelClass: 'dialog-container',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.casoClinico.fluxo.find((f: any) => f.idFluxo == fluxoId).questao =
          {
            ...result,
          };
        //recalculate paths stroke colors
        let paths = document.querySelectorAll('path[from="' + fluxoId + '"]');
        paths.forEach((path) => {
          let saida = path.getAttribute('saida');
          if (!saida) return;
          let questao = this.casoClinico.fluxo.find(
            (f: any) => f.idFluxo == fluxoId
          ).questao;
          questao.respostas[+saida - 1].isCorrect
            ? path.setAttribute('stroke', '#07cc00')
            : path.setAttribute('stroke', '#dd523a');
        });
      }
    });
  }

  checkCorrectAnswer(fluxoId: number, idSaida: number) {
    let questao = this.casoClinico.fluxo.find(
      (f: any) => f.idFluxo == fluxoId
    ).questao;

    let resposta = questao.respostas[idSaida - 1];

    return resposta.isCorrect;
  }

  //EXAME

  insertExame() {
    this.casoClinico.fluxo.push({
      idFluxo: this.casoClinico.fluxo.length,
      exame: {
        informacaoTexto: [
          {
            titulo: 'Exame de sangue',
            texto: 'O exame de sangue deu negativo para covid',
          },
        ],
        proxFluxo: 0,
      },
    });
  }

  insertTransicao(tipo?: string) {
    this.casoClinico.fluxo.push({
      idFluxo: this.casoClinico.fluxo.length,
      transicao: {
        tipo: tipo ? tipo : 'M',
        proxFluxo: 0,
      },
    });
    setTimeout(() => {
      this.moveCardUntilNotOverlapping(this.casoClinico.fluxo.length - 1);
    }, 100);
  }

  //DRAWING

  drawLineTo(id: any) {
    if (this.lineDrawer.originId == id) return;
    //remove all event listeners
    this.boardEventContainer.removeAllListeners('mousemove');
    this.drawing = false;

    this.lineDrawer.destiny = {
      x: this.cursorPosition.x,
      y: this.cursorPosition.y,
    };
    //let path = document.getElementById('path' + this.lineDrawer.originId);
    let path = document.querySelector(
      'path:not([to])[from="' + this.lineDrawer.originId + '"]'
    );
    path?.setAttribute(
      'd',
      `M ${this.lineDrawer.origin.x},${this.lineDrawer.origin.y} c ${
        (this.lineDrawer.destiny.x - this.lineDrawer.origin.x) * 0.4
      },${(this.lineDrawer.destiny.y - this.lineDrawer.origin.y) * 0.2} ${
        (this.lineDrawer.destiny.x - this.lineDrawer.origin.x) * 0.6
      },${this.lineDrawer.destiny.y - this.lineDrawer.origin.y} ${
        this.lineDrawer.destiny.x - this.lineDrawer.origin.x
      },${this.lineDrawer.destiny.y - this.lineDrawer.origin.y}`
    );
    path?.setAttribute('to', id);

    this.lineDrawer = {
      origin: {
        x: 0,
        y: 0,
      },
      destiny: {
        x: 0,
        y: 0,
      },
      originId: -1,
      destinyId: -1,
    };
  }

  drawLineFrom(id: any, idSaida?: any) {
    if (this.deleting) {
      return;
    }
    let pathFrom;
    if (!idSaida) {
      pathFrom = document.querySelector(`[from="${id}"]`);
    } else {
      pathFrom = document.querySelector(`[from="${id}"][saida="${idSaida}"]`);
    }
    if (pathFrom && !pathFrom?.getAttribute('to')) {
      this.boardEventContainer?.removeAllListeners('mousemove', this.drawLine);
      pathFrom.remove();
      this.drawing = false;
      return;
    }
    if (this.drawing) {
      let path = document.querySelector('path:not([to])');
      path?.remove();
      this.boardEventContainer?.removeAllListeners('mousemove', this.drawLine);
      this.drawing = false;
      return;
    }

    this.drawing = true;
    this.lineDrawer.origin = {
      x: this.cursorPosition.x,
      y: this.cursorPosition.y,
    };
    this.lineDrawer.originId = id;
    let svg = document.querySelector('#path-base');

    if (idSaida) {
      document.querySelector(`[from="${id}"][saida="${idSaida}"]`)?.remove();
      let fluxo = this.casoClinico.fluxo.find((f: any) => f.idFluxo == id);
      fluxo.questao.respostas[idSaida - 1].proxFluxo = false;
    } else {
      if (document.getElementById('path' + id)) {
        document.getElementById('path' + id)?.remove();
        let fluxo = this.casoClinico.fluxo.find((f: any) => f.idFluxo == id);
        if (fluxo.exame) {
          fluxo.exame.proxFluxo = false;
        }
        if (fluxo.transicao) {
          fluxo.transicao.proxFluxo = false;
        }
        if (fluxo.dialogo) {
          fluxo.dialogo.proxFluxo = false;
        }
      }
    }

    //create dinamic svg path and attach to card
    let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute(
      'd',
      `M${this.cursorPosition.x},${this.cursorPosition.y} c 0,0 0,0 1,1`
    );

    path.setAttribute('stroke', '#6000aa');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('fill', 'transparent');
    path.setAttribute('from', id);
    svg?.appendChild(path);

    if (idSaida) {
      path.setAttribute('saida', idSaida);
      let questao = this.casoClinico.fluxo.find(
        (f: any) => f.idFluxo == id
      ).questao;
      questao.respostas[idSaida - 1].isCorrect
        ? path.setAttribute('stroke', '#07cc00')
        : path.setAttribute('stroke', '#dd523a');

      this.boardEventContainer.addEventListener(
        'mousemove',
        ($event: MouseEvent) => {
          this.drawLine(id, idSaida);
        }
      );
    } else {
      path.setAttribute('id', 'path' + id);

      this.boardEventContainer.addEventListener(
        'mousemove',
        ($event: MouseEvent) => {
          this.drawLine(id);
        }
      );
    }
  }

  drawLine(id: any, idSaida?: any) {
    if (this.lineDrawer.originId == id) {
      let path = idSaida
        ? document.querySelector(
            'path[from="' + id + '"][saida="' + idSaida + '"]'
          )
        : document.getElementById('path' + id);
      if (path) {
        path.setAttribute(
          'd',
          `M ${this.lineDrawer.origin.x},${this.lineDrawer.origin.y} c
        ${this.cursorPosition.x - this.lineDrawer.origin.x},${
            this.cursorPosition.y - this.lineDrawer.origin.y
          }

        ${this.cursorPosition.x - this.lineDrawer.origin.x},${
            this.cursorPosition.y - this.lineDrawer.origin.y
          }

        ${this.cursorPosition.x - this.lineDrawer.origin.x},${
            this.cursorPosition.y - this.lineDrawer.origin.y
          }
        `
        );
      }
    }
  }

  setActiveSaida(id: any, idSaida?: any) {
    let path = idSaida
      ? document.querySelector(
          'path[from="' + id + '"][saida="' + idSaida + '"]'
        )
      : document.getElementById('path' + id);

    return path ? true : false;
  }

  setActiveEntrada(id: any) {
    let path = document.querySelector(`[to="${id}"]`);

    return path ? true : false;
  }

  dragAllTogether(event: any) {
    //drag all elements together
    let cards: any = document.querySelectorAll('.card');

    cards.forEach((card: HTMLElement) => {
      let regex = /translate.{0,2}\(/;
      let regexpx = /px,*/;
      let translateX: any;
      let translateY: any;
      let translate: string = card.style.transform;
      let translateTotalString: any[] = [];
      translateTotalString = card.style.transform.split(regex);
      translateX = translateTotalString[1].split(regexpx)[0];
      translateY = translateTotalString[1].split(regexpx)[1];
      if (!card.getAttribute('baseX') && !card.getAttribute('baseY')) {
        card.setAttribute('baseX', translateX);
        card.setAttribute('baseY', translateY);
      }

      let x = Number(card.getAttribute('baseX')) + event.distance.x;
      let y = Number(card.getAttribute('baseY')) + event.distance.y;

      translate = translate.replace(translateX, x);
      translate = translate.replace(translateY, y);

      card.style.transform = translate;
    });
    let paths = document.querySelectorAll('path[from][to]');

    //recalculate path
    paths.forEach((path) => {
      let from = path.getAttribute('from');
      let to = path.getAttribute('to');
      let saida = path.getAttribute('saida');
      let rectFrom = document
        .querySelector(`[id="card${from}"]`)
        ?.getBoundingClientRect()!;
      let rectTo = document
        .querySelector(`[id="card${to}"]`)
        ?.getBoundingClientRect()!;
      let xOrigin = rectFrom.x + 70;
      let yOrigin = saida
        ? rectFrom.y - 100 + 20 * Number(saida)
        : rectFrom.y - 50;
      let xFinal = rectTo.x - 10;
      let yFinal = rectTo.y - 50;

      path.setAttribute(
        'd',
        `M ${xOrigin},${yOrigin} c ${(xFinal - xOrigin) * 0.4},${
          (yFinal - yOrigin) * 0.2
        } ${(xFinal - xOrigin) * 0.6},${yFinal - yOrigin} ${xFinal - xOrigin},${
          yFinal - yOrigin
        }`
      );
    });
  }

  salvarCasoClinico() {
    let paths = document.querySelectorAll('path[from][to]');
    paths.forEach((path) => {
      let from = path.getAttribute('from');
      let to = path.getAttribute('to');
      let saida = path.getAttribute('saida');
      let fluxo = this.casoClinico.fluxo.find((f: any) => f.idFluxo == from);
      if (saida) {
        fluxo.questao.respostas[+saida - 1].proxFluxo = to;
      } else {
        if (fluxo.exame) {
          fluxo.exame.proxFluxo = to;
        }
        if (fluxo.transicao) {
          fluxo.transicao.proxFluxo = to;
        }
        if (fluxo.dialogo) {
          fluxo.dialogo.proxFluxo = to;
        }
      }
    });

    this.formCase.patchValue({ caso: this.casoClinico });
    this.saveCardsPosition();
    localStorage.setItem('casoClinico', JSON.stringify(this.casoClinico));
  }

  deleteToggle() {
    event?.stopPropagation();
    this.deleting = !this.deleting;
    if (this.deleting) {
      if (this.drawing) {
        this.boardEventContainer.removeAllListeners('mousemove');
        document.querySelector('path:not([to])')?.remove();
        this.drawing = false;
      }
      if (this.dragging) {
        this.dragToggle();
      }
    }
  }

  dragToggle() {
    event?.stopPropagation();
    this.dragging = !this.dragging;
    if (!this.dragging) {
      let cards: any = document.querySelectorAll('.card');
      cards.forEach((card: HTMLElement) => {
        card.removeAttribute('baseX');
        card.removeAttribute('baseY');
      });
    } else {
      if (this.deleting) {
        this.deleteToggle();
      }
    }
  }

  handleClick(event: any, item: any) {
    if (this.deleting) {
      if (!(item.transicao?.tipo == 'S')) this.deleteItem(item.idFluxo);
    }
  }

  boardClick() {
    let sidebarOpen = document
      .getElementById('sidebar')
      ?.classList.contains('active');
    if (sidebarOpen) {
      this.sidebarToggle();
    }
  }

  deleteItem(itemId: number) {
    let pathsFrom = document.querySelectorAll(`path[from="${itemId}"]`);
    let pathsTo = document.querySelectorAll(`path[to="${itemId}"]`);
    pathsTo.forEach((path) => {
      path.remove();
    });
    pathsFrom.forEach((path) => {
      path.remove();
    });
    let fluxo = this.casoClinico.fluxo.find((f: any) => f.idFluxo == itemId);
    let index = this.casoClinico.fluxo.indexOf(fluxo);
    if (index > -1) {
      this.casoClinico.fluxo.splice(index, 1);
    }
  }

  sidebarToggle() {
    let sidebar = document.getElementById('sidebar');
    sidebar?.classList.toggle('active');
  }

  toolbarClick() {
    if (this.drawing) {
      this.boardEventContainer.removeAllListeners('mousemove');
      document.querySelector('path:not([to])')?.remove();
      this.drawing = false;
    }
    if (this.deleting) {
      this.deleteToggle();
    }
    if (this.dragging) {
      this.dragToggle();
    }
  }

  onMouseLeaving() {
    if (this.drawing) {
      this.boardEventContainer.removeAllListeners('mousemove');
      document.querySelector('path:not([to])')?.remove();
      this.drawing = false;
    }
    if (this.deleting) {
      this.deleteToggle();
    }
    if (this.dragging) {
      this.dragToggle();
    }
  }

  moveCardUntilNotOverlapping(cardId: any) {
    let card = document.getElementById('card' + cardId)!;
    let rect = card.getBoundingClientRect();
    let overlapping = true;
    let translateX = 0;
    let translateY = 0;

    let countWithOverlapping = 0;

    while (overlapping) {
      if (countWithOverlapping > 40) {
        return;
      }

      overlapping = false;
      this.boardEventContainer
        .querySelectorAll('.card:not([id="card' + cardId + '"])')
        .forEach((otherCard: any) => {
          let otherRect = otherCard.getBoundingClientRect();
          if (
            rect.x < otherRect.x + otherRect.width &&
            rect.x + rect.width > otherRect.x &&
            rect.y < otherRect.y + otherRect.height &&
            rect.y + rect.height > otherRect.y
          ) {
            overlapping = true;
            //move first horizontally, and if window limit, move vertically
            if (translateX + rect.x < window.innerWidth - 60) {
              translateX += 50;
            } else {
              translateX = 0;
              if (translateY + rect.y < window.innerHeight - 60) {
                translateY += 50;
              } else {
                translateY = -200;
              }
            }

            card.style.transform = `translate(${translateX}px, ${translateY}px)`;
            rect = card.getBoundingClientRect();
          }
        });
      if (!overlapping) {
        countWithOverlapping = 0;
      } else {
        countWithOverlapping++;
      }
    }
  }

  recalculatePaths() {
    let paths = document.querySelectorAll('path[from][to]');

    //recalculate path
    paths.forEach((path) => {
      let from = path.getAttribute('from');
      let to = path.getAttribute('to');
      let saida = path.getAttribute('saida');
      let rectFrom = document
        .querySelector(`[id="card${from}"]`)
        ?.getBoundingClientRect()!;
      let rectTo = document
        .querySelector(`[id="card${to}"]`)
        ?.getBoundingClientRect()!;
      let xOrigin = rectFrom.x + 70;
      let yOrigin = saida
        ? rectFrom.y - 100 + 20 * Number(saida)
        : rectFrom.y - 50;
      let xFinal = rectTo.x - 10;
      let yFinal = rectTo.y - 50;

      path.setAttribute(
        'd',
        `M ${xOrigin},${yOrigin} c ${(xFinal - xOrigin) * 0.4},${
          (yFinal - yOrigin) * 0.2
        } ${(xFinal - xOrigin) * 0.6},${yFinal - yOrigin} ${xFinal - xOrigin},${
          yFinal - yOrigin
        }`
      );
    });
  }

  initializePaths() {
    // draw paths from existing data
    const svg = document.querySelector('#path-base');
    this.casoClinico.fluxo.forEach((fluxo: any) => {
      let card = document.querySelector(`[id="card${fluxo.idFluxo}"]`);
      let rect = card?.getBoundingClientRect()!;

      if (fluxo.transicao) {
        if (fluxo.transicao.proxFluxo > 0) {
          let xOrigin = rect.x + 70;
          let yOrigin = rect.y - 50;
          let xFinal =
            document
              .querySelector(`[id="card${fluxo.transicao.proxFluxo}"]`)
              ?.getBoundingClientRect()!.x! - 10;
          let yFinal =
            document
              .querySelector(`[id="card${fluxo.transicao.proxFluxo}"]`)
              ?.getBoundingClientRect()!.y! - 50;

          let path = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path'
          );

          path.setAttribute(
            'd',
            `M ${xOrigin},${yOrigin} c ${(xFinal - xOrigin) * 0.4},${
              (yFinal - yOrigin) * 0.2
            } ${(xFinal - xOrigin) * 0.6},${yFinal - yOrigin} ${
              xFinal - xOrigin
            },${yFinal - yOrigin}`
          );

          path.setAttribute('stroke', '#6000aa');
          path.setAttribute('stroke-width', '2');
          path.setAttribute('fill', 'transparent');
          path.setAttribute('from', fluxo.idFluxo);
          path.setAttribute('to', fluxo.transicao.proxFluxo);
          path.setAttribute('id', 'path' + fluxo.idFluxo);
          svg?.appendChild(path);
        }
      }
      if (fluxo.exame) {
        if (fluxo.exame.proxFluxo > 0) {
          let xOrigin = rect.x + 70;
          let yOrigin = rect.y - 50;
          let xFinal =
            document
              .querySelector(`[id="card${fluxo.exame.proxFluxo}"]`)
              ?.getBoundingClientRect()!.x! - 10;
          let yFinal =
            document
              .querySelector(`[id="card${fluxo.exame.proxFluxo}"]`)
              ?.getBoundingClientRect()!.y! - 50;

          let path = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path'
          );

          path.setAttribute(
            'd',
            `M ${xOrigin},${yOrigin} c ${(xFinal - xOrigin) * 0.4},${
              (yFinal - yOrigin) * 0.2
            } ${(xFinal - xOrigin) * 0.6},${yFinal - yOrigin} ${
              xFinal - xOrigin
            },${yFinal - yOrigin}`
          );

          path.setAttribute('stroke', '#6000aa');
          path.setAttribute('stroke-width', '2');
          path.setAttribute('fill', 'transparent');
          path.setAttribute('from', fluxo.idFluxo);
          path.setAttribute('to', fluxo.exame.proxFluxo);
          path.setAttribute('id', 'path' + fluxo.idFluxo);
          svg?.appendChild(path);
        }
      }
      if (fluxo.dialogo) {
        if (fluxo.dialogo.proxFluxo > 0) {
          let xOrigin = rect.x + 70;
          let yOrigin = rect.y - 50;
          let xFinal =
            document
              .querySelector(`[id="card${fluxo.dialogo.proxFluxo}"]`)
              ?.getBoundingClientRect()!.x! - 10;
          let yFinal =
            document
              .querySelector(`[id="card${fluxo.dialogo.proxFluxo}"]`)
              ?.getBoundingClientRect()!.y! - 50;

          let path = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path'
          );

          path.setAttribute(
            'd',
            `M ${xOrigin},${yOrigin} c ${(xFinal - xOrigin) * 0.4},${
              (yFinal - yOrigin) * 0.2
            } ${(xFinal - xOrigin) * 0.6},${yFinal - yOrigin} ${
              xFinal - xOrigin
            },${yFinal - yOrigin}`
          );

          path.setAttribute('stroke', '#6000aa');
          path.setAttribute('stroke-width', '2');
          path.setAttribute('fill', 'transparent');
          path.setAttribute('from', fluxo.idFluxo);
          path.setAttribute('to', fluxo.dialogo.proxFluxo);
          path.setAttribute('id', 'path' + fluxo.idFluxo);
          svg?.appendChild(path);
        }
      }
      if (fluxo.questao) {
        fluxo.questao.respostas.forEach((resposta: any, index: number) => {
          if (resposta.proxFluxo > 0) {
            let xOrigin = rect.x + 70;
            let yOrigin = rect.y - 100 + 20 * (index + 1);
            let xFinal =
              document
                .querySelector(`[id="card${resposta.proxFluxo}"]`)
                ?.getBoundingClientRect()!.x! - 10;
            let yFinal =
              document
                .querySelector(`[id="card${resposta.proxFluxo}"]`)
                ?.getBoundingClientRect()!.y! - 50;

            let path = document.createElementNS(
              'http://www.w3.org/2000/svg',
              'path'
            );

            path.setAttribute(
              'd',
              `M ${xOrigin},${yOrigin} c ${(xFinal - xOrigin) * 0.4},${
                (yFinal - yOrigin) * 0.2
              } ${(xFinal - xOrigin) * 0.6},${yFinal - yOrigin} ${
                xFinal - xOrigin
              },${yFinal - yOrigin}`
            );

            resposta.isCorrect
              ? path.setAttribute('stroke', '#07cc00')
              : path.setAttribute('stroke', '#dd523a');

            path.setAttribute('stroke-width', '2');
            path.setAttribute('fill', 'transparent');
            path.setAttribute('from', fluxo.idFluxo);
            path.setAttribute('to', resposta.proxFluxo);
            path.setAttribute('id', 'path' + fluxo.idFluxo);
            path.setAttribute('saida', index + 1 + '');
            svg?.appendChild(path);
          }
        });
      }
    });
  }
}
