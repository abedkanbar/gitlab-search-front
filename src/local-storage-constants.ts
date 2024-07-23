export class LocalStorageConstants {
  static readonly Token = "token";
  static readonly RedirectUrl = "redirectUrl";
  static readonly SelectedGroup = "selectedGroup";
  static readonly ThemeUserPreference = "themeUserPreference";

  // Stocker une valeur dans le localStorage
  static setItem(key: string, value: string | number | object): void {
    let valueToStore = value;
    if (typeof value === "object") {
      valueToStore = JSON.stringify(value);
    }
    localStorage.setItem(key, valueToStore as string);
  }

  // Récupérer une valeur du localStorage
  static getString(key: string): string | null {
    const value = localStorage.getItem(key);
    return value;
  }

  static getItem<T>(key: string): T {
    const value = localStorage.getItem(key);
    try {
      return JSON.parse(value as string) as T;
    } catch {
      return null;
    }
  }

  static removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}
