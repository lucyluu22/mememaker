declare type RequireOnly<T, K extends keyof T> = Pick<T, K> & Partial<T>
