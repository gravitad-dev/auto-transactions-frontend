export const processFile = async (file) => {
  const fileText = await file.text();
  return JSON.parse(fileText);
};
