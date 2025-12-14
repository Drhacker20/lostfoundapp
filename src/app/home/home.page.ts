import { Component, ElementRef, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router } from '@angular/router';

// Firebase
import { auth, db } from '../firebase.config';
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, orderBy, onSnapshot } from "firebase/firestore";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit, OnDestroy {

  searchTerm = '';
  selectedType = '';
  selectedLocation = '';
  customType = '';
  customLocation = '';
  showFilters = false;
  showOtherTypeInput = false;
  showOtherLocationInput = false;

  profileImage: string = 'assets/default-avatar.png';

  // ALL ITEMS
  items: any[] = [];

  // GROUPED LISTS
  last7Days: any[] = [];
  olderThan7Days: any[] = [];

  // FILTERED OUTPUTS
  filteredItems: any[] = [];
  last7DaysItems: any[] = [];
  olderItems: any[] = [];

  private unsubscribeItems: (() => void) | null = null;

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private ngZone: NgZone
  ) {}

  // ====================================
  // ✅ CORRECT ngOnInit (NO queryParams)
  // ====================================
  ngOnInit() {
    this.loadUserProfile();
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

  // ================================
  // 🔹 OPEN ITEM DETAILS
  // ================================
 openItemDetails(item: any) {
  // 🔹 Gamitin ang router state imbes queryParams
  this.router.navigate(['/lost-item-details'], {
    state: { item }  // <-- dito, hindi JSON.stringify
  });
}

  // ================================
  // 🔹 LOAD USER PROFILE PHOTO
  // ================================
  private async loadUserProfile() {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        this.router.navigateByUrl('/login', { replaceUrl: true });
        return;
      }

      if (user.photoURL) {
        this.profileImage = user.photoURL;
      } else {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data()['photoURL']) {
          this.profileImage = userDoc.data()['photoURL'];
        }
      }
    });
  }

  // ================================
  // 🔥 LOAD ITEMS FROM FIRESTORE
  // ================================
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

          // Add daysAgo
          this.items = this.items.map(item => {
            if (item.createdAt?.toDate) {
              const created = item.createdAt.toDate();
              const now = new Date();
              const diffDays = Math.floor(
                (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
              );
              return { ...item, daysAgo: diffDays };
            }
            return { ...item, daysAgo: 0 };
          });

          // Grouping
          this.last7Days = this.items.filter(i => i.daysAgo <= 7);
          this.olderThan7Days = this.items.filter(i => i.daysAgo > 7);

          this.filterItems();
        });
      },
      (error) => {
        console.error("Error loading Firestore items in real-time:", error);
      }
    );
  }

  // ================================
  // 🔍 FILTER LOGIC
  // ================================
  openFilters() { this.showFilters = true; }

  handleOutsideClick(event: any) {
    const inside =
      this.elementRef.nativeElement.querySelector('.filter-container')?.contains(event.target) ||
      this.elementRef.nativeElement.querySelector('ion-searchbar')?.contains(event.target);

    if (!inside) this.showFilters = false;
  }

  onTypeChange(event: any) {
    this.showOtherTypeInput = event.detail.value === 'others';
    this.filterItems();
  }

  onLocationChange(event: any) {
    this.showOtherLocationInput = event.detail.value === 'others';
    this.filterItems();
  }

  // ================================
  // 🎯 APPLY FILTERS
  // ================================
  filterItems() {
    const filterFn = (item: any) => {
      const searchMatch =
        item.itemName?.toLowerCase().includes(this.searchTerm.toLowerCase());

      const typeMatch = this.selectedType
        ? (this.selectedType === 'others'
            ? item.type?.toLowerCase().includes(this.customType.toLowerCase())
            : item.type === this.selectedType)
        : true;

      const locationMatch = this.selectedLocation
        ? (this.selectedLocation === 'others'
            ? item.location?.toLowerCase().includes(this.customLocation.toLowerCase())
            : item.location === this.selectedLocation)
        : true;

      return searchMatch && typeMatch && locationMatch;
    };

    this.filteredItems = this.items.filter(filterFn);
    this.last7DaysItems = this.last7Days.filter(filterFn);
    this.olderItems = this.olderThan7Days.filter(filterFn);
  }

  // ================================
  // 👤 OPEN PROFILE PAGE
  // ================================
  openProfile() {
    this.router.navigate(['/tabs/profile']);
  }
}
