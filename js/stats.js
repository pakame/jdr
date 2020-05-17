export default class Stats {
  /**
   * @param {Array<string>} statistics
   */
  constructor(statistics) {
    this.stats = {};

    for (let stats of statistics) {
      this.stats[stats] = null;
    }
  }

  load() {
    for (let stats in this.stats) {
      const value = parseInt(localStorage.getItem(stats), 10);

      if (!isNaN(value)) {
        this.stats[stats] = value;
      }
    }
  }

  set(name, value) {
    this.stats[name] = value;

    localStorage.setItem(name, value);
  }

  get(name) {
    return this.stats[name];
  }

  each(callback) {
    for (let stats in this.stats) {
      callback(stats, this.stats[stats]);
    }
  }
}
