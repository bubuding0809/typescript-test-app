export const getLocalStorage = (key: string, defaultValue: any): any => {
  const item = window.localStorage.getItem(key);
  if (item !== null) {
    return JSON.parse(item);
  } else {
    return defaultValue;
  }
};

export const setLocalStorage = (key: string, valuetoStore: any): void => {
  window.localStorage.setItem(key, JSON.stringify(valuetoStore));
};
