import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.scss']
})
export class PacientesComponent {
  constructor(private router: Router) {}

  // Datos de ejemplo mejorados
  pacientes = [
    { 
      id_paciente: 1,
      nombre1: 'Juan',
      nombre2: 'Carlos',
      apellido1: 'Pérez',
      apellido2: 'Gómez',
      fecha_nacimiento: new Date('1985-05-15'),
      telefono: '5555-1234',
      genero: 'Masculino',
      ultima_consulta: new Date('2023-10-20')
    },
    { 
      id_paciente: 2,
      nombre1: 'Ana',
      nombre2: 'María',
      apellido1: 'López',
      apellido2: 'Martínez',
      fecha_nacimiento: new Date('1990-08-22'),
      telefono: '5555-5678',
      genero: 'Femenino',
      ultima_consulta: new Date('2023-11-05')
    }
  ];

  pacientesFiltrados: any[] = [];
  searchTerm: string = '';
  showSearch: boolean = false;

  // Navegación
  irANuevoPaciente() {
    this.router.navigate(['/pacientes/nuevo']);
  }

  // Acciones
  editarPaciente(id: number) {
    this.router.navigate(['/pacientes/editar', id]);
  }

  verHistorial(id: number) {
    this.router.navigate(['/pacientes/historial', id]);
  }

  nuevaConsulta(id: number) {
    this.router.navigate(['/consultas/nueva', { pacienteId: id }]);
  }

  verExpediente(id: number) {
    this.router.navigate(['/pacientes/expediente', id]);
  }

  enviarRecordatorio(id: number) {
    // Lógica para enviar recordatorio
    const paciente = this.pacientes.find(p => p.id_paciente === id);
    alert(`Recordatorio enviado a ${paciente?.nombre1} ${paciente?.apellido1}`);
  }

  // Búsqueda
  toggleSearch() {
    this.showSearch = !this.showSearch;
    if (!this.showSearch) {
      this.searchTerm = '';
      this.pacientesFiltrados = [];
    }
  }

  buscarPacientes() {
    if (!this.searchTerm) {
      this.pacientesFiltrados = [];
      return;
    }
    
    this.pacientesFiltrados = this.pacientes.filter(paciente => {
      const nombreCompleto = `${paciente.nombre1} ${paciente.nombre2 || ''} ${paciente.apellido1} ${paciente.apellido2 || ''}`.toLowerCase();
      return (
        nombreCompleto.includes(this.searchTerm.toLowerCase()) ||
        paciente.telefono.includes(this.searchTerm) ||
        paciente.id_paciente.toString().includes(this.searchTerm)
      );
    });
  }

  // Utilidades
  calcularEdad(fechaNacimiento: Date): number {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    
    return edad;
  }
}