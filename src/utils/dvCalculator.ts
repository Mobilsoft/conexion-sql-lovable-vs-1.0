
export const calculateDV = (nit: string): string => {
  if (!nit || nit.length === 0) return '';
  
  const factors = [41, 37, 29, 23, 19, 17, 13, 7, 3];
  const cleanNit = nit.replace(/[^0-9]/g, '');
  const nitArray = cleanNit.split('').reverse();
  
  let sum = 0;
  for (let i = 0; i < nitArray.length; i++) {
    sum += parseInt(nitArray[i]) * factors[i];
  }
  
  const dv = (sum % 11);
  return dv > 1 ? String(11 - dv) : String(dv);
};
