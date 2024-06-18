import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';

export async function exportStudentsToExcel(students, logoBase64) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Estudiantes');

  // Agregar el logo
  const imageId = workbook.addImage({
    base64: logoBase64,
    extension: 'png',
  });
  worksheet.addImage(imageId, {
    tl: { col: 0, row: 0 },
    ext: { width: 100, height: 100 }
  });

  worksheet.mergeCells('C2:G2');
  worksheet.getCell('C2').value = 'Reporte de Estudiantes';
  worksheet.getCell('C2').alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell('C2').font = { size: 20, bold: true };

  // Ajustar ancho de las columnas
  worksheet.getColumn(3).width = 30; // Columna C
  worksheet.getColumn(4).width = 30; // Columna D
  worksheet.getColumn(5).width = 20; // Columna E
  worksheet.getColumn(6).width = 20; // Columna F
  worksheet.getColumn(7).width = 30; // Columna G

  // Ajustar la altura de las filas
  worksheet.getRow(9).height = 30; // Altura de la fila 9

  // Agregar encabezados a partir de la fila 6, columna C
  worksheet.getCell('C6').value = 'Nombre Completo';
  worksheet.getCell('D6').value = 'Género';
  worksheet.getCell('E6').value = 'Nivel';
  worksheet.getCell('F6').value = 'Grado';
  worksheet.getCell('G6').value = 'Apoderado';

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
      color: { argb: 'FFFFFFFF' }
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  worksheet.getRow(6).height = 35;

  students.forEach((student, index) => {
    const rowIndex = index + 7;
    worksheet.getRow(rowIndex).height = 20;
    worksheet.getCell(`C${rowIndex}`).value = student.fullName;
    worksheet.getCell(`D${rowIndex}`).value = student.gender;
    worksheet.getCell(`E${rowIndex}`).value = student.level;
    worksheet.getCell(`F${rowIndex}`).value = student.grade;
    worksheet.getCell(`G${rowIndex}`).value = student.guardian ? student.guardian.fullName : 'Sin apoderado';
  });

  students.forEach((student, index) => {
    const rowIndex = index + 7;
    worksheet.getCell(`C${rowIndex}`).value = student['Nombre Completo'];
    worksheet.getCell(`D${rowIndex}`).value = student['Género'];
    worksheet.getCell(`E${rowIndex}`).value = student['Nivel'];
    worksheet.getCell(`F${rowIndex}`).value = student['Grado'];
    worksheet.getCell(`G${rowIndex}`).value = student['Apoderado'];
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
  FileSaver.saveAs(blob, 'Reporte_estudiantes.xlsx');
}