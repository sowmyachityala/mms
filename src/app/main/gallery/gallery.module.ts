import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GalleryRoutes } from './gallery.routing';
import { SharedModule } from 'app/shared/shared.module';
import { GalleryComponent } from './main-gallery/gallery.component';
import { ThumbComponent } from './image_thumb/thumb.component';
import { PreviewComponent } from './image_preview/preview.component';
import { UploadImageComponent } from './image_upload/upload-image.component';
import { SafePipeModule } from 'safe-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgDragDropModule } from 'ng-drag-drop';

@NgModule({
  declarations: [
    GalleryComponent,
    ThumbComponent,
    PreviewComponent,
    UploadImageComponent,    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(GalleryRoutes),
    SharedModule,
    SafePipeModule,
    NgxPaginationModule,
  ]
})
export class GalleryModule { }
