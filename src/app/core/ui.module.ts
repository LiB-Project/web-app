import { ReactiveFormsModule } from '@angular/forms';
import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import { LayoutModule } from '@angular/cdk/layout';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatExpansionModule} from '@angular/material/expansion';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';
import {MatDialogModule} from '@angular/material/dialog';
import {MatChipsModule} from '@angular/material/chips';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { ToastrModule } from 'ngx-toastr';
import {MatPaginatorModule, MatPaginatorIntl} from '@angular/material/paginator';
import { MatPaginatorIntlCro } from './util/paginator-util';
import {MatTabsModule} from '@angular/material/tabs';
import { LoaderComponent } from './util/loader/loader.component';
import {MatSliderModule} from '@angular/material/slider';
import { Ng5SliderModule } from 'ng5-slider';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import {MatBadgeModule} from '@angular/material/badge';

@NgModule({
  declarations: [LoaderComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatDividerModule,
    MatDialogModule,
    MatChipsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatAutocompleteModule,
    ToastrModule.forRoot(),
    MatPaginatorModule,
    MatTabsModule,
    MatSliderModule,
    Ng5SliderModule,
    MaterialFileInputModule,
    MatBadgeModule
  ],
  exports: [
    ReactiveFormsModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatDividerModule,
    MatDialogModule,
    MatChipsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatAutocompleteModule,
    ToastrModule,
    MatPaginatorModule,
    MatTabsModule,
    LoaderComponent,
    MatSliderModule,
    Ng5SliderModule,
    MaterialFileInputModule,
    MatBadgeModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro}
  ]
})
export class UiModule { }
