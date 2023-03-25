import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveData = async (KEY, data) => {
  try {
    await AsyncStorage.setItem(KEY, data);
  } catch (e) {
    alert('Failed to save the data to the storage');
  }
};

export const readData = async KEY => {
  try {
    const value = await AsyncStorage.getItem(KEY);
    return value;
  } catch (e) {
    alert('Failed to fetch the input from storage');
  }
};

export function trimObj(obj) {
  if (!Array.isArray(obj) && typeof obj != 'object') return obj;
  return Object.keys(obj).reduce(
    function (acc, key) {
      acc[key.trim()] =
        typeof obj[key] == 'string' ? obj[key].trim() : trimObj(obj[key]);
      return acc;
    },
    Array.isArray(obj) ? [] : {},
  );
}

export function removeEmpty(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != ''));
}
