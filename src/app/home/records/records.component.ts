import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss'],
})
export class RecordsComponent implements OnInit {
  cursorPosition = {
    x: 0,
    y: 0,
  };

  deleting: boolean = false;

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
      if (this.deleting) {
        event.preventDefault();
        this.deleting = false;
      }
    });
  }

  insertFluxo(type: string) {
    this.drawing = false;
    this.deleting = false;
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
    setTimeout(() => {
      this.moveCardUntilNotOverlapping(this.casoClinico.fluxo.length - 1);
    }, 100);
  }

  moveCardUntilNotOverlapping(cardId: any) {
    let card = document.getElementById('card' + cardId)!;
    console.log(card);
    let rect = card.getBoundingClientRect();
    let overlapping = true;
    let translateX = 0;
    let translateY = 0;
    while (overlapping) {
      overlapping = false;
      this.boardEventContainer
        .querySelectorAll('.card:not([id="card' + cardId + '"])')
        .forEach((otherCard: any) => {
          let otherRect = otherCard.getBoundingClientRect();
          console.log(otherRect);
          console.log(rect);
          console.log(otherCard);
          if (
            rect.x < otherRect.x + otherRect.width &&
            rect.x + rect.width > otherRect.x &&
            rect.y < otherRect.y + otherRect.height &&
            rect.y + rect.height > otherRect.y
          ) {
            overlapping = true;
            translateX += 40;
            translateY += 40;
            card.style.transform = `translate(${translateX}px, ${translateY}px)`;
            rect = card.getBoundingClientRect();
          }
        });
    }
  }

  insertDialogo() {
    this.casoClinico.fluxo.push({
      idFluxo: this.casoClinico.fluxo.length,
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
      idFluxo: this.casoClinico.fluxo.length,
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

  insertTransicao() {
    this.casoClinico.fluxo.push({
      idFluxo: this.casoClinico.fluxo.length,
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

  deleteToggle() {
    this.deleting = !this.deleting;
  }

  handleClick(event: any, item: any) {
    if (this.deleting) {
      if (!(item.transicao?.tipo == 'S')) this.deleteItem(item.idFluxo);
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
}
