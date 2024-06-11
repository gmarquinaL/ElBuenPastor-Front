import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';

export async function exportPaymentsToExcel(payments, logoBase64) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Payments');

  // logo
  const imageId = workbook.addImage({
    base64: logoBase64,
    extension: 'png',
  });
  worksheet.addImage(imageId, {
    tl: { col: 0, row: 0 },
    ext: { width: 100, height: 100 } 
  });

  // título centrado
  worksheet.mergeCells('C2:G2');
  worksheet.getCell('C2').value = 'Reporte de Pagos';
  worksheet.getCell('C2').alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell('C2').font = { size: 20, bold: true };

  // Ajustar ancho de las columnas necesarias (C-G)
  worksheet.getColumn(3).width = 45; // Columna C
  worksheet.getColumn(4).width = 30; // Columna D
  worksheet.getColumn(5).width = 15; // Columna E
  worksheet.getColumn(6).width = 25; // Columna F
  worksheet.getColumn(7).width = 25; // Columna G

  // Ajustar la altura de las filas
  worksheet.getRow(9).height = 30; // Altura de la fila 9

  // Agregar encabezados a partir de la fila 6, columna C
  worksheet.getCell('C6').value = 'Nombre';
  worksheet.getCell('D6').value = 'Concepto';
  worksheet.getCell('E6').value = 'Monto';
  worksheet.getCell('F6').value = 'Fecha de pago';
  worksheet.getCell('G6').value = 'Fecha de vencimiento';

  // Estilizar encabezados
  ['C6', 'D6', 'E6', 'F6', 'G6'].forEach((header) => {
    const cell = worksheet.getCell(header);
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '005d15' }, 
    };
    cell.font = {
      bold: true,
      size: 14, 
      color: { argb: 'FFFFFFFF' } // Color de letra blanco
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  // Ajustar la altura de los títulos de las columnas para mayor ancho arriba y abajo
  worksheet.getRow(6).height = 35;

  // Agregar datos a partir de la fila 7, columna C
  payments.forEach((payment, index) => {
    worksheet.getRow(index + 7).height = 20;
    worksheet.getCell(`C${index + 7}`).value = payment.name;
    worksheet.getCell(`D${index + 7}`).value = payment.concept;
    worksheet.getCell(`E${index + 7}`).value = payment.amount;
    worksheet.getCell(`F${index + 7}`).value = payment.paymentDate;
    worksheet.getCell(`G${index + 7}`).value = payment.dueDate;
  });

  // Centrar contenido de columnas
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 6) { 
      row.eachCell((cell) => {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    }
  });

  // Guardar el archivo
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  FileSaver.saveAs(blob, 'Reporte_pagos.xlsx');
}
