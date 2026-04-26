const JSONStore = require('../utils/JSONStore');

let storeInstance = null;
const getStore = () => {
  if (!storeInstance) storeInstance = new JSONStore('interviews');
  return storeInstance;
};

class InterviewHistory {
  constructor(data) {
    Object.assign(this, data);
    if (!this.createdAt) this.createdAt = new Date().toISOString();
    if (!this.role) this.role = 'general';
    if (!this.overallScore) this.overallScore = 0;
    if (!this.questions) this.questions = [];
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

  static async find(query) {
    const dataList = getStore().find(query);
    return dataList.map(data => new InterviewHistory(data));
  }
}

module.exports = InterviewHistory;
