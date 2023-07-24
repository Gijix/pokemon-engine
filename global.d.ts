declare interface ObjectConstructor {
  keys<T> (object: T): (keyof T)[]
}
