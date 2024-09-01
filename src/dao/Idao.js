class IDao {
    async create(item) { throw new Error('Not implemented'); }
    async getById(id) { throw new Error('Not implemented'); }
    async getAll() { throw new Error('Not implemented'); }
    async update(id, item) { throw new Error('Not implemented'); }
    async delete(id) { throw new Error('Not implemented'); }
  }
  
  module.exports = IDao;
  