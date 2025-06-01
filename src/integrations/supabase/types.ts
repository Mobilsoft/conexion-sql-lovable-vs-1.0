export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      anulaciones_factura: {
        Row: {
          created_at: string | null
          factura_id: number
          fecha: string
          id: number
          motivo: string
          updated_at: string | null
          usuario: string
        }
        Insert: {
          created_at?: string | null
          factura_id: number
          fecha?: string
          id?: number
          motivo: string
          updated_at?: string | null
          usuario: string
        }
        Update: {
          created_at?: string | null
          factura_id?: number
          fecha?: string
          id?: number
          motivo?: string
          updated_at?: string | null
          usuario?: string
        }
        Relationships: [
          {
            foreignKeyName: "anulaciones_factura_factura_id_fkey"
            columns: ["factura_id"]
            isOneToOne: false
            referencedRelation: "facturas"
            referencedColumns: ["id"]
          },
        ]
      }
      categorias: {
        Row: {
          activo: boolean | null
          codigo: string
          created_at: string | null
          id: number
          nombre: string
          sublinea_id: number
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          codigo: string
          created_at?: string | null
          id?: number
          nombre: string
          sublinea_id: number
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          codigo?: string
          created_at?: string | null
          id?: number
          nombre?: string
          sublinea_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categorias_sublinea_id_fkey"
            columns: ["sublinea_id"]
            isOneToOne: false
            referencedRelation: "sublineas"
            referencedColumns: ["id"]
          },
        ]
      }
      certificados_digitales: {
        Row: {
          activo: boolean | null
          archivo: string
          contrasena: string
          created_at: string | null
          fecha_expiracion: string
          id: number
          nombre: string
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          archivo: string
          contrasena: string
          created_at?: string | null
          fecha_expiracion: string
          id?: number
          nombre: string
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          archivo?: string
          contrasena?: string
          created_at?: string | null
          fecha_expiracion?: string
          id?: number
          nombre?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ciudades: {
        Row: {
          activo: boolean | null
          codigo: string
          created_at: string | null
          departamento: string
          id: number
          nombre: string
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          codigo: string
          created_at?: string | null
          departamento: string
          id?: number
          nombre: string
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          codigo?: string
          created_at?: string | null
          departamento?: string
          id?: number
          nombre?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      clientes: {
        Row: {
          activo: boolean | null
          ciudad_id: number
          created_at: string | null
          direccion: string
          email: string
          id: number
          nit: string
          nombre_comercial: string | null
          razon_social: string
          regimen_tributario_id: number
          telefono: string
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          ciudad_id: number
          created_at?: string | null
          direccion: string
          email: string
          id?: number
          nit: string
          nombre_comercial?: string | null
          razon_social: string
          regimen_tributario_id: number
          telefono: string
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          ciudad_id?: number
          created_at?: string | null
          direccion?: string
          email?: string
          id?: number
          nit?: string
          nombre_comercial?: string | null
          razon_social?: string
          regimen_tributario_id?: number
          telefono?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clientes_ciudad_id_fkey"
            columns: ["ciudad_id"]
            isOneToOne: false
            referencedRelation: "ciudades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clientes_regimen_tributario_id_fkey"
            columns: ["regimen_tributario_id"]
            isOneToOne: false
            referencedRelation: "regimenes_tributarios"
            referencedColumns: ["id"]
          },
        ]
      }
      cotizaciones: {
        Row: {
          cliente_id: number
          created_at: string | null
          estado: string
          fecha: string
          id: number
          iva: number
          lista_precio_id: number
          numero: string
          observaciones: string | null
          subtotal: number
          total: number
          updated_at: string | null
          vendedor_id: number
        }
        Insert: {
          cliente_id: number
          created_at?: string | null
          estado?: string
          fecha?: string
          id?: number
          iva?: number
          lista_precio_id: number
          numero: string
          observaciones?: string | null
          subtotal?: number
          total?: number
          updated_at?: string | null
          vendedor_id: number
        }
        Update: {
          cliente_id?: number
          created_at?: string | null
          estado?: string
          fecha?: string
          id?: number
          iva?: number
          lista_precio_id?: number
          numero?: string
          observaciones?: string | null
          subtotal?: number
          total?: number
          updated_at?: string | null
          vendedor_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "cotizaciones_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cotizaciones_lista_precio_id_fkey"
            columns: ["lista_precio_id"]
            isOneToOne: false
            referencedRelation: "listas_precios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cotizaciones_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "vendedores"
            referencedColumns: ["id"]
          },
        ]
      }
      detalles_cotizacion: {
        Row: {
          cantidad: number
          cotizacion_id: number
          created_at: string | null
          id: number
          iva: number
          precio_unitario: number
          producto_id: number
          subtotal: number
          total: number
          updated_at: string | null
        }
        Insert: {
          cantidad: number
          cotizacion_id: number
          created_at?: string | null
          id?: number
          iva: number
          precio_unitario: number
          producto_id: number
          subtotal: number
          total: number
          updated_at?: string | null
        }
        Update: {
          cantidad?: number
          cotizacion_id?: number
          created_at?: string | null
          id?: number
          iva?: number
          precio_unitario?: number
          producto_id?: number
          subtotal?: number
          total?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "detalles_cotizacion_cotizacion_id_fkey"
            columns: ["cotizacion_id"]
            isOneToOne: false
            referencedRelation: "cotizaciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "detalles_cotizacion_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      detalles_devolucion: {
        Row: {
          cantidad: number
          created_at: string | null
          detalle_factura_id: number
          devolucion_id: number
          id: number
          iva: number
          precio_unitario: number
          producto_id: number
          subtotal: number
          total: number
          updated_at: string | null
        }
        Insert: {
          cantidad: number
          created_at?: string | null
          detalle_factura_id: number
          devolucion_id: number
          id?: number
          iva: number
          precio_unitario: number
          producto_id: number
          subtotal: number
          total: number
          updated_at?: string | null
        }
        Update: {
          cantidad?: number
          created_at?: string | null
          detalle_factura_id?: number
          devolucion_id?: number
          id?: number
          iva?: number
          precio_unitario?: number
          producto_id?: number
          subtotal?: number
          total?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "detalles_devolucion_detalle_factura_id_fkey"
            columns: ["detalle_factura_id"]
            isOneToOne: false
            referencedRelation: "detalles_factura"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "detalles_devolucion_devolucion_id_fkey"
            columns: ["devolucion_id"]
            isOneToOne: false
            referencedRelation: "devoluciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "detalles_devolucion_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      detalles_factura: {
        Row: {
          cantidad: number
          created_at: string | null
          detalle_remision_id: number
          factura_id: number
          id: number
          iva: number
          precio_unitario: number
          producto_id: number
          subtotal: number
          total: number
          updated_at: string | null
        }
        Insert: {
          cantidad: number
          created_at?: string | null
          detalle_remision_id: number
          factura_id: number
          id?: number
          iva: number
          precio_unitario: number
          producto_id: number
          subtotal: number
          total: number
          updated_at?: string | null
        }
        Update: {
          cantidad?: number
          created_at?: string | null
          detalle_remision_id?: number
          factura_id?: number
          id?: number
          iva?: number
          precio_unitario?: number
          producto_id?: number
          subtotal?: number
          total?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "detalles_factura_detalle_remision_id_fkey"
            columns: ["detalle_remision_id"]
            isOneToOne: false
            referencedRelation: "detalles_remision"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "detalles_factura_factura_id_fkey"
            columns: ["factura_id"]
            isOneToOne: false
            referencedRelation: "facturas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "detalles_factura_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      detalles_pedido: {
        Row: {
          cantidad: number
          created_at: string | null
          id: number
          iva: number
          pedido_id: number
          precio_unitario: number
          producto_id: number
          subtotal: number
          total: number
          updated_at: string | null
        }
        Insert: {
          cantidad: number
          created_at?: string | null
          id?: number
          iva: number
          pedido_id: number
          precio_unitario: number
          producto_id: number
          subtotal: number
          total: number
          updated_at?: string | null
        }
        Update: {
          cantidad?: number
          created_at?: string | null
          id?: number
          iva?: number
          pedido_id?: number
          precio_unitario?: number
          producto_id?: number
          subtotal?: number
          total?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "detalles_pedido_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "detalles_pedido_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      detalles_remision: {
        Row: {
          cantidad: number
          created_at: string | null
          detalle_pedido_id: number
          id: number
          producto_id: number
          remision_id: number
          updated_at: string | null
        }
        Insert: {
          cantidad: number
          created_at?: string | null
          detalle_pedido_id: number
          id?: number
          producto_id: number
          remision_id: number
          updated_at?: string | null
        }
        Update: {
          cantidad?: number
          created_at?: string | null
          detalle_pedido_id?: number
          id?: number
          producto_id?: number
          remision_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "detalles_remision_detalle_pedido_id_fkey"
            columns: ["detalle_pedido_id"]
            isOneToOne: false
            referencedRelation: "detalles_pedido"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "detalles_remision_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "detalles_remision_remision_id_fkey"
            columns: ["remision_id"]
            isOneToOne: false
            referencedRelation: "remisiones"
            referencedColumns: ["id"]
          },
        ]
      }
      devoluciones: {
        Row: {
          created_at: string | null
          estado: string
          factura_id: number
          fecha: string
          id: number
          iva: number
          motivo: string
          numero: string
          observaciones: string | null
          subtotal: number
          total: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          estado?: string
          factura_id: number
          fecha?: string
          id?: number
          iva?: number
          motivo: string
          numero: string
          observaciones?: string | null
          subtotal?: number
          total?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          estado?: string
          factura_id?: number
          fecha?: string
          id?: number
          iva?: number
          motivo?: string
          numero?: string
          observaciones?: string | null
          subtotal?: number
          total?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "devoluciones_factura_id_fkey"
            columns: ["factura_id"]
            isOneToOne: false
            referencedRelation: "facturas"
            referencedColumns: ["id"]
          },
        ]
      }
      facturas: {
        Row: {
          certificado_id: number | null
          cliente_id: number
          created_at: string | null
          cufe: string | null
          estado: string
          fecha: string
          fecha_vencimiento: string
          forma_pago_id: number
          id: number
          iva: number
          numero: string
          observaciones: string | null
          remision_id: number
          resolucion_id: number
          subtotal: number
          total: number
          updated_at: string | null
          vendedor_id: number
        }
        Insert: {
          certificado_id?: number | null
          cliente_id: number
          created_at?: string | null
          cufe?: string | null
          estado?: string
          fecha?: string
          fecha_vencimiento: string
          forma_pago_id: number
          id?: number
          iva?: number
          numero: string
          observaciones?: string | null
          remision_id: number
          resolucion_id: number
          subtotal?: number
          total?: number
          updated_at?: string | null
          vendedor_id: number
        }
        Update: {
          certificado_id?: number | null
          cliente_id?: number
          created_at?: string | null
          cufe?: string | null
          estado?: string
          fecha?: string
          fecha_vencimiento?: string
          forma_pago_id?: number
          id?: number
          iva?: number
          numero?: string
          observaciones?: string | null
          remision_id?: number
          resolucion_id?: number
          subtotal?: number
          total?: number
          updated_at?: string | null
          vendedor_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "facturas_certificado_id_fkey"
            columns: ["certificado_id"]
            isOneToOne: false
            referencedRelation: "certificados_digitales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "facturas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "facturas_forma_pago_id_fkey"
            columns: ["forma_pago_id"]
            isOneToOne: false
            referencedRelation: "formas_pago"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "facturas_remision_id_fkey"
            columns: ["remision_id"]
            isOneToOne: false
            referencedRelation: "remisiones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "facturas_resolucion_id_fkey"
            columns: ["resolucion_id"]
            isOneToOne: false
            referencedRelation: "resoluciones_facturacion"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "facturas_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "vendedores"
            referencedColumns: ["id"]
          },
        ]
      }
      formas_pago: {
        Row: {
          activo: boolean | null
          codigo: string
          created_at: string | null
          dias: number
          id: number
          nombre: string
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          codigo: string
          created_at?: string | null
          dias?: number
          id?: number
          nombre: string
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          codigo?: string
          created_at?: string | null
          dias?: number
          id?: number
          nombre?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      items_lista_precios: {
        Row: {
          created_at: string | null
          id: number
          lista_precio_id: number
          precio: number
          producto_id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          lista_precio_id: number
          precio: number
          producto_id: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          lista_precio_id?: number
          precio?: number
          producto_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "items_lista_precios_lista_precio_id_fkey"
            columns: ["lista_precio_id"]
            isOneToOne: false
            referencedRelation: "listas_precios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_lista_precios_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      lineas: {
        Row: {
          activo: boolean | null
          codigo: string
          created_at: string | null
          id: number
          nombre: string
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          codigo: string
          created_at?: string | null
          id?: number
          nombre: string
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          codigo?: string
          created_at?: string | null
          id?: number
          nombre?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      listas_precios: {
        Row: {
          activo: boolean | null
          created_at: string | null
          descripcion: string | null
          id: number
          nombre: string
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          descripcion?: string | null
          id?: number
          nombre: string
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          descripcion?: string | null
          id?: number
          nombre?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      pedidos: {
        Row: {
          cliente_id: number
          cotizacion_id: number | null
          created_at: string | null
          estado: string
          fecha: string
          forma_pago_id: number
          id: number
          iva: number
          lista_precio_id: number
          numero: string
          observaciones: string | null
          subtotal: number
          total: number
          updated_at: string | null
          vendedor_id: number
        }
        Insert: {
          cliente_id: number
          cotizacion_id?: number | null
          created_at?: string | null
          estado?: string
          fecha?: string
          forma_pago_id: number
          id?: number
          iva?: number
          lista_precio_id: number
          numero: string
          observaciones?: string | null
          subtotal?: number
          total?: number
          updated_at?: string | null
          vendedor_id: number
        }
        Update: {
          cliente_id?: number
          cotizacion_id?: number | null
          created_at?: string | null
          estado?: string
          fecha?: string
          forma_pago_id?: number
          id?: number
          iva?: number
          lista_precio_id?: number
          numero?: string
          observaciones?: string | null
          subtotal?: number
          total?: number
          updated_at?: string | null
          vendedor_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_cotizacion_id_fkey"
            columns: ["cotizacion_id"]
            isOneToOne: false
            referencedRelation: "cotizaciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_forma_pago_id_fkey"
            columns: ["forma_pago_id"]
            isOneToOne: false
            referencedRelation: "formas_pago"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_lista_precio_id_fkey"
            columns: ["lista_precio_id"]
            isOneToOne: false
            referencedRelation: "listas_precios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "vendedores"
            referencedColumns: ["id"]
          },
        ]
      }
      productos: {
        Row: {
          activo: boolean | null
          categoria_id: number
          codigo: string
          created_at: string | null
          descripcion: string | null
          id: number
          iva: number
          linea_id: number
          nombre: string
          precio: number
          stock: number
          sublinea_id: number
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          categoria_id: number
          codigo: string
          created_at?: string | null
          descripcion?: string | null
          id?: number
          iva?: number
          linea_id: number
          nombre: string
          precio?: number
          stock?: number
          sublinea_id: number
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          categoria_id?: number
          codigo?: string
          created_at?: string | null
          descripcion?: string | null
          id?: number
          iva?: number
          linea_id?: number
          nombre?: string
          precio?: number
          stock?: number
          sublinea_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "productos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "productos_linea_id_fkey"
            columns: ["linea_id"]
            isOneToOne: false
            referencedRelation: "lineas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "productos_sublinea_id_fkey"
            columns: ["sublinea_id"]
            isOneToOne: false
            referencedRelation: "sublineas"
            referencedColumns: ["id"]
          },
        ]
      }
      regimenes_tributarios: {
        Row: {
          activo: boolean | null
          codigo: string
          created_at: string | null
          descripcion: string | null
          id: number
          nombre: string
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          codigo: string
          created_at?: string | null
          descripcion?: string | null
          id?: number
          nombre: string
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          codigo?: string
          created_at?: string | null
          descripcion?: string | null
          id?: number
          nombre?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      remisiones: {
        Row: {
          created_at: string | null
          estado: string
          fecha: string
          id: number
          numero: string
          observaciones: string | null
          pedido_id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          estado?: string
          fecha?: string
          id?: number
          numero: string
          observaciones?: string | null
          pedido_id: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          estado?: string
          fecha?: string
          id?: number
          numero?: string
          observaciones?: string | null
          pedido_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "remisiones_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      resoluciones_facturacion: {
        Row: {
          activo: boolean | null
          created_at: string | null
          fecha_fin: string
          fecha_inicio: string
          id: number
          numero: string
          prefijo: string
          rango_final: number
          rango_inicial: number
          resolucion_actual: number
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          fecha_fin: string
          fecha_inicio: string
          id?: number
          numero: string
          prefijo: string
          rango_final: number
          rango_inicial: number
          resolucion_actual: number
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          fecha_fin?: string
          fecha_inicio?: string
          id?: number
          numero?: string
          prefijo?: string
          rango_final?: number
          rango_inicial?: number
          resolucion_actual?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      sublineas: {
        Row: {
          activo: boolean | null
          codigo: string
          created_at: string | null
          id: number
          linea_id: number
          nombre: string
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          codigo: string
          created_at?: string | null
          id?: number
          linea_id: number
          nombre: string
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          codigo?: string
          created_at?: string | null
          id?: number
          linea_id?: number
          nombre?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sublineas_linea_id_fkey"
            columns: ["linea_id"]
            isOneToOne: false
            referencedRelation: "lineas"
            referencedColumns: ["id"]
          },
        ]
      }
      vendedores: {
        Row: {
          activo: boolean | null
          codigo: string
          comision: number
          created_at: string | null
          documento: string
          email: string
          id: number
          nombre: string
          telefono: string
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          codigo: string
          comision?: number
          created_at?: string | null
          documento: string
          email: string
          id?: number
          nombre: string
          telefono: string
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          codigo?: string
          comision?: number
          created_at?: string | null
          documento?: string
          email?: string
          id?: number
          nombre?: string
          telefono?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
