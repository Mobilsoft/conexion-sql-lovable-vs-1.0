
import { supabase } from "@/integrations/supabase/client";
import { TableStats } from "@/types/sql-connection";
import { TableStructure } from "@/types/table-structure";

export const getTableStats = async (connectionData: any): Promise<TableStats[]> => {
  try {
    const { data, error } = await supabase.functions.invoke(
      'sql-server-connection/connect',
      {
        body: JSON.stringify(connectionData),
        method: 'POST',
      }
    );

    if (error) throw new Error(error.message);
    if (!data.success) throw new Error(data.error);

    return data.data;
  } catch (error) {
    console.error("Error fetching table stats:", error);
    throw error;
  }
};

export const getTableStructure = async (connectionData: any, tableName: string): Promise<TableStructure[]> => {
  try {
    const { data, error } = await supabase.functions.invoke(
      'sql-server-connection/structure',
      {
        body: JSON.stringify({ ...connectionData, tableName }),
        method: 'POST',
      }
    );

    if (error) throw new Error(error.message);
    if (!data.success) throw new Error(data.error);

    return data.data;
  } catch (error) {
    console.error(`Error fetching table structure for ${tableName}:`, error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    const { data, error } = await supabase.functions.invoke(
      'sql-server-connection/disconnect',
      { method: 'POST' }
    );

    if (error) throw new Error(error.message);
    if (!data.success) throw new Error(data.error);

    console.log("Database disconnected successfully");
  } catch (error) {
    console.error("Error disconnecting from database:", error);
    throw error;
  }
};
