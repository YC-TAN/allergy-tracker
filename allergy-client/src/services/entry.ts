import apiFetch from '../lib/api';
import {
  EntrySchema,
  EntryResponseSchema,
  type EntryResponse,
  type EntryInput,
} from '../schemas/index';

const baseUrl = "/entries";

export const upsertEntry = async (entry: EntryInput): Promise<EntryResponse> => {
// Throws a ZodError with a if the shape is wrong.
  const validated = EntrySchema.parse(entry);

  const res = await apiFetch<unknown>(`${baseUrl}`, {
    method: 'POST',
    body: JSON.stringify(validated),
  });

  return EntryResponseSchema.parse(res);
}

export async function getEntry(date: string): Promise<EntryResponse | null> {
  const res = await apiFetch<unknown>(`${baseUrl}/${date}`, { method: 'GET' });
  if (res === null) return null;
  return EntryResponseSchema.parse(res);
}

export async function getEntries(from: string, to: string): Promise<EntryResponse[]> {
  const res = await apiFetch<unknown[]>(`${baseUrl}?from=${from}&to=${to}`, { method: 'GET' });
  return res.map((r) => EntryResponseSchema.parse(r));
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