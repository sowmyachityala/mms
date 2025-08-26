import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { environment } from 'environments/environment';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-excel-data',
    templateUrl: './excel-data.component.html',
    styleUrl: './excel-data.component.scss',
})
export class ExcelDataComponent implements OnInit {
    excelData: any[][];
    sampleExcel: string = environment.imageEndPoints.sampleExcel;

    constructor(
        public dialogRef: MatDialogRef<ExcelDataComponent>,
        private httpClient: HttpClient
    ) {}

    ngOnInit(): void {
        this.loadExcelData();
    }

    onClose() {
        this.dialogRef.close();
    }

    loadExcelData() {
        const excelFilePath = this.sampleExcel;
        this.httpClient
            .get(excelFilePath, { responseType: 'blob' })
            .subscribe((res: Blob) => {
                const fileReader = new FileReader();
                fileReader.onload = (event: any) => {
                    const data = new Uint8Array(event.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    this.excelData = XLSX.utils.sheet_to_json(worksheet, {
                        header: 1,
                    });
                };
                fileReader.readAsArrayBuffer(res);
            });
    }

    updateCellData(value: string, rowIndex: number, colIndex: number) {
        this.excelData[rowIndex][colIndex] = value;
    }

    exportToExcel() {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(this.excelData);
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'updated_data.xlsx');
    }
}
