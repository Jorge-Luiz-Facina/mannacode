export const generateKey = (size) => {
  return Math.random().toString(36).slice(-size);
};