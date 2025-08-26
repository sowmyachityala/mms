import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import  JSMpeg from 'jsmpeg-player';
import { WebcamImage } from 'ngx-webcam';
@Component({
  selector: 'app-videostream',
  templateUrl: './videostream.component.html',
  styleUrls: ['./videostream.component.css']
})
export class VideostreamComponent implements OnInit {
  @ViewChild('videoCanvas', { static: true }) videoCanvasRef!: ElementRef;
  constructor() {}
  public showWebcam: boolean = false;

  handleImage(webcamImage: WebcamImage) {
    console.info('received webcam image', webcamImage);
  }

  toggleWebcam() {
    this.showWebcam = !this.showWebcam;
  };

  ngOnInit() {  
    let player = new JSMpeg.Player('ws://localhost:9999', {
    //let player = new JSMpeg.Player('ws://192.168.10.33:9999', {
    canvas: this.videoCanvasRef.nativeElement, 
    autoplay: true, 
    audio: false, 
    loop: true
    }) 
  }

 // ngOnDestroy() {
   /// if (this.player) {
    //  this.player.destroy(); // Clean up the player on component destruction
   // }
 // }

}
