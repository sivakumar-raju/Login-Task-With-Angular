import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';
import { tap, switchMap, catchError } from 'rxjs/operators';
import { ItemsService, Item } from '../../../services/items.service';

export interface ListState {
  items: Item[];
  loading: boolean;
  error: string | null;
}

@Injectable()
export class ListStore extends ComponentStore<ListState> {
  constructor(private itemsService: ItemsService) {
    super({
      items: [],
      loading: false,
      error: null
    });
  }

  // Selectors
  readonly items$: Observable<Item[]> = this.select(state => state.items);
  readonly loading$: Observable<boolean> = this.select(state => state.loading);
  readonly error$: Observable<string | null> = this.select(state => state.error);

  // Actions
  readonly loadItems = this.effect((trigger$: Observable<void>) =>
    trigger$.pipe(
      tap(() => this.patchState({ loading: true, error: null })),
      switchMap(() =>
        this.itemsService.getItems().pipe(
          tap(items => this.patchState({ items, loading: false })),
          catchError(error => {
            this.patchState({ 
              loading: false, 
              error: error.message || 'Failed to load items' 
            });
            return [];
          })
        )
      )
    )
  );

  readonly clearError = this.updater((state) => ({
    ...state,
    error: null
  }));
}
