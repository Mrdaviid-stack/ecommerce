import { db } from '../../../databases/connection'

export const AuthModels = new class {

  constructor() {

    const fields = {
      id: 'user_id',
      uuid: 'user_uuid',
      email: 'user_email',
      username: 'user_username',
      password: 'user_password',
      token: 'user_refresh_token'
    }

    this.fields = fields
    this.table = 'users'

  }

  async findUser(identity) {
    let query = db.table(this.table)
      .where({[this.fields.username]: identity})
      .or.where({[this.fields.email]: identity})
      .first()
    
    return query
  }

  async updateToken(id, token) {
    let query = db.table(this.table)
      .update({[this.fields.token]: token})
      .where({[this.fields.id]: id})

    return query
  }

  async findToken(token) {
    let query = db.table(this.table)
      .where({[this.fields.token]: token})
      .first()
    return query
  }

}