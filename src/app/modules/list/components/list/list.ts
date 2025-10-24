import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { AuthService } from '../../../../services/auth.service';
import { ListStore } from '../../services/list.store';
import { Item } from '../../../../services/items.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatListModule,
    MatDividerModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [ListStore],
  templateUrl: './list.html',
  styleUrl: './list.scss',
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ListComponent implements OnInit {
  items$!: Observable<Item[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;
  filteredItems: Item[] = [];
  
  // Search and filter properties
  searchTerm = '';
  selectedCategory = '';
  viewMode: 'grid' | 'list' = 'grid';
  
  // Categories for filtering
  categories = ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools'];
  
  // Search subject for debouncing
  private searchSubject = new BehaviorSubject<string>('');

  constructor(
    private listStore: ListStore,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.items$ = this.listStore.items$;
    this.loading$ = this.listStore.loading$;
    this.error$ = this.listStore.error$;
    
    // Set up search with debouncing
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.filterItems();
    });
    
    // Subscribe to items changes to update filtered items
    this.items$.subscribe(items => {
      this.filterItems();
    });
    
    this.loadItems();
  }

  loadItems(): void {
    this.listStore.loadItems();
  }

  logout(): void {
    this.authService.logout();
    this.snackBar.open('Logged out successfully!', 'Close', { duration: 3000 });
    this.router.navigate(['/login']);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  trackByItemId(index: number, item: Item): number {
    return item.id;
  }

  // Search and filter methods
  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
  }

  filterByCategory(category: string): void {
    this.selectedCategory = this.selectedCategory === category ? '' : category;
    this.filterItems();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.filterItems();
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  private filterItems(): void {
    this.items$.pipe(
      map(items => {
        if (!items) return [];
        
        return items.filter(item => {
          const matchesSearch = !this.searchTerm || 
            item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(this.searchTerm.toLowerCase());
          
          const matchesCategory = !this.selectedCategory || 
            this.getItemCategory(item.name) === this.selectedCategory;
          
          return matchesSearch && matchesCategory;
        });
      })
    ).subscribe(filtered => {
      this.filteredItems = filtered;
    });
  }

  // Helper methods for item categorization and icons
  getItemCategory(itemName: string): string {
    const name = itemName.toLowerCase();
    if (name.includes('angular') || name.includes('rxjs') || name.includes('typescript')) {
      return 'Frontend';
    } else if (name.includes('node') || name.includes('express')) {
      return 'Backend';
    } else if (name.includes('mongo')) {
      return 'Database';
    } else if (name.includes('docker') || name.includes('kubernetes')) {
      return 'DevOps';
    } else {
      return 'Tools';
    }
  }

  getItemIcon(itemName: string): string {
    const name = itemName.toLowerCase();
    if (name.includes('angular')) return 'web';
    if (name.includes('rxjs')) return 'timeline';
    if (name.includes('typescript')) return 'code';
    if (name.includes('node')) return 'memory';
    if (name.includes('express')) return 'api';
    if (name.includes('mongo')) return 'storage';
    if (name.includes('docker')) return 'inbox';
    if (name.includes('kubernetes')) return 'account_tree';
    return 'extension';
  }
}
