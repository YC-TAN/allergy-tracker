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

export const upsertRemoteEntry = async (entry: EntryInput): Promise<EntryResponse> => {
// Throws a ZodError with a if the shape is wrong.
  const validated = EntrySchema.parse(entry);

  const res = await apiFetch<unknown>(`${baseUrl}/${validated.date}`, {
    method: 'PUT',
    body: JSON.stringify(validated),
  });

  return EntryResponseSchema.parse(res);
}

export async function getRemoteEntry(date: string): Promise<EntryResponse | null> {
  try {
    const res = await apiFetch<unknown>(`${baseUrl}/${date}`, { method: 'GET' });
    return EntryResponseSchema.parse(res);
  }
  catch (err) {
    if (err instanceof ApiError && err.statusCode === 404) return null;
    throw err;
  }  
}

export async function getRemoteEntries(days: number): Promise<EntryResponse[]> {
  const res = await apiFetch<unknown[]>(`${baseUrl}?days=${days}`, { method: 'GET' });
  const valid: EntryResponse[] = [];
  for (const item of res) {
    const result = EntryResponseSchema.safeParse(item);
    if (result.success) valid.push(result.data);
    else console.error("Skipping invalid server entry", result.error);
  }
  return valid;
}

export async function migrateEntries(entries: EntryInput[]): Promise<MigrateResponse> {
  const res = await apiFetch<unknown>(`${baseUrl}/migrate`, {
    method: 'POST',
    body: JSON.stringify({ entries }),
  });
  return MigrateResponseSchema.parse(res);
}