import { CasoClinico, Questao } from './estrutura';
import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss'],
})
export class RecordsComponent implements OnInit {
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  cursorPosition = {
    x: 0,
    y: 0,
  };

  drawing: boolean = false;

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
    originId: 0,
    destinyId: 0,
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
    fluxo: [
      {
        idFluxo: 0,
        proxFluxo: 0,
        transicao: {
          tipo: 'S',
        },
      },
    ],
  };

  constructor() {}

  //host listener mouse movement
  ngOnInit(): void {}

  onDrag(event: any) {
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
    if (pathsFrom.length > 1) {
      pathsFrom.forEach((pathFrom) => {
        if (pathFrom) {
          let to = pathFrom.getAttribute('to');
          let cardTo = document.querySelector(`[id="card${to}"]`);
          let rectTo = cardTo?.getBoundingClientRect()!;
          let xFinal = rectTo.x - 10;
          let yFinal = rectTo.y - 50;

          let rectFrom = card?.getBoundingClientRect()!;
          let xOrigin = rectFrom.x + 70;
          let yOrigin =
            rectFrom.y - 100 + 20 * Number(pathFrom.getAttribute('saida'));

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
    } else if (pathsFrom.length == 1) {
      let pathFrom = pathsFrom[0];
      if (pathFrom) {
        let to = pathFrom.getAttribute('to');
        let cardTo = document.querySelector(`[id="card${to}"]`);
        let rectTo = cardTo?.getBoundingClientRect()!;
        let xFinal = rectTo.x - 10;
        let yFinal = rectTo.y - 50;

        let rectFrom = card?.getBoundingClientRect()!;
        let xOrigin = rectFrom.x + 70;
        let yOrigin = rectFrom.y - 50;

        pathFrom.setAttribute(
          'd',
          `M ${xOrigin},${yOrigin} c ${(xFinal - xOrigin) * 0.4},${
            (yFinal - yOrigin) * 0.2
          } ${(xFinal - xOrigin) * 0.6},${yFinal - yOrigin} ${
            xFinal - xOrigin
          },${yFinal - yOrigin}`
        );
      }
    }
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
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
    });
  }

  insertFluxo(type: string) {
    switch (type) {
      case 'dialogo':
        this.insertDialogo();
        break;
      case 'questao':
        this.insertQuestao();
        break;
      case 'exame':
        this.insertExame();
        break;
      case 'transicao':
        this.insertTransicao();
        break;
    }
  }

  insertDialogo() {
    this.casoClinico.fluxo.push({
      idFluxo: this.casoClinico.fluxo.length + 1,
      dialogo: {
        conversa: [
          {
            personagem: 'M',
            mensagem: 'Olá, tudo bem?',
          },
          {
            personagem: 'P',
            mensagem: 'Tudo!',
          },
        ],
        proxFluxo: 0,
      },
    });
  }

  insertQuestao() {
    this.casoClinico.fluxo.push({
      idFluxo: this.casoClinico.fluxo.length + 1,
      questao: {
        pergunta: 'Qual a cor do céu?',
        respostas: [
          {
            texto: 'Azul',
            isCorrect: true,
            proxFluxo: 0,
            pontuacao: 10,
          },
          {
            texto: 'Vermelho',
            isCorrect: false,
            proxFluxo: 0,
            pontuacao: 0,
          },
        ],
      },
    });
  }

  insertExame() {
    this.casoClinico.fluxo.push({
      idFluxo: this.casoClinico.fluxo.length + 1,
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

  insertTransicao() {
    this.casoClinico.fluxo.push({
      idFluxo: this.casoClinico.fluxo.length + 1,
      transicao: {
        tipo: 'M',
      },
    });
  }

  drawLineTo(id: any) {
    //remove all event listeners
    this.boardEventContainer.removeAllListeners('mousemove');
    this.drawing = false;

    if (this.lineDrawer.originId == id) return;

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
      originId: 0,
      destinyId: 0,
    };
  }

  drawLineFrom(id: any, idSaida?: any) {
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
    let svg = document.querySelector('svg');

    if (idSaida) {
      document.querySelector(`[from="${id}"][saida="${idSaida}"]`)?.remove();
    } else {
      if (document.getElementById('path' + id)) {
        document.getElementById('path' + id)?.remove();
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
    console.log('drawLine', id, idSaida);
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

  menuPosition = { x: 0, y: 0 };

  onCardClick($event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();
  }

  openMenu($event: MouseEvent, id: any) {
    $event.preventDefault();
    $event.stopPropagation();

    this.menuPosition = {
      x: $event.clientX,
      y: $event.clientY,
    };

    this.trigger.openMenu();
  }

  salvarCasoClinico() {
    let paths = document.querySelectorAll('path[from][to]');
    paths.forEach((path) => {
      let from = path.getAttribute('from');
      let to = path.getAttribute('to');
      let saida = path.getAttribute('saida');
      let fluxo = this.casoClinico.fluxo.find((f: any) => f.idFluxo == from);
      if (saida) {
        fluxo.questao.respostas[saida].proxFluxo = to;
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
    console.log(this.casoClinico);
  }
}
