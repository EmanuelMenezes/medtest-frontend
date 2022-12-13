import { Component, OnInit } from '@angular/core';
declare var createUnityInstance: any;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  constructor() {}

  killGame: any;

  ngOnInit() {
    var buildUrl = 'assets/build/Build';
    var config = {
      dataUrl: buildUrl + '/build.data.unityweb',
      frameworkUrl: buildUrl + '/build.framework.js.unityweb',
      codeUrl: buildUrl + '/build.wasm.unityweb',
      streamingAssetsUrl: 'StreamingAssets',
      companyName: 'JoeMoceri',
      productName: 'Unity Effects Pack',
      productVersion: '0.1',
      devicePixelRatio: 0,
    };

    let container = document.querySelector('#unity-container')!;
    var canvas: HTMLElement = document.querySelector('#unity-canvas')!;
    var loadingBar: HTMLElement = document.querySelector('#unity-loading-bar')!;
    var progressBarFull: HTMLElement = document.querySelector(
      '#unity-progress-bar-full'
    )!;
    var fullscreenButton: HTMLElement = document.querySelector(
      '#unity-fullscreen-button'
    )!;
    var mobileWarning: HTMLElement = document.querySelector(
      '#unity-mobile-warning'
    )!;

    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      container.className = 'unity-mobile';
      config.devicePixelRatio = 1;
      mobileWarning.style.display = 'block';
      setTimeout(() => {
        mobileWarning.style.display = 'none';
      }, 5000);
    } else {
      canvas.style.width = '960px';
      canvas.style.height = '600px';
    }
    loadingBar.style.display = 'block';

    createUnityInstance(canvas, config, (progress: any) => {
      progressBarFull.style.width = 100 * progress + '%';
    })
      .then((unityInstance: any) => {
        loadingBar.style.display = 'none';
        fullscreenButton.onclick = () => {
          unityInstance.SetFullscreen(1);
        };
        this.killGame = () => {
          unityInstance.Quit();
        };
      })
      .catch((message: any) => {
        alert(message);
      });
  }

  ngOnDestroy() {
    this.killGame();
  }
}
