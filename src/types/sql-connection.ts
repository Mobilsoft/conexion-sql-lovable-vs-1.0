
import * as z from 'zod';

export const sqlConnectionSchema = z.object({
  server: z.string().min(1, 'El servidor es requerido'),
  port: z.string().regex(/^\d+$/, 'El puerto debe ser numérico'),
  database: z.string().min(1, 'La base de datos es requerida'),
  username: z.string().min(1, 'El usuario es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
  useWindowsAuth: z.boolean().default(false),
});

export type SqlConnectionFormValues = z.infer<typeof sqlConnectionSchema>;

export interface TableStats {
  table_name: string;
  row_count: number;
  size_in_kb: number;
}
