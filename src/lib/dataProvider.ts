import { DataProvider } from "@refinedev/core";
import { supabase } from "./supabase";

export const dataProvider: DataProvider = {
    getList: async ({ resource, pagination, filters, sorters }) => {
        const pageSize = pagination?.pageSize || 10;
        const current = pagination?.current || 1;
        let query: any = supabase.from(resource).select('*', { count: 'exact' });
        query = query.range((current - 1) * pageSize, current * pageSize - 1);
        
        if (filters && Array.isArray(filters)) {
            filters.forEach((f: any) => {
                if (f.field) query = query.eq(f.field, f.value);
            });
        }
        
        if (sorters && sorters.length > 0) {
            query = query.order(sorters[0].field as string, { ascending: sorters[0].order === 'asc' });
        }
        
        const { data, error, count } = await query;
        if (error) throw error;
        return { data: data || [], total: count || 0 };
    },

    getOne: async ({ resource, id }) => {
        const { data, error } = await supabase.from(resource).select('*').eq('id', id as string).single();
        if (error) throw error;
        return { data };
    },

    create: async ({ resource, variables }) => {
        const { data, error } = await supabase.from(resource).insert(variables as any).select().single();
        if (error) throw error;
        return { data };
    },

    update: async ({ resource, id, variables }) => {
        const { data, error } = await supabase.from(resource).update(variables as any).eq('id', id as string).select().single();
        if (error) throw error;
        return { data };
    },

    deleteOne: async ({ resource, id }) => {
        const { error } = await supabase.from(resource).delete().eq('id', id as string);
        if (error) throw error;
        return { data: { id } as any };
    },

    getApiUrl: () => process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    
    custom: async ({ url, method, filters }) => {
        if (!url) throw new Error("URL required");
        if (method === "get" || !method) {
            let query: any = supabase.from(url).select('*');
            filters?.forEach((f: any) => { if (f.field) query = query.eq(f.field, f.value); });
            const { data, error } = await query;
            if (error) throw error;
            return { data: data || [], status: 200 };
        }
        return { data: null as any, status: 404 };
    },
};
