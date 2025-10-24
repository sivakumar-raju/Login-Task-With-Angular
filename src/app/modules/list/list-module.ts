import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListRoutingModule } from './list-routing-module';
import { ListComponent } from './components/list/list';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ListRoutingModule,
    ListComponent
  ]
})
export class ListModule { }
