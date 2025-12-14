import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false
})
export class TabsPage {
  selectedTab: string = 'home'; // default

  setSelectedTab(tab: string) {
    this.selectedTab = tab;
  }

  getActiveLinePosition() {
    const index = ['home', 'report', 'chat', 'profile'].indexOf(this.selectedTab);
    return `translateX(${index * 100}%)`;
  }
}
