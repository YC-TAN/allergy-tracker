import { beforeEach, describe, expect, it, vi } from "vitest";
import useNotificationStore from "./useNotificationStore";

describe("useNotificationStore", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    useNotificationStore.setState({
      notification: null,
      timeoutId: null,
    });
  });

  afterEach(() => {
    vi.useRealTimers()
  })

  it("shows a notification with the provided message and severity", () => {
    const { show } = useNotificationStore.getState().actions;

    show("Saved successfully", "success");

    expect(useNotificationStore.getState().notification).toEqual({
      message: "Saved successfully",
      severity: "success",
    });
  });

  it("clears the notification when close is called", () => {
    const { show, close } = useNotificationStore.getState().actions;

    show("Saved successfully", "success");
    close();

    expect(useNotificationStore.getState().notification).toBeNull();
    expect(useNotificationStore.getState().timeoutId).toBeNull();
  });

  it('defaults severity to info when not provided', () => {
    const { show } = useNotificationStore.getState().actions;

    show("hello");

    expect(useNotificationStore.getState().notification?.severity).toBe('info')
  })

  it('auto-clears after 5 seconds', () => {
    const { show } = useNotificationStore.getState().actions;
    show("Saved successfully", "success");

    vi.advanceTimersByTime(5000)

    expect(useNotificationStore.getState().notification).toBeNull()
  })

  it('does not clear before 5 seconds have elapsed', () => {
    const { show } = useNotificationStore.getState().actions;
    show("Saved successfully", "success");

    vi.advanceTimersByTime(4999)

    expect(useNotificationStore.getState().notification).not.toBeNull()
  })

  it("replaces the previous notification when shown again", () => {
    const { show } = useNotificationStore.getState().actions;

    show("First message", "info");
    vi.advanceTimersByTime(3000);

    show("Second message", "error");
    vi.advanceTimersByTime(3000);

    expect(useNotificationStore.getState().notification).toEqual({
      message: "Second message",
      severity: "error",
    });
  });
});