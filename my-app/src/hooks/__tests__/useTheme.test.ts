import { renderHook, act, waitFor } from "@testing-library/react";
import { useTheme } from "../useTheme";

describe("useTheme Hook", () => {
  let classList: Set<string>;
  let storage: Record<string, string>;

  beforeEach(() => {
    classList = new Set();
    storage = {};

    // Mock document.documentElement.classList
    Object.defineProperty(document, "documentElement", {
      value: {
        classList: {
          add: (...tokens: string[]) => tokens.forEach((t) => classList.add(t)),
          remove: (...tokens: string[]) => tokens.forEach((t) => classList.delete(t)),
          contains: (token: string) => classList.has(token),
        },
      },
      writable: true,
    });

    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: (key: string) => storage[key] ?? null,
        setItem: (key: string, value: string) => {
          storage[key] = value;
        },
      },
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should default to 'void' theme and initialize correctly", async () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("void");
    expect(result.current.isVoid).toBe(true);
    expect(result.current.isRealm).toBe(false);

    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });

    expect(classList.has("dark")).toBe(true);
    expect(classList.has("light")).toBe(false);
  });

  it("should initialize from localStorage with 'realm' value", async () => {
    storage["theme"] = "realm";

    const { result } = renderHook(() => useTheme());

    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });

    expect(result.current.theme).toBe("realm");
    expect(result.current.isVoid).toBe(false);
    expect(result.current.isRealm).toBe(true);
    expect(classList.has("light")).toBe(true);
    expect(classList.has("dark")).toBe(false);
  });

  it("should migrate legacy 'cosmic' theme to 'void'", async () => {
    storage["theme"] = "cosmic";

    const { result } = renderHook(() => useTheme());

    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });

    expect(result.current.theme).toBe("void");
    expect(classList.has("dark")).toBe(true);
    expect(classList.has("light")).toBe(false);
  });

  it("should migrate legacy 'solar' theme to 'realm'", async () => {
    storage["theme"] = "solar";

    const { result } = renderHook(() => useTheme());

    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });

    expect(result.current.theme).toBe("realm");
    expect(classList.has("light")).toBe(true);
    expect(classList.has("dark")).toBe(false);
  });

  it("should toggle theme from void to realm and update localStorage", async () => {
    const { result } = renderHook(() => useTheme());

    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("realm");
    expect(result.current.isRealm).toBe(true);
    expect(classList.has("light")).toBe(true);
    expect(classList.has("dark")).toBe(false);
    expect(storage["theme"]).toBe("realm");
  });

  it("should toggle theme back to void", async () => {
    storage["theme"] = "realm";

    const { result } = renderHook(() => useTheme());

    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("void");
    expect(result.current.isVoid).toBe(true);
    expect(classList.has("dark")).toBe(true);
    expect(classList.has("light")).toBe(false);
    expect(storage["theme"]).toBe("void");
  });

  it("should set theme explicitly via setTheme", async () => {
    const { result } = renderHook(() => useTheme());

    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });

    act(() => {
      result.current.setTheme("realm");
    });

    expect(result.current.theme).toBe("realm");
    expect(storage["theme"]).toBe("realm");
    expect(classList.has("light")).toBe(true);

    act(() => {
      result.current.setTheme("void");
    });

    expect(result.current.theme).toBe("void");
    expect(storage["theme"]).toBe("void");
    expect(classList.has("dark")).toBe(true);
  });

  it("should handle invalid localStorage value gracefully", async () => {
    storage["theme"] = "invalid-value";

    const { result } = renderHook(() => useTheme());

    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });

    expect(result.current.theme).toBe("void");
    expect(classList.has("dark")).toBe(true);
  });
});
