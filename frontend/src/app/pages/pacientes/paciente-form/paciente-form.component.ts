import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paciente-form',
  templateUrl: './paciente-form.component.html',
  styleUrls: ['./paciente-form.component.scss']
})
export class PacienteFormComponent {
  constructor(private router: Router) {}

  guardarPaciente() {
    // Aquí va la lógica para enviar al backend (cuando esté listo)
    console.log('Paciente guardado');

    // Redirige a la lista de pacientes
    this.router.navigate(['/pacientes']);
  }
}
