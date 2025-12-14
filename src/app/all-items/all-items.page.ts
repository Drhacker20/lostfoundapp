import { Component, ElementRef, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { auth, db } from '../firebase.config';
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

@Component({
  selector: 'app-all-items',
  templateUrl: './all-items.page.html',
  styleUrls: ['./all-items.page.scss'],
  standalone: false
})
export class AllItemsPage implements OnInit, OnDestroy {

  selectedSegment = 'today';
  items: any[] = [];
  filteredItems: any[] = [];
  last7Days: any[] = [];
  moreThan7Days: any[] = [];

  private unsubscribeItems: (() => void) | null = null;

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.loadItemsFromFirestore();
  }

  ngOnDestroy() {
    if (this.unsubscribeItems) this.unsubscribeItems();
  }

  // ================================
  // 🔹 TYPE ICONS
  // ================================
  typeIcons: { [key: string]: string } = {
    electronics: 'phone-portrait-outline',
    jewelry: 'diamond-outline',
    keys: 'key-outline',
    clothing: 'shirt-outline',
    others: 'cube-outline'
  };

  getTypeIcon(type: string) {
    return this.typeIcons[type?.toLowerCase()] || 'cube-outline';
  }

  // ==============================
  // 🔥 LOAD ITEMS FROM FIRESTORE
  // ==============================
  loadItemsFromFirestore() {
    const itemsRef = collection(db, "missingItems");
    const q = query(itemsRef, orderBy("createdAt", "desc"));

    this.unsubscribeItems = onSnapshot(
      q,
      (querySnapshot) => {
        this.ngZone.run(() => {
          this.items = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          // Compute daysAgo safely
          this.items = this.items.map(item => {
            let diffDays = 0;
            if (item.createdAt?.toDate && typeof item.createdAt.toDate === 'function') {
              const created = item.createdAt.toDate();
              const now = new Date();
              diffDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
            }
            return { ...item, daysAgo: diffDays };
          });

          // Group items
          this.last7Days = this.items.filter(i => i.daysAgo <= 7);
          this.moreThan7Days = this.items.filter(i => i.daysAgo > 7);

          this.filterItems();
        });
      },
      (error) => console.error("Error loading Firestore items:", error)
    );
  }

  // ==============================
  // 🔹 SEGMENT SWITCH
  // ==============================
  changeSegment(segment: string) {
    this.selectedSegment = segment;
    this.filterItems();
  }

  // ==============================
  // 🔹 FILTER ITEMS BASED ON SEGMENT
  // ==============================
  filterItems() {
    switch(this.selectedSegment) {
      case 'today':
        this.filteredItems = this.items.filter(i => i.daysAgo === 0);
        break;
      case '7days':
        this.filteredItems = this.last7Days.filter(i => i.daysAgo > 0);
        break;
      case 'morethan7':
        this.filteredItems = this.moreThan7Days;
        break;
    }
  }

  // ==============================
  // 🔹 OPEN ITEM DETAILS WITH DATA
  // ==============================
openItemDetails(item: any) {
  // 🔹 Gamitin ang router state imbes queryParams
  this.router.navigate(['/lost-item-details'], {
    state: { item }  // <-- dito, hindi JSON.stringify
  });
}



  // ==============================
  // 🔹 GO BACK
  // ==============================
  goBack() {
    this.router.navigate(['/tabs/home']);
  }
}
