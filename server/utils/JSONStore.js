const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class JSONStore {
  constructor(filename) {
    this.filepath = path.join(DATA_DIR, `${filename}.json`);
    this.data = [];
    this.load();
  }

  load() {
    if (fs.existsSync(this.filepath)) {
      try {
        const raw = fs.readFileSync(this.filepath, 'utf8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error(`Error reading ${this.filepath}`, err);
        this.data = [];
      }
    } else {
      this.data = [];
      this.save();
    }
  }

  save() {
    // Write synchronously for robust atomicity in simple local setup
    fs.writeFileSync(this.filepath, JSON.stringify(this.data, null, 2), 'utf8');
  }

  find(query = {}) {
    return this.data.filter(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  }

  findOne(query) {
    const results = this.find(query);
    return results.length > 0 ? results[0] : null;
  }

  findById(id) {
    return this.findOne({ _id: id });
  }

  insert(record) {
    if (!record._id) {
      record._id = uuidv4();
    }
    this.data.push(record);
    this.save();
    return record;
  }

  update(id, updates) {
    const index = this.data.findIndex(item => item._id === id);
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...updates };
      this.save();
      return this.data[index];
    }
    return null;
  }
}

module.exports = JSONStore;
