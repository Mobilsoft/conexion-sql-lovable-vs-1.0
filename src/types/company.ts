export interface CodigoCIIU {
  id: number;
  codigo: string;
  descripcion: string;
}

export interface ActividadComercial {
  id: number;
  nombre: string;
  descripcion: string | null;
}

export interface Pais {
  id: number;
  nombre: string;
  codigo: string | null;
}

export interface Departamento {
  id: number;
  nombre: string;
  codigo: string | null;
  pais_id: number;
}

export interface Ciudad {
  id: number;
  nombre: string;
  codigo: string | null;
  departamento_id: number;
}

export interface TipoRegimenTributario {
  id: number;
  nombre: string;
  descripcion: string | null;
}

export interface TipoDocumento {
  id: number;
  nombre: string;
  codigo: string | null;
}

export interface CompanyFormData {
  tipo_documento_id: string;
  nit: string;
  dv: string;
  tipo_contribuyente: string;
  razon_social: string;
  direccion: string;
  telefono: string;
  email: string;
  pais_id: string;
  departamento_id: string;
  ciudad_id: string;
  codigo_ciiu_id: string;
  actividad_comercial_id: string;
  tipo_regimen_id: string;
  municipio: string;
  tabla_master: string;
}

export interface Company {
  nit: string;
  dv: string;
  razon_social: string;
  primer_apellido: string | null;
  segundo_apellido: string | null;
  primer_nombre: string | null;
  segundo_nombre: string | null;
  tipo_documento_id: number;
  numero_documento: string;
  tipo_empresa: string;
  naturaleza_empresa: string;
  codigo_ciiu_id: number;
  actividad_comercial_id: number;
  descripcion_actividad: string;
  fecha_constitucion: string;
  direccion_principal: string;
  direccion: string;
  barrio: string;
  ciudad_id: number;
  municipio: string;
  departamento_id: number;
  pais_id: number;
  telefono_fijo: string | null;
  telefono_movil: string;
  telefono: string;
  email: string;
  correo_electronico: string;
  pagina_web: string | null;
  tipo_contribuyente: string;
  tipo_regimen_id: number;
  responsabilidad_fiscal: string;
  categoria: string | null;
  tipo_permiso: string | null;
  numero_permiso: string | null;
  numero_matricula: string | null;
  rut_file_name: string | null;
  rut_file_url: string | null;
  camara_comercio_file_name: string | null;
  camara_comercio_file_url: string | null;
  estado_empresa: string | null;
  estado_dian: string | null;
  sucursales: boolean;
  comentarios: string | null;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  tabla_master?: string;
}
