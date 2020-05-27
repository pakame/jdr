import cache from "./cache.js";

export default class Player {
  constructor({status = {}, statistics = []}) {
    const {life = 0, destiny = 0} = status;

    this.life = life;
    this.destiny = destiny;

    this.stats = {};

    for (let stats of statistics) {
      this.stats[stats] = null;
    }
  }

  load() {
    const {life, destiny, stats = {}} = cache.get('player') || {};

    if (life != null)
      this.life = life;

    if (destiny != null)
      this.destiny = destiny;

    for (let stat in this.stats) {
      this.stats[stat] = parseInt(stats[stat] || 0);
    }
  }

  save() {
    cache.set('player', this);
  }

  getStat(stat) {
    return this.stats[stat]
  }

  setStat(stat, value) {
    this.stats[stat] = parseInt(value);

    this.save();
  }

  getLife() {
    return this.life;
  }

  incLife() {
    this.life++;
    this.save()
  }

  decLife() {
    if (this.life) {
      this.life--;
      this.save()
    }
  }


  getDestiny() {
    return this.destiny;
  }

  incDestiny() {
    this.destiny++;
    this.save()
  }

  decDestiny() {
    if (this.destiny) {
      this.destiny--;
      this.save()
    }
  }
}
