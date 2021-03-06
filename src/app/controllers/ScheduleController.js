const Schedule = require('../models/Schedule')

const { changeTimezone } = require('../../utils')

/*
index (listar)
show (único registro retornado)
store (criação)
update (alteração)
destroy (exclusão)
*/

module.exports = {
  async index(request, response) {
    const { id_professional } = request.params

    const today = changeTimezone(new Date(), 'America/Sao_Paulo')
    const todayWithoutHours = changeTimezone(
      new Date(today.getFullYear(), today.getMonth(), today.getDate()
      ), 'America/Sao_Paulo')

    const schedule = await Schedule.find({
      id_professional,
      marked_date: { $gte: todayWithoutHours }
    })

    return response.json(schedule)
  },

  async store(request, response) {
    try {
      const {
        id_professional, id_user, username, marked_date, total, description
      } = request.body

      let schedule = await Schedule.findOne({
        id_professional,
        marked_date
      })

      if (schedule) {
        return response.json({ message: 'Hour already taken' })
      }

      schedule = await Schedule.create({
        id_professional,
        id_user,
        username,
        marked_date,
        total,
        description
      })

      return response.json({ schedule })
    } catch {
      return response.status(400).json({
        message: 'Schedule registration failed'
      })
    }
  }
}
