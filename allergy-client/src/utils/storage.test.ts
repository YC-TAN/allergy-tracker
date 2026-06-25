import {
  getEntry,
  saveEntry,
  clearAllEntries,
  getSettings,
  setSettings,
  clearSettings,
} from "./storage";
import { getTodayDate } from "./dates";
import { type EntryInput } from "../schemas";

const today: string = getTodayDate();
const test_entry_key: string = "test_allergy_entries";
const test_settings_key: string = "test_settings";

const mockEntry: EntryInput = {
  date: today,
  severity: 2,
  symptoms: ["nose", "eyes"],
  notes: "taken antihistamine",
};

beforeEach(() => {
  clearAllEntries(test_entry_key); // fresh localStorage for every test
  clearSettings(test_settings_key)
});

describe("getEntry", () => {
  it("returns null for a date with no entry", () => {
    expect(getEntry(today, test_entry_key)).toBeNull();
  });

  it("returns the entry after saving", () => {
    const parsed = saveEntry(mockEntry, test_entry_key);
    expect(getEntry(today, test_entry_key)).toEqual(parsed);
  });
});

describe("saveEntry", () => {
  it("returns the parsed entry with defaults filled in", () => {
    const result = saveEntry(mockEntry, test_entry_key);
    expect(result).toMatchObject({ date: today, severity: 2 });
    expect(result.id).toBeDefined();
    expect(result._synced).toBe(false);
    expect(result._v).toBe(1);
  });

  it("overwrites an existing entry for the same date", () => {
    saveEntry(mockEntry, test_entry_key);
    saveEntry({ ...mockEntry, severity: 1 }, test_entry_key);
    expect(getEntry(today, test_entry_key)?.severity).toBe(1);
  });

  it("throws on invalid severity", () => {
    expect(() =>
      saveEntry({ ...mockEntry, severity: 99 as never }, test_entry_key),
    ).toThrow();
  });
});

describe("Settings", () => {
  it("returns defaults when nothing is stored", () => {
    const s = getSettings(test_settings_key);
    expect(s.notify).toBe(false);
    expect(s.notify_time).toBe("20:00");
  });

  it("set and get settings correctly", () => {
    setSettings({ notify: true, notify_time: "08:00" });
    expect(getSettings()).toEqual({ notify: true, notify_time: "08:00" });
  });
});
