import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // Default route redirects to tabs/home
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full'
  },

  // Tabs parent (with bottom navigation)
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },

  // Authentication pages
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then(m => m.SignupPageModule)
  },

  // Report-related pages
  {
    path: 'report-missing',
    loadChildren: () => import('./report/report-missing/report-missing.module').then(m => m.ReportMissingPageModule)
  },
  {
  path: 'add-missing',
  loadChildren: () => import('./report/add-missing/add-missing.module').then(m => m.AddMissingPageModule)
},

  // Standalone pages (not inside tabs)
  {
    path: 'item-details',
    loadChildren: () => import('./item-details/item-details.module').then(m => m.ItemDetailsPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then(m => m.NotificationsPageModule)
  },
  {
    path: 'all-items',
    loadChildren: () => import('./all-items/all-items.module').then(m => m.AllItemsPageModule)
  },

  // Direct access pages (optional — usually under tabs)
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then(m => m.ChatPageModule)
  },
  {
  path: 'chat-view',
  loadChildren: () => import('./chat/chat-view/chat-view.module').then(m => m.ChatViewPageModule)
},
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'lost-item-details',
    loadChildren: () => import('./lost-item-details/lost-item-details.module').then( m => m.LostItemDetailsPageModule)
  },
  {
    path: 'add-missing',
    loadChildren: () => import('./report/add-missing/add-missing.module').then( m => m.AddMissingPageModule)
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
