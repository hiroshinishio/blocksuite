export class FixedArray<T> {
  private _store: T[] = [];

  constructor(private readonly _default: T) {}

  private _arrayFill<T>(length: number, value: T): T[] {
    const arr: T[] = [];
    for (let i = 0; i < length; i++) {
      arr.push(value);
    }
    return arr;
  }

  private _arrayInsert<T>(arr: T[], index: number, elements: T[]): T[] {
    return arr.slice(0, index).concat(elements, arr.slice(index));
  }

  get(index: number): T {
    if (index > 0 && index < this._store.length) {
      return this._store[index];
    }
    return this._default;
  }

  set(index: number, value: T): void {
    while (index >= this._store.length) {
      this._store.push(this._default);
    }
    this._store[index] = value;
  }

  replace(index: number, oldLength: number, newLength: number): void {
    if (index >= this._store.length) {
      return;
    }

    if (oldLength === 0) {
      this.insert(index, newLength);
      return;
    } else if (newLength === 0) {
      this.delete(index, oldLength);
      return;
    }

    const before = this._store.slice(0, index);
    const after = this._store.slice(index + oldLength);
    const insertArr = this._arrayFill(newLength, this._default);
    this._store = before.concat(insertArr, after);
  }

  delete(deleteIndex: number, deleteCount: number): void {
    if (deleteCount === 0 || deleteIndex >= this._store.length) {
      return;
    }
    this._store.splice(deleteIndex, deleteCount);
  }

  insert(insertIndex: number, insertCount: number): void {
    if (insertCount === 0) {
      return;
    }
    const arr: T[] = this._arrayFill(insertCount, this._default);
    this._store = this._arrayInsert(this._store, insertIndex, arr);
  }
}
