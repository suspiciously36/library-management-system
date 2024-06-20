export const dateTypeTransformer = (obj: any): Date => {
  return obj instanceof Date ? obj : new Date(obj);
};
