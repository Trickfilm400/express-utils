export interface IDefaultService<T> {
  //fetch data
  get: (id?: string) => Promise<T | T[] | null>;
  //delete data
  delete: (id: string) => Promise<boolean>;
  //exec actions && create new data without knowing new data url
  post: (obj: T) => Promise<T>;
  //create new data with new url known
  put: (id: string, obj: T) => Promise<T>;
  //update data
  patch: (id: string, obj: T) => Promise<T | null>;
}
