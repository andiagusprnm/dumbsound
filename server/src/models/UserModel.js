const { user } = require('../../models')
const bcrypt = require('bcrypt')
const NotFoundError = require('../exceptions/NotFoundError')
const AuthenticationError = require('../exceptions/AuthenticationError')
const InvariantError = require('../exceptions/InvariantError')

const UserModel = {
  postRegister: async function (data) {
    const { password } = data
    await this.checkEmail(data.email)
    const hashedPassword = await bcrypt.hash(password, 10)
    const create = await user.create({ ...data, password: hashedPassword })
    const result = await user.findOne({ where: { id: create.id } })
    if (!result) {
      throw new AuthenticationError('user not found')
    }
    return ({
      id: result.id,
      fullName: result.fullName,
      email: result.email,
      status: result.listAs,
      subscribe: result.subscribe
    })
  },
  checkEmail: async function (email) {
    const result = await user.findOne({
      attributes: ['id', 'email'],
      where: { email: email }
    })
    if (result) {
      throw new InvariantError('Email already exist')
    }
  },
  postLogin: async function ({ email, password }) {
    const result = await user.findOne({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      where: { email: email }
    })
    if (!result) {
      throw new AuthenticationError('email or password invalid')
    }
    const match = await bcrypt.compare(password, result.password)
    if (!match) {
      throw new AuthenticationError('email or password invalid')
    }
    return ({
      id: result.id,
      fullName: result.fullName,
      email: result.email,
      status: result.listAs,
      subscribe: result.subscribe
    })
  },
  getUserByEmail: async function (email) {
    const result = await user.findOne({
      where: { email: email },
      attributes: ['id', 'email', 'fullName', 'subscribe', ['listAs', 'status']]
    })
    if (!result) throw new AuthenticationError('Please login again')
    return result
  }
}

module.exports = { UserModel }
