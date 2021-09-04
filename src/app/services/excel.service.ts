import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor() {}
  public exportAsExcelFile(json: any, start_date: string, end_date: string) {
    let overview = json.overview;
    let products = json.product;
    let summary = json.summary;

    const workbook = new Workbook();
    workbook.creator = 'Marine Parts Website';
    workbook.lastModifiedBy = 'Marine Parts';
    workbook.created = new Date();
    workbook.modified = new Date();
    const worksheet1 = workbook.addWorksheet('overview');

    worksheet1.addRow(['', 'From', 'To', '', '']);
    worksheet1.addRow(['Selected Dates', start_date, end_date, '', '']);
    worksheet1.addRow([]);
    const header = worksheet1.addRow([
      'Product Name',
      'Part Number',
      'In Quantity',
      'Out Quantity',
      'Balance of the Reported Date',
    ]);

    header.eachCell((cell, index) => {
      cell.alignment = { horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      worksheet1.getColumn(index).width = 25;
    });

    for (let i = 0; i < overview.length; ++i) {
      let row = [];
      const prod = products.find((ele: any) => {
        return ele.part_number == overview[i]._id;
      });
      row.push(prod.product_name);
      row.push(overview[i]._id);
      row.push(overview[i].res.in_qty);
      row.push(overview[i].res.out_qty);
      row.push(prod.stock);

      const currRow = worksheet1.addRow(row);
      currRow.eachCell((cell, index) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
      if (prod.stock <= 5) {
        currRow.eachCell((cell, index) => {
          if (index == 5) {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: '00ED7D31' },
              bgColor: { argb: '00ED7D31' },
            };
          }
          cell.font = {
            size: 12,
          };
        });
      }
    }

    const worksheet2 = workbook.addWorksheet('summary of inhouse key out');

    const header2 = worksheet2.addRow([
      'Product Name',
      'Part Number',
      'Out Quantity',
      'Client',
    ]);

    header2.eachCell((cell, index) => {
      cell.alignment = { horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      worksheet2.getColumn(index).width = 25;
    });

    for (let i = 0; i < summary.length; ++i) {
      let row = [];
      const prod = products.find((ele: any) => {
        return ele.part_number == summary[i]._id.part_number;
      });
      row.push(prod.product_name);
      row.push(summary[i]._id.part_number);
      row.push(summary[i].out_qty);
      row.push(summary[i]._id.client);

      const currRow = worksheet2.addRow(row);
      currRow.eachCell((cell, index) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    }

    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], { type: EXCEL_TYPE });
      fs.saveAs(blob, 'report' + EXCEL_EXTENSION);
    });
  }
}
