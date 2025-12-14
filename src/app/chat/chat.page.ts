import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-conversations',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: false
})
export class ChatPage {
  constructor(private navCtrl: NavController) {}

  searchQuery: string = '';

  chats = [
    {
      name: '(Unverified Identity)',
      message: 'Hello, did you find the gray Tupperware bottle?',
      time: '13:50',
      avatar: 'assets/default-avatar.png',
    },
    {
      name: 'Clarence Valdez',
      message: 'Thank you!',
      time: '3 days ago',
      avatar: 'assets/default-avatar.png',
    },
    {
      name: 'Lester Esguerra',
      message: 'I left my wallet at the gym.',
      time: 'Yesterday',
      avatar: 'assets/default-avatar.png',
    },
  ];

  filteredItems = [...this.chats];

  filterChats() {
    const query = this.searchQuery.toLowerCase().trim();
    if (query === '') {
      this.filteredItems = [...this.chats];
    } else {
      this.filteredItems = this.chats.filter(chat =>
        chat.name.toLowerCase().includes(query)
      );
    }
  }

  // 🟦 When a chat is clicked
  openChat(chat: any) {
    this.navCtrl.navigateForward('/chat-view', {
      state: { chatName: chat.name }  // Pass chat name
    });
  }
}
