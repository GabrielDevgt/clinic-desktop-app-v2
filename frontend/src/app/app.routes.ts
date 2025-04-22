import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PacientesComponent } from './pages/pacientes/pacientes.component';
import { DoctoresComponent } from './pages/doctores/doctores.component';
import { ConsultasComponent } from './pages/consultas/consultas.component';
import { CitasComponent } from './pages/citas/citas.component';
import { TratamientosComponent } from './pages/tratamientos/tratamientos.component';
import { ExamenesComponent } from './pages/examenes/examenes.component';
import { BusquedaComponent } from './pages/busqueda/busqueda.component';
import { PacienteFormComponent } from './pages/pacientes/paciente-form/paciente-form.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'pacientes', component: PacientesComponent },
  { path: 'doctores', component: DoctoresComponent },
  { path: 'consultas', component: ConsultasComponent },
  { path: 'busqueda', component: BusquedaComponent},
  { path: 'citas', component: CitasComponent },
  { path: 'tratamientos', component: TratamientosComponent },
  { path: 'examenes', component: ExamenesComponent },
  { path: 'pacientes/nuevo', component: PacienteFormComponent },
];
