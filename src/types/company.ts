
export interface Company {
  nit: string;
  dv: string;
  razon_social: string;
  primer_apellido: string;
  segundo_apellido: string;
  primer_nombre: string;
  segundo_nombre: string;
  tipo_documento: string;
  numero_documento: string;
  tipo_empresa: string;
  naturaleza_empresa: string;
  codigo_ciuu: string;
  descripcion_actividad: string;
  fecha_constitucion: string;
  direccion_principal: string;
  direccion: string;
  barrio: string;
  ciudad: string;
  municipio: string;
  departamento: string;
  pais: string;
  telefono_fijo: string;
  telefono_movil: string;
  telefono: string;
  email: string;
  correo_electronico: string;
  pagina_web: string;
  tipo_contribuyente: string;
  regimen_tributario: string;
  responsabilidad_fiscal: string;
  sucursales: boolean;
  comentarios: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}
