import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { OPTIONS_DATE } from 'src/app/shared/util/constants.util';

@Component({
  selector: 'app-starter',
  standalone: true,
  imports:[MaterialModule],
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StarterComponent implements OnInit {
  
  datetime : string;

  constructor() {}
  ngOnInit(): void {
    setInterval(() => {
      this.actualizarFechaHora();
    }, 1000);
  }

  actualizarFechaHora() {
    this.datetime = new Date().toLocaleDateString('es-PE', OPTIONS_DATE);
  }
}
