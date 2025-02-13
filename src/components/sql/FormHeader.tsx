
import { motion } from 'framer-motion';

const FormHeader = () => {
  return (
    <div className="space-y-2">
      <h2 className="text-3xl font-bold tracking-tight text-center">Configuración de Conexión</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
        Ingrese los datos de conexión al servidor SQL Server
      </p>
    </div>
  );
};

export default FormHeader;
