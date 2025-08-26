import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({
    providedIn: 'root',
})
export class ExcelService {
    constructor() {}
    // exportToExcel(data: any[], fileName: string, sheetName: string): void {
    //   const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    //   const workbook: XLSX.WorkBook = { Sheets: { [sheetName]: worksheet }, SheetNames: [sheetName] };
    //   const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //   this.saveExcelFile(excelBuffer, fileName);
    // }

    // private saveExcelFile(buffer: any, fileName: string): void {
    //   const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    //   saveAs(data, fileName + '_export_' + new Date().getTime() + '.xlsx');
    // }

    exportToExcel(
        data: any[],
        headers: string[],
        fileName: string,
        sheetName: string
    ): void {
        // Create worksheet with translated headers
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data, {
            header: headers,
        });

        // Create workbook and add the worksheet
        const workbook: XLSX.WorkBook = {
            Sheets: { [sheetName]: worksheet },
            SheetNames: [sheetName],
        };

        // Convert workbook to binary array and save as Excel file
        const excelBuffer: any = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
        });
        this.saveExcelFile(excelBuffer, fileName);
    }

    private saveExcelFile(buffer: any, fileName: string): void {
        // Convert buffer to Blob and save the file using file-saver library
        const data: Blob = new Blob([buffer], {
            type: 'application/octet-stream',
        });
        saveAs(data, fileName + '_export_' + new Date().getTime() + '.xlsx');
    }
}
