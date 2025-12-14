import { Component, OnInit, OnDestroy } from '@angular/core';
import { Keyboard } from '@capacitor/keyboard';
import { Platform } from '@ionic/angular';

// ✅ Use shared Firebase config instead of reinitializing
import { auth, db, storage } from '../firebase.config';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false,
})
export class SignupPage implements OnInit, OnDestroy {
  passwordType1: string = 'password';
  passwordType2: string = 'password';

  firstName: string = '';
  lastName: string = '';
  email: string = '';
  role: string = '';
  password: string = '';
  confirmPassword: string = '';
  selectedFile: File | null = null;

  private keyboardListeners: any[] = [];

  constructor(private platform: Platform) {}

  ngOnInit() {
    document.body.style.height = '100vh';
    document.body.style.overflow = 'hidden';

    const ionApp = document.querySelector('ion-app') as HTMLElement;
    if (ionApp) ionApp.style.height = '100vh';

    this.keyboardListeners.push(
      Keyboard.addListener('keyboardWillShow', () => {
        document.body.style.overflow = 'hidden';
      }),
      Keyboard.addListener('keyboardWillHide', () => {
        document.body.style.overflow = '';
      })
    );
  }

  ngOnDestroy() {
    this.keyboardListeners.forEach((listener) => listener.remove());
  }

  togglePassword(index: number) {
    if (index === 1) {
      this.passwordType1 =
        this.passwordType1 === 'password' ? 'text' : 'password';
    } else if (index === 2) {
      this.passwordType2 =
        this.passwordType2 === 'password' ? 'text' : 'password';
    }
  }

  openFilePicker() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) fileInput.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = document.getElementById('profilePreview') as HTMLImageElement;
        if (img) img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // ✅ FORM VALIDATION
  private validateInputs(): boolean {
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[\w.%+-]+@(gmail|yahoo|outlook)\.com$/i;

    if (
      !this.firstName.trim() ||
      !this.lastName.trim() ||
      !this.email.trim() ||
      !this.role ||
      !this.password.trim() ||
      !this.confirmPassword.trim()
    ) {
      alert('⚠️ All fields are required!');
      return false;
    }

    if (!nameRegex.test(this.firstName) || !nameRegex.test(this.lastName)) {
      alert('⚠️ Name should only contain letters.');
      return false;
    }

    if (!emailRegex.test(this.email)) {
      alert(
        '⚠️ Invalid email format. Must be a Gmail, Yahoo, or Outlook address.'
      );
      return false;
    }

    if (!this.selectedFile) {
      alert('⚠️ Please upload a profile photo.');
      return false;
    }

    if (this.password.length < 6) {
      alert('⚠️ Password must be at least 6 characters.');
      return false;
    }

    if (this.password !== this.confirmPassword) {
      alert('⚠️ Passwords do not match.');
      return false;
    }

    return true;
  }


 // ✅ SIGNUP HANDLER
async signUp() {
  if (!this.validateInputs()) return;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      this.email,
      this.password
    );
    const user = userCredential.user;

    // 🔹 Handle profile photo upload
    let photoURL = 'assets/default-avatar.png';
    if (this.selectedFile) {
      const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);
      await uploadBytes(storageRef, this.selectedFile);
      photoURL = await getDownloadURL(storageRef);
    }

    // 🔹 Update Firebase Auth profile
    await updateProfile(user, {
      displayName: `${this.firstName} ${this.lastName}`,
      photoURL: photoURL,
    });

    // 🔹 Save user info to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      role: this.role,
      photoURL: photoURL,
      // ⚠️ For emulator/testing only – don't use in production
      password: this.password,
      createdAt: new Date(),
    });

    alert('✅ Account created successfully!');
    console.log('User saved:', user.uid);
  } catch (error: any) {
    console.error('Signup error:', error);
    alert('❌ Signup failed: ' + error.message);
  }
}

}
