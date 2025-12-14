import { Component, ViewChild, ElementRef } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db, storage } from '../../firebase.config';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

@Component({
  selector: 'app-add-missing',
  templateUrl: './add-missing.page.html',
  styleUrls: ['./add-missing.page.scss'],
  standalone: false
})
export class AddMissingPage {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  // 🧩 Form fields
  itemName = '';
  selectedType = '';
  otherType = '';
  selectedLocation = '';
  otherLocation = '';
  description = '';
  photo: string | null = null; // base64 for preview only

  // 🕒 DateTime picker
  showPicker = false;
  selectedDateTime = new Date().toISOString();
  formattedDate = '';
  formattedTime = '';

  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) {}

  // 📅 Date picker functions
  togglePicker() {
    this.showPicker = !this.showPicker;
  }

  closePicker() {
    this.showPicker = false;
  }

  updateDateTime() {
    const date = new Date(this.selectedDateTime);
    this.formattedDate = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    this.formattedTime = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // 📸 Photo upload
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => (this.photo = reader.result as string);
      reader.readAsDataURL(file); // preview only
    }
  }

  // 🔙 Back button
  goBack() {
    window.history.back();
  }

  // 🧹 Clear inputs
  cancel() {
    this.itemName = '';
    this.selectedType = '';
    this.otherType = '';
    this.selectedLocation = '';
    this.otherLocation = '';
    this.description = '';
    this.photo = null;
    this.selectedDateTime = new Date().toISOString();
    this.formattedDate = '';
    this.formattedTime = '';
    this.showPicker = false;

    const toast = document.createElement('ion-toast');
    toast.message = 'Form cleared';
    toast.duration = 1500;
    toast.color = 'medium';
    document.body.appendChild(toast);
    toast.present();
  }

  // 💾 Submit to Firestore with Firebase Storage
async submit() {
  const typeToSave =
    this.selectedType === 'others' ? this.otherType : this.selectedType;
  const locationToSave =
    this.selectedLocation === 'others' ? this.otherLocation : this.selectedLocation;

  if (!this.itemName || !typeToSave || !locationToSave) {
    const alert = await this.alertCtrl.create({
      header: 'Missing Information',
      message: 'Please fill in all required fields.',
      buttons: ['OK']
    });
    await alert.present();
    return;
  }

  try {
    // ✅ Upload photo to Firebase Storage (if exists)
    let photoURL = '';
    if (this.photo) {
      const storageRef = ref(storage, `missingItems/${Date.now()}_${this.itemName}.png`);
      await uploadString(storageRef, this.photo, 'data_url'); // base64 to storage
      photoURL = await getDownloadURL(storageRef); // get URL to store in Firestore
    }

    // 🧠 Prepare data to save
    const reportData = {
  itemName: this.itemName,
  type: typeToSave,
  location: locationToSave,
  description: this.description,
  photo: photoURL,
  date: this.formattedDate,
  time: this.formattedTime,
  createdAt: serverTimestamp(),
  uid: auth.currentUser?.uid || null,

  // ✅ Add this:
  reportedBy: auth.currentUser?.displayName || auth.currentUser?.email || "Unknown",

  status: 'pending'
};


    // 🔥 Save to Firestore
    await addDoc(collection(db, 'missingItems'), reportData);

    // ✅ Success alert (popover-style)
    const successAlert = await this.alertCtrl.create({
      header: 'Success',
      message: 'Lost item reported successfully!',
      buttons: ['OK']
    });
    await successAlert.present();

    // Reset the form after confirmation
    this.cancel();

  } catch (error) {
    console.error('Error saving report:', error);

    // ❌ Error alert (popover-style)
    const errorAlert = await this.alertCtrl.create({
      header: 'Error',
      message: 'Something went wrong while saving your report. Please try again.',
      buttons: ['OK']
    });
    await errorAlert.present();
  }
}


  // 🧭 Type/location logic
  onTypeChange() {
    if (this.selectedType !== 'others') {
      this.otherType = '';
    }
  }

  onLocationChange() {
    if (this.selectedLocation !== 'others') {
      this.otherLocation = '';
    }
  }
}
