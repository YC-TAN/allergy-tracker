import { renderHook, act, waitFor } from "@testing-library/react";
import { useEntry } from "./useEntry";
// import * as storage from '../utils/storage'
import * as entryService from "../services/entry";
import * as dexie from "../db/entries";
import { createWrapper } from "../test-utils";
import type { EntryInput, EntryLocal } from "../schemas";

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

  it("returns the local entry without fetching remotely", async () => {
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
});

// return no entry when no local and not signed in

// fetch and cache remote entry if signed in
// return null if both local and remote have no entry
