import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-lost-item-details',
  templateUrl: './lost-item-details.page.html',
  styleUrls: ['./lost-item-details.page.scss'],
  standalone: false
})
export class LostItemDetailsPage implements OnInit {
  item: any;

  constructor(private navCtrl: NavController) {}

  ngOnInit() {
    // 🔹 Get the item data from router state
    const nav = history.state;

    if (nav && nav.item) {
      const raw = nav.item;

      // 🔄 Map Firestore fields → item fields used in HTML
      this.item = {
        ...raw,
        image: raw.photo,          // photo → image
        name: raw.itemName,        // itemName → name
        dateFound: raw.date,       // date → dateFound
        timeFound: raw.time,       // time → timeFound

        // keep other fields as-is
        location: raw.location,
        type: raw.type,
        status: raw.status,
        description: raw.description,
        reportedBy: raw.reportedBy
      };
    } else {
      console.warn("No item data passed via router state!");
    }
  }

  goBack() {
    this.navCtrl.back();
  }

  // 👉 Claim item
 // 👉 Claim item
claimItem() {
  if (!this.item) return;

  this.navCtrl.navigateForward('/chat-view', {
    state: {
      chatName: this.item?.reportedBy || "Reporter",
      itemId: this.item?.id,
      finderId: this.item?.finderId,
      reportedById: this.item?.reportedById,   // IMPORTANT
      item: this.item
    }
  });
}

}
