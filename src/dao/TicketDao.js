const IDao = require('./Idao.js');
const Ticket = require('./models/Ticket');

class TicketDao extends IDao {
  async create(ticket) {
    try {
      const newTicket = new Ticket(ticket);
      return await newTicket.save();
    } catch (error) {
      throw new Error('Error creating ticket: ' + error.message);
    }
  }

  async getById(id) {
    try {
      return await Ticket.findById(id);
    } catch (error) {
      throw new Error('Error finding ticket by id: ' + error.message);
    }
  }

  async getAll() {
    try {
      return await Ticket.find();
    } catch (error) {
      throw new Error('Error getting all tickets: ' + error.message);
    }
  }

  async update(id, ticket) {
    try {
      return await Ticket.findByIdAndUpdate(id, ticket, { new: true });
    } catch (error) {
      throw new Error('Error updating ticket: ' + error.message);
    }
  }

  async delete(id) {
    try {
      return await Ticket.findByIdAndDelete(id);
    } catch (error) {
      throw new Error('Error deleting ticket: ' + error.message);
    }
  }
}

module.exports = TicketDao;
