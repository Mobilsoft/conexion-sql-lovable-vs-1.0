
import { globalConnection, type ConnectionConfig } from "./globalConnection.ts";
import mssql from "npm:mssql@9.1.1";

export const getConnection = async (config: ConnectionConfig): Promise<mssql.ConnectionPool> => {
  return globalConnection.getConnection(config);
};

export const clearConnection = async () => {
  await globalConnection.closeConnection();
};
