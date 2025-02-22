
import { supabase } from "@/integrations/supabase/client";
import { FormConfiguration } from "@/types/form-configuration";

export const FormConfigurationService = {
  async save(config: Omit<FormConfiguration, 'id'>) {
    const { data, error } = await supabase
      .from('form_configurations')
      .insert([{
        name: config.name,
        description: config.description || '',
        configuration: config,
        is_active: true
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getByName(name: string) {
    const { data, error } = await supabase
      .from('form_configurations')
      .select('*')
      .eq('name', name)
      .eq('is_active', true)
      .single();

    if (error) throw error;
    return data?.configuration as FormConfiguration;
  },

  async update(id: string, config: Partial<FormConfiguration>) {
    const { data, error } = await supabase
      .from('form_configurations')
      .update({
        configuration: config,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
