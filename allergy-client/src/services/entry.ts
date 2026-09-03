import apiFetch from '../lib/api';
import { ApiError } from '../lib/error';
import {
  EntrySchema,
  EntryResponseSchema,
  MigrateResponseSchema,
  type MigrateResponse,
  type EntryResponse,
  type EntryInput,
} from '../schemas/index';

const baseUrl = "/entries";

export const upsertEntry = async (entry: EntryInput): Promise<EntryResponse> => {
// Throws a ZodError with a if the shape is wrong.
  const validated = EntrySchema.parse(entry);

  const res = await apiFetch<unknown>(`${baseUrl}/${validated.date}`, {
    method: 'PUT',
    body: JSON.stringify(validated),
  });

  return EntryResponseSchema.parse(res);
}

export async function getEntry(date: string): Promise<EntryResponse | null> {
  try {
    const res = await apiFetch<unknown>(`${baseUrl}/${date}`, { method: 'GET' });
    return EntryResponseSchema.parse(res);
  }
  catch (err) {
    if (err instanceof ApiError && err.statusCode === 404) return null;
    throw err;
  }  
}

export async function getEntries(from: string, to: string): Promise<EntryResponse[]> {
  const res = await apiFetch<unknown[]>(`${baseUrl}?from=${from}&to=${to}`, { method: 'GET' });
  return res.map((r) => EntryResponseSchema.parse(r));
}

export async function migrateEntries(entries: EntryInput[]): Promise<MigrateResponse> {
  const validated = entries.map((e) => EntrySchema.parse(e));
  const res = await apiFetch<unknown>('/entries/migrate', {
    method: 'POST',
    body: JSON.stringify({ entries: validated }),
  });
  return MigrateResponseSchema.parse(res);
}

// export const updateEntry = async (entry: EntryInput): Promise<EntryResponse> => {
// // Throws a ZodError if the shape is wrong.
//   const validated = EntrySchema.parse(entry);

//   const res = await apiFetch<unknown>(`${baseUrl}/${validated.date}`, {
//     method: 'PUT',
//     body: JSON.stringify(validated),
//   });

//   return EntryResponseSchema.parse(res);
// }