import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Sede } from 'src/app/model/sede.model';
import { DialogFormSedeComponent } from './dialog-form-sede/dialog-form-sede.component';
import { SedesService } from 'src/app/services/sedes.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sedes',
  templateUrl: './sedes.component.html',
  styleUrls: ['./sedes.component.scss']
})
export class SedesComponent implements OnInit, AfterViewInit{

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  searchText: any;
  displayedColumns: string[] = [
    '#',
    'description',
    'address',
    'phone',
    'contact',
    'action',
  ];
  dataSource = new MatTableDataSource<Sede>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(
    private sedeService: SedesService,
    public dialog: MatDialog, 
    public datePipe: DatePipe,
    private matSnackBar: MatSnackBar
    ) {
    
   }
  ngOnInit(): void 
  {
    this.init();
  }

  init()
  {
    this.sedeService.findAll().subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  
  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(action: string, obj: any)
  {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogFormSedeComponent, {
      data: obj,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event === 'Registrar') {
        this.add(result?.data);
      } else if (result?.event === 'Actualizar') {
        this.update(result?.data);
      } else if (result?.event === 'Eliminar') {
        this.delete(result?.data);
      }
    });
  }

  add(obj: Sede): void 
  {
    const sede = this.getSede(obj);
    this.sedeService.save(sede).subscribe((data) => {
      this.matSnackBar.open('Sede registrada correctamente', 'INFO', {duration: 2000});
      this.init();
      this.table.renderRows();
    });
  }

  update(obj: Sede): void 
  {
    const sede = this.getSede(obj);
    this.sedeService.update(sede, sede?.id).subscribe((data) => {
      this.matSnackBar.open('Sede actualizada correctamente', 'INFO', {duration: 2000});
      this.init();
      this.table.renderRows();
    });
  }

  delete(obj: Sede): void
  {
    const sede = this.getSede(obj);
    this.sedeService.delete(sede?.id).subscribe((data) => {
      this.matSnackBar.open('Sede eliminada correctamente', 'INFO', {duration: 2000});
      this.init();
      this.table.renderRows();
    });
  }

  getSede(obj: Sede): Sede
  {
    let sede = new Sede();
    sede.id = obj.id;
    sede.description = obj.description;
    sede.address = obj.address;
    sede.phone = obj.phone;
    sede.contact = obj.contact;

    return sede;
  }
}
