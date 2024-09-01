const IDao = require('./Idao.js');
const User = require('./models/User');

class UserDao extends IDao {
  async create(user) {
    try {
      const newUser = new User(user);
      return await newUser.save();
    } catch (error) {
      throw new Error('Error creating user: ' + error.message);
    }
  }

  async getById(id) {
    try {
      return await User.findById(id);
    } catch (error) {
      throw new Error('Error finding user by id: ' + error.message);
    }
  }

  async getAll() {
    try {
      return await User.find();
    } catch (error) {
      throw new Error('Error getting all users: ' + error.message);
    }
  }

  async update(id, user) {
    try {
      return await User.findByIdAndUpdate(id, user, { new: true });
    } catch (error) {
      throw new Error('Error updating user: ' + error.message);
    }
  }

  async delete(id) {
    try {
      return await User.findByIdAndDelete(id);
    } catch (error) {
      throw new Error('Error deleting user: ' + error.message);
    }
  }
}

module.exports = UserDao;
