import { Component } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';

@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.css']
})
export class WebcamComponent {
  public showWebcam: boolean = false;

  handleImage(webcamImage: WebcamImage) {
    console.info('received webcam image', webcamImage);
  }

  toggleWebcam() {
    this.showWebcam = !this.showWebcam;
  }
}
