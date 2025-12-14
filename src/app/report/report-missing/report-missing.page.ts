import { Component } from '@angular/core';

@Component({
  selector: 'app-report-missing',
  templateUrl: './report-missing.page.html',
  styleUrls: ['./report-missing.page.scss'],
  standalone: false
})
export class ReportMissingPage {

  selectedSegment: string = 'unclaimed';
  filteredItems: any[] = [];

  // 🧾 Sample dummy data
  items = [
    {
      name: 'Gray Tumbler Bottle',
      location: 'Campus Hall',
      time: '2 hrs ago',
      image: 'assets/sample-item.png',
      status: 'unclaimed'
    },
    {
      name: 'Blue Backpack',
      location: 'Library',
      time: '1 day ago',
      image: 'assets/sample-item.png',
      status: 'claimed'
    },
    {
      name: 'Wrist Watch',
      location: 'Gym Area',
      time: '3 days ago',
      image: 'assets/sample-item.png',
      status: 'unclaimed'
    }
  ];

  preview: string | ArrayBuffer | null = null;

  constructor() {
    this.filterItems();
  }

  // 🧩 Change segment (Unclaimed / Claimed)
  setSegment(segment: string) {
    this.selectedSegment = segment;
    this.filterItems();
  }

  // 🔍 Filter list based on segment
  filterItems() {
    this.filteredItems = this.items.filter(
      item => item.status === this.selectedSegment
    );
  }

  // 📸 File upload logic (for report form)
  triggerUpload() {
    const fileInput = document.getElementById('upload') as HTMLInputElement;
    fileInput?.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => (this.preview = e.target?.result || null);
      reader.readAsDataURL(file);
    }
  }

  submitReport() {
    console.log('Report submitted!');
  }
}
