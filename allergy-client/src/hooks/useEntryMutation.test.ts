import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEntry } from "./useEntryMutation";
import * as entryService from "../services/entry";
import * as dexie from "../db/entries";
import { createWrapper } from "../test-utils";
import type { EntryInput, EntryLocal } from "../schemas";
import { AUTH_USER_KEY } from "./useAuth";

const mockEntry: EntryInput = {
  date: "2026-06-25",
  severity: 2,
  symptoms: ["nose"],
  notes: "",
  location: "Christchurch Central",
  honey: true,
};

beforeEach(() => {
  // localStorage.clear()
  vi.restoreAllMocks();
});

const createSignedInWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  queryClient.setQueryData(AUTH_USER_KEY, { id: "user-1" });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useEntry", () => {
  it("returns null when no entry exists", async () => {
    const { result } = renderHook(() => useEntry("2026-06-25"), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(result.current.entry).toBeNull();
  });

  it("returns entry after saving", async () => {
    const { result } = renderHook(() => useEntry("2026-06-25"), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isPending).toBe(false));

    act(() => {
      result.current.save(mockEntry);
    });

    await waitFor(() =>
      expect(result.current.entry).toMatchObject({
        severity: 2,
        date: "2026-06-25",
        symptoms: ["nose"],
        notes: "",
        location: "Christchurch Central",
        honey: true,
      }),
    );
  });

  it("updates query cache on save without refetching", async () => {
    const spy = vi.spyOn(dexie, "getLocalEntry");
    const { result } = renderHook(() => useEntry("2026-06-25"), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isPending).toBe(false));

    act(() => {
      result.current.save(mockEntry);
    });
    await waitFor(() => expect(result.current.entry).not.toBeNull());

    // getEntry called once on mount, not again after save (cache was set directly)
    expect(spy).toHaveBeenCalledTimes(1);
  });

  // it("shows a success notification after saving", async () => {
  // const spy = vi.spyOn(storage, 'getLocalEntry')
  //   const { result } = renderHook(() => useEntry('2026-06-25'), { wrapper: createWrapper() })
  //   await waitFor(() => expect(result.current.isPending).toBe(false))

  //   act(() => { result.current.save(mockEntry) })

  // expect(useNotificationStore.getState().notification).toEqual({
  //   message: "Saved on device",
  //   severity: "success",
  // });
  // });

  it("defaults to today when no date passed", async () => {
    const spy = vi.spyOn(dexie, "getLocalEntry");
    const { result } = renderHook(() => useEntry(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(spy).toHaveBeenCalledWith(
      expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
    );
  });

  it("returns an unsynced local entry without fetching remotely", async () => {
    const localEntry: EntryLocal = {
      date: "2026-06-25",
      severity: 2,
      symptoms: ["nose"],
      notes: "",
      location: "Christchurch Central",
      honey: true,
      _synced: false,
      _revision: 0,
      _v: 2,
    };

    const localSpy = vi
      .spyOn(dexie, "getLocalEntry")
      .mockResolvedValue(localEntry);
    const remoteSpy = vi.spyOn(entryService, "getRemoteEntry");

    const { result } = renderHook(() => useEntry("2026-06-25"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current.entry).toEqual(localEntry);
    expect(localSpy).toHaveBeenCalledWith("2026-06-25");
    expect(remoteSpy).not.toHaveBeenCalled();
  });

  it("refreshes a synced local entry from the server when signed in", async () => {
    const localEntry: EntryLocal = {
      date: "2026-06-25",
      severity: 1,
      symptoms: ["nose"],
      notes: "",
      location: "Christchurch Central",
      honey: false,
      _synced: true,
      _revision: 0,
      _v: 2,
    };
    const remoteEntry = { ...localEntry, severity: 3, _synced: true };

    vi.spyOn(dexie, "getLocalEntry").mockResolvedValue(localEntry);
    const remoteSpy = vi
      .spyOn(entryService, "getRemoteEntry")
      .mockResolvedValue(remoteEntry);

    const { result } = renderHook(() => useEntry("2026-06-25"), {
      wrapper: createSignedInWrapper(),
    });

    await waitFor(() => expect(result.current.entry?.severity).toBe(3));
    expect(remoteSpy).toHaveBeenCalledWith("2026-06-25");
  });

  it("falls back to a cached entry when the network request fails", async () => {
    const localEntry: EntryLocal = {
      date: "2026-06-25",
      severity: 2,
      symptoms: ["nose"],
      notes: "",
      location: "Christchurch Central",
      honey: true,
      _synced: true,
      _revision: 0,
      _v: 2,
    };

    vi.spyOn(dexie, "getLocalEntry").mockResolvedValue(localEntry);
    vi.spyOn(entryService, "getRemoteEntry").mockRejectedValue(
      new TypeError("Failed to fetch"),
    );

    const { result } = renderHook(() => useEntry("2026-06-25"), {
      wrapper: createSignedInWrapper(),
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(result.current.entry).toEqual(localEntry);
    expect(result.current.isError).toBe(false);
  });
});

// return no entry when no local and not signed in

// fetch and cache remote entry if signed in
// return null if both local and remote have no entry
