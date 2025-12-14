import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { auth, db } from '../firebase.config';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit, OnDestroy {

  profileImage: string = 'assets/default-avatar.png';
  userName: string = '';
  email: string = '';
  joined: string = '';
  passwordType1: string = 'password';
  passwordType2: string = 'password';

  private unsubscribeUserDoc: (() => void) | null = null;

  constructor(
    private ngZone: NgZone,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        this.email = user.email || '';
        this.profileImage = user.photoURL || 'assets/default-avatar.png';

        const userDocRef = doc(db, 'users', user.uid);
        this.unsubscribeUserDoc = onSnapshot(userDocRef, (snapshot) => {
          this.ngZone.run(() => {
            if (snapshot.exists()) {
              const userData = snapshot.data() as any;
              const firstName = userData.firstName || '';
              const lastName = userData.lastName || '';
              this.userName = `${firstName} ${lastName}`.trim() || 'User';

              this.profileImage = userData.photoURL || this.profileImage;
              this.email = userData.email || user.email || '';

              if (userData.createdAt) {
                const createdAt = userData.createdAt.toDate
                  ? userData.createdAt.toDate()
                  : new Date(userData.createdAt);
                this.joined = this.formatJoinDate(createdAt);
              } else {
                this.joined = this.formatJoinDate(
                  user.metadata.creationTime
                    ? new Date(user.metadata.creationTime)
                    : new Date()
                );
              }
            } else {
              this.userName = user.displayName || 'User';
              this.joined = this.formatJoinDate(
                user.metadata.creationTime
                  ? new Date(user.metadata.creationTime)
                  : new Date()
              );
            }

            const img = document.getElementById('profilePreview') as HTMLImageElement;
            if (img) img.src = this.profileImage;
          });
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.unsubscribeUserDoc) this.unsubscribeUserDoc();
  }

  private formatJoinDate(date: Date): string {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 0
      ? 'Today'
      : diffDays === 1
      ? '1 day ago'
      : `${diffDays} days ago`;
  }

  togglePassword(field: number) {
    if (field === 1) this.passwordType1 = this.passwordType1 === 'password' ? 'text' : 'password';
    else if (field === 2) this.passwordType2 = this.passwordType2 === 'password' ? 'text' : 'password';
  }

  openFilePicker() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) fileInput.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result as string;
        const imgElement = document.getElementById('profilePreview') as HTMLImageElement;
        if (imgElement) imgElement.src = this.profileImage;
      };
      reader.readAsDataURL(file);
    }
  }

  // ==============================
  // 🔹 SIGN OUT FUNCTION
  // ==============================
  async signOutUser() {
    const loading = await this.loadingCtrl.create({
      message: 'Signing out...',
      spinner: 'circles',
      duration: 2000
    });
    await loading.present();

    loading.onDidDismiss().then(async () => {
      try {
        await signOut(auth);
        this.router.navigate(['/login']);
      } catch (error) {
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: 'Failed to sign out. Please try again.',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }
}
