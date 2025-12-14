import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.page.html',
  styleUrls: ['./chat-view.page.scss'],
  standalone: false
})
export class ChatViewPage {
  chatName: string = 'Chat';
  chatText: string = '';
  selectedImages: string[] = [];
  messages: any[] = [];
  identityConfirmed: boolean = false;
  claimerValidated: boolean = false;

  // roles
  userRole: 'claimer' | 'finder' = 'claimer';

  // item passed from details
  itemData: any;

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private alertCtrl: AlertController
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {

      // ⭐ CHAT NAME WILL NOW USE "reportedBy"
      this.chatName = navigation.extras.state['chatName'] || 'Reporter';

      this.itemData = navigation.extras.state['item'];
    }

    // example initial messages
    this.messages = [
      {
        text: 'Hello, are you the one who found the gray Tupperware bottle?',
        sender: 'user',
        time: '13:50'
      },
      {
        text: 'Yes, that’s right. Please confirm your identity first.',
        sender: 'other',
        time: '13:51 • Read'
      }
    ];
  }

  goBack() {
    this.navCtrl.back();
  }

  // 🪪 Step 1: Confirm Identity
  async confirmIdentity() {
    const alertBox = await this.alertCtrl.create({
      header: 'Confirm Your Identity',
      inputs: [{ name: 'fullName', type: 'text', placeholder: 'Full Name' }],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Upload Photo',
          handler: (data) => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.click();

            fileInput.onchange = () => {
              const file = fileInput.files?.[0];
              if (!file) return;

              const reader = new FileReader();
              reader.onload = () => {
                this.messages.push({
                  text: `
                    <b>Identity Submitted:</b><br>
                    ${data.fullName}<br>
                    <img src="${reader.result}" width="140"/><br>
                    <i>(awaiting verification by finder)</i>
                  `,
                  sender: 'user',
                  time: new Date().toLocaleTimeString()
                });

                this.identityConfirmed = true;
              };
              reader.readAsDataURL(file);
            };
          }
        }
      ]
    });

    await alertBox.present();
  }

  // 📸 Pick multiple images for sending
  pickImage() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true;
    fileInput.click();

    fileInput.onchange = () => {
      const files = fileInput.files;
      if (files) {
        for (let i = 0; i < files.length; i++) {
          this.addImage(files[i]);
        }
      }
    };
  }

  addImage(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.selectedImages.push(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  removeImage(index: number) {
    this.selectedImages.splice(index, 1);
  }

  // ✉️ Sending message
  sendMessage() {
    if (!this.identityConfirmed) {
      this.showToast('Please confirm your identity first.');
      return;
    }

    if (!this.chatText && this.selectedImages.length === 0) return;

    if (this.chatText.trim()) {
      this.messages.push({
        text: this.chatText,
        sender: 'user',
        time: new Date().toLocaleTimeString()
      });
    }

    if (this.selectedImages.length > 0) {
      for (const img of this.selectedImages) {
        this.messages.push({
          text: `<img src="${img}" class="sent-image"/>`,
          sender: 'user',
          time: new Date().toLocaleTimeString()
        });
      }
    }

    this.chatText = '';
    this.selectedImages = [];
  }

  // 🔐 Finder validates identity of claimer
  confirmClaimerIdentity() {
    this.claimerValidated = true;

    this.messages.push({
      text: `<b>Claimer Identity Verified ✅</b><br>You may now proceed to handover.`,
      sender: 'other',
      time: new Date().toLocaleTimeString()
    });
  }

  // 🔑 Step 3 – Handover Verification
  async startHandoverValidation() {
    const claimerCode = Math.floor(1000 + Math.random() * 9000).toString();
    const finderCode = Math.floor(1000 + Math.random() * 9000).toString();

    const myCode = this.userRole === 'claimer' ? claimerCode : finderCode;
    const otherCode = this.userRole === 'claimer' ? finderCode : claimerCode;

    const alertBox = await this.alertCtrl.create({
      header:
        this.userRole === 'claimer' ? 'Confirm Reception' : 'Confirm Handover',
      message: `
        <div style="text-align:center">
          <b>Your 4-digit code:</b><br>
          <h2 style="color:#00bfff;letter-spacing:4px">${myCode}</h2>
          <p>Ask the other person for their 4-digit code and enter it below:</p>
        </div>
      `,
      inputs: [
        { name: 'd1', type: 'number', placeholder: '*' },
        { name: 'd2', type: 'number', placeholder: '*' },
        { name: 'd3', type: 'number', placeholder: '*' },
        { name: 'd4', type: 'number', placeholder: '*' }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Submit',
          handler: (data) => {
            const inputCode =
              (data.d1 ?? '') +
              (data.d2 ?? '') +
              (data.d3 ?? '') +
              (data.d4 ?? '');

            if (inputCode === otherCode) {
              this.itemData.status = 'Claimed';

              this.messages.push({
                text: `<b>🎉 Handover Successful!</b><br>Item is now marked as <b>Claimed</b>.`,
                sender: 'system',
                time: new Date().toLocaleTimeString()
              });
            } else {
              this.showCodeError();
            }
          }
        }
      ]
    });

    await alertBox.present();
  }

  // ❌ Code mismatch
  async showCodeError() {
    const alertBox = await this.alertCtrl.create({
      header: 'Incorrect Code',
      message: 'The code entered does not match. Please try again.',
      buttons: ['OK']
    });
    await alertBox.present();
  }

  // ℹ️ Toast-like notice
  async showToast(message: string) {
    const alertBox = await this.alertCtrl.create({
      header: 'Notice',
      message,
      buttons: ['OK']
    });
    await alertBox.present();
  }
}
