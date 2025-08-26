import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { SharedService } from 'app/services/shared.service';
@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent {
  @Input() srcUrl;
  @Input() mediaGuid;
  @Input() mediaFileName;

  base64Image: any;

  constructor(private http: HttpClient,private sharedService: SharedService) {}
  originalZoom = 1;
  zoomLevel = this.originalZoom;
  cursorStyle = 'grab';
  isDragging = false;
  dragStartX = 0;
  dragStartY = 0;
  imageX = 0;
  imageY = 0;

  zoomIn() {
    this.zoomLevel += 0.1;
  }

  zoomOut() {
    if (this.zoomLevel > this.originalZoom) {
      this.zoomLevel -= 0.1;
    }
    // if (this.zoomLevel > 0.1) {
    //   this.zoomLevel -= 0.1;
    // }
  }

  onImageDragStart(event: MouseEvent) {
    this.isDragging = true;
    this.dragStartX = event.clientX - this.imageX;
    this.dragStartY = event.clientY - this.imageY;
    this.cursorStyle = 'grabbing';
  }

  onImageDragEnd(event: MouseEvent) {
    this.isDragging = false;
    this.cursorStyle = 'grab';
  }

  onImageDrag(event: MouseEvent) {
    if (this.isDragging) {
      this.imageX = event.clientX - this.dragStartX;
      this.imageY = event.clientY - this.dragStartY;
    }
  }

  downloadImageById(mediaGuid,mediaFileName){
    const imgName = mediaFileName;
    this.sharedService.downloadImage(mediaGuid).subscribe((res:any) =>{
      const file = new Blob([res], {type: res.type});
      const blob = window.URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = blob;
        link.download = imgName;

        // Version link.click() to work at firefox
        link.dispatchEvent(new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        }));

        setTimeout(() => { // firefox
          window.URL.revokeObjectURL(blob);
          link.remove();
        }, 100);
      
    })
  }
  onMouseWheel(event: WheelEvent) {
    event.preventDefault();
    if (event.deltaY < 0) {
      this.zoomIn();
    } else {
      this.zoomOut();
    }
  }

  resetZoom() {
    this.zoomLevel = this.originalZoom;
    this.imageX = 0;
    this.imageY = 0;
  }

  

}
