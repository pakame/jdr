export default new class Cache {
  constructor() {
    this.store = localStorage;
  }

  set(key, value) {
    this.store.setItem(key, JSON.stringify(value));
  }

  get(key) {
    const value = this.store.getItem(key);

    if (value == null) {
      return null
    }

    return JSON.parse(value)
  }
}();
