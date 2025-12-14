import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { auth } from '../firebase.config';
import { signInWithEmailAndPassword } from 'firebase/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  passwordType: string = 'password';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertCtrl: AlertController,
    private sanitizer: DomSanitizer,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  togglePassword() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }

  // ==============================
  // 🔹 LOGIN FUNCTION WITH IONIC LOADING
  // ==============================
  async onLogin() {
    if (this.loginForm.invalid) {
      await this.showAlert('Warning', 'Please fill in all fields correctly.', 'warning');
      return;
    }

    const { email, password } = this.loginForm.value;

    // Show native Ionic loading
    const loading = await this.loadingCtrl.create({
      message: 'Logging in...',
      spinner: 'circles',
      backdropDismiss: false
    });
    await loading.present();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      await loading.dismiss();

      const successAlert = await this.alertCtrl.create({
        header: 'Success',
        message: 'Login successful! Redirecting...',
        buttons: ['OK'],
      });
      await successAlert.present();
      successAlert.onDidDismiss().then(() => {
        this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
      });
    } catch (error: any) {
      await loading.dismiss();
      const message = this.getFirebaseErrorMessage(error.code);
      await this.showAlert('Error', message, 'danger');
    }
  }

  getFirebaseErrorMessage(code: string): string {
    switch (code) {
      case 'auth/invalid-email': return 'Invalid email format.';
      case 'auth/user-disabled': return 'This account has been disabled.';
      case 'auth/user-not-found': return 'No account found for this email.';
      case 'auth/wrong-password': return 'Incorrect password. Try again.';
      default: return 'Login failed. Please try again.';
    }
  }

  private async showAlert(header: string, message: string, color?: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
      cssClass: color ? `${color}-alert` : '',
    });
    await alert.present();
  }
}
