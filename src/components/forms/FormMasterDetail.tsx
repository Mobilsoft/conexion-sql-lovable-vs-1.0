
import { useState } from "react";
import { MasterDetailForm } from "../dynamic-form/MasterDetailForm";
import { useToast } from "@/hooks/use-toast";

export function FormMasterDetail() {
  const { toast } = useToast();

  // Campos para el formulario maestro (ap_forms)
  const masterFields = [
    {
      name: "module_id",
      label: "Módulo",
      type: "select",
      required: true,
      options: [] // Aquí cargarías los módulos disponibles
    },
    {
      name: "nombre",
      label: "Nombre del Formulario",
      type: "text",
      required: true
    },
    {
      name: "descripcion",
      label: "Descripción",
      type: "textarea"
    },
    {
      name: "ruta",
      label: "Ruta",
      type: "text"
    },
    {
      name: "icono",
      label: "Icono",
      type: "text"
    },
    {
      name: "orden",
      label: "Orden",
      type: "number"
    },
    {
      name: "tipo_formulario",
      label: "Tipo de Formulario",
      type: "select",
      required: true,
      options: [
        { value: "S", label: "Simple" },
        { value: "M", label: "Maestro" },
        { value: "D", label: "Detalle" }
      ]
    },
    {
      name: "master_form_id",
      label: "Formulario Maestro",
      type: "select",
      options: [], // Aquí cargarías los formularios maestros disponibles
      required: false
    },
    {
      name: "estado",
      label: "Estado",
      type: "switch",
      required: true
    }
  ];

  // Campos para la configuración del formulario (app_form_configurations)
  const detailFields = [
    {
      name: "nombre",
      label: "Nombre de la Configuración",
      type: "text",
      required: true
    },
    {
      name: "descripcion",
      label: "Descripción",
      type: "textarea"
    },
    {
      name: "tabla_master",
      label: "¿Es Configuración Maestra?",
      type: "switch",
      required: true
    },
    {
      name: "configuracion",
      label: "Configuración",
      type: "textarea",
      required: true,
      placeholder: JSON.stringify({
        display: "form",
        settings: {
          title: "Nuevo Formulario",
          theme: "default"
        },
        components: [
          {
            type: "accordion",
            label: "Sección 1",
            components: [
              {
                type: "textfield",
                key: "campo1",
                label: "Campo 1",
                placeholder: "Ingrese valor"
              }
            ]
          }
        ]
      }, null, 2)
    },
    {
      name: "estado",
      label: "Estado",
      type: "switch",
      required: true
    }
  ];

  const handleMasterSave = async (data: any) => {
    try {
      // Aquí irían las llamadas a la API para guardar el formulario
      console.log("Guardando formulario:", data);
      toast({
        title: "Éxito",
        description: "Formulario guardado correctamente"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al guardar el formulario",
        variant: "destructive"
      });
    }
  };

  const handleDetailSave = async (data: any) => {
    try {
      // Aquí irían las llamadas a la API para guardar la configuración
      console.log("Guardando configuración:", data);
      toast({
        title: "Éxito",
        description: "Configuración guardada correctamente"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al guardar la configuración",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Formularios</h1>
      <MasterDetailForm
        masterTitle="Formulario"
        detailTitle="Configuración"
        masterFields={masterFields}
        detailFields={detailFields}
        onMasterSave={handleMasterSave}
        onDetailSave={handleDetailSave}
      />
    </div>
  );
}
