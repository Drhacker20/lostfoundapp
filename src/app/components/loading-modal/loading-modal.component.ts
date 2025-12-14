import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-loading-modal',
  template: `
    <div class="loading-wrapper">
      <div class="neumorphic-box">
        <div class="neumorphic-loader">
          <div class="dot" *ngFor="let d of dots"></div>
        </div>
        <p class="loading-text">{{ message || 'Please wait...' }}</p>
      </div>
    </div>
  `,
  styles: [`
    .loading-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      background: rgba(0, 0, 0, 0.25);
      backdrop-filter: blur(4px);
    }

    .neumorphic-box {
      width: 220px;
      height: 220px;
      background: #d7ecfa;
      border-radius: 25px;
      box-shadow:
        8px 8px 16px #b8d0e0,
        -8px -8px 16px #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
    }

    .neumorphic-loader {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 14px;
      margin-bottom: 18px;
    }

    .neumorphic-loader .dot {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #d7ecfa;
      box-shadow:
        6px 6px 12px #b8d0e0,
        -6px -6px 12px #ffffff;
      animation: pulse 2.5s ease-in-out infinite;
    }

    .neumorphic-loader .dot:nth-child(1) { animation-delay: 0s; }
    .neumorphic-loader .dot:nth-child(2) { animation-delay: 0.2s; }
    .neumorphic-loader .dot:nth-child(3) { animation-delay: 0.4s; }
    .neumorphic-loader .dot:nth-child(4) { animation-delay: 0.6s; }
    .neumorphic-loader .dot:nth-child(5) { animation-delay: 0.8s; }
    .neumorphic-loader .dot:nth-child(6) { animation-delay: 1s; }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        opacity: 0.9;
      }
      50% {
        transform: scale(1.35);
        opacity: 1;
      }
    }

    .loading-text {
      font-size: 15px;
      font-weight: 600;
      color: #4a6d88;
    }
  `],
  standalone: false
})
export class LoadingModalComponent {
  @Input() message?: string;
  dots = Array(6);
  constructor(private modalCtrl: ModalController) {}
  dismiss() {
    this.modalCtrl.dismiss();
  }
}
