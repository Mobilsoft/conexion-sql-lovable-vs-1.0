
export const calculateDV = (nit: string): string => {
  if (!nit || nit.length === 0) return '';
  
  // Limpiar el NIT de cualquier caracter no numérico
  const cleanNit = nit.replace(/[^0-9]/g, '');
  
  // Solo calcular si el NIT tiene hasta 9 dígitos
  if (cleanNit.length > 9) return '';
  
  // Rellenar con ceros a la izquierda si es necesario
  const paddedNit = cleanNit.padStart(9, '0');
  
  // Factores de cálculo según la DIAN
  const factors = [3, 7, 13, 17, 19, 23, 29, 37, 41];
  
  // Calcular la suma de productos
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(paddedNit[i]) * factors[i];
  }
  
  // Calcular el DV
  const dv = sum % 11;
  return dv > 1 ? String(11 - dv) : String(dv);
};
