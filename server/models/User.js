const JSONStore = require('../utils/JSONStore');

let storeInstance = null;
const getStore = () => {
  if (!storeInstance) storeInstance = new JSONStore('users');
  return storeInstance;
};

class User {
  constructor(data) {
    Object.assign(this, data);
    if (!this.createdAt) this.createdAt = new Date().toISOString();
    if (!this.role) this.role = 'general';
    if (!this.stats) {
      this.stats = {
        interviewCount: 0,
        totalScore: 0,
        weakTopics: {},
        streak: 0,
        badges: [],
      };
    }
  }

  async save() {
    const store = getStore();
    if (this._id) {
      store.update(this._id, this);
    } else {
      const record = store.insert(this);
      this._id = record._id;
    }
    return this;
  }

  static async findOne(query) {
    const data = getStore().findOne(query);
    return data ? new User(data) : null;
  }

  static async findById(id) {
    const data = getStore().findById(id);
    return data ? new User(data) : null;
  }
}

module.exports = User;
