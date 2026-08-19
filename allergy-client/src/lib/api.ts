const API_URL = '/api';

const apiFetch = async <T>(path: string, options: RequestInit = {}): Promise<T> => {

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail ?? `Request failed: ${response.status}`);
  }

  return response.json();
}

export default apiFetch;

// export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
// //   const { data: { session } } = await supabase.auth.getSession();

//   const res = await fetch(`${API_URL}${path}`, {
//     ...options,
//     headers: {
//       'Content-Type': 'application/json',
//     //   ...(session && { Authorization: `Bearer ${session.access_token}` }),
//       ...options.headers,
//     },
//   });

//   if (!res.ok) {
//     const body = await res.json().catch(() => null);
//     throw new Error(body?.detail ?? `Request failed: ${res.status}`);
//   }

//   return res.json();
// }
