import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-qrcode-print',
  templateUrl: './qrcode-print.component.html',
  styleUrls: ['./qrcode-print.component.scss']
})
export class QrcodePrintComponent implements OnInit {
  eventGuId
  constructor(@Inject(MAT_DIALOG_DATA) public data, public printDialogRef: MatDialogRef<QrcodePrintComponent>) { }

  ngOnInit(): void {
    if (this.data?.eventGuId) {
      this.eventGuId = this.data?.eventGuId;
      setTimeout(() => {
        window.print();
        this.printDialogRef.close();
      }, 500);

    }
  }
}
