const ITicketRepository = require('./ITicketRepository');
const Ticket = require('../models/Ticket');

class TicketRepository extends ITicketRepository {
  async createTicket(ticketData) {
    try {
      const ticket = new Ticket(ticketData);
      return await ticket.save();
    } catch (error) {
      throw new Error('Error creating ticket: ' + error.message);
    }
  }

  async getTicketById(id) {
    try {
      return await Ticket.findById(id);
    } catch (error) {
      throw new Error('Error finding ticket by id: ' + error.message);
    }
  }
}

module.exports = TicketRepository;
