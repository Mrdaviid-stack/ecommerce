import { db } from '../../../databases/connection'
import { Model } from '../../../databases/BaseModel'

export class AuthModel extends Model {

  constructor() {

    const fields = {
      id: 'user_id',
      uuid: 'user_uuid',
      email: 'user_email',
      username: 'user_username',
      password: 'user_password',
      token: 'user_refresh_token'
    }

    super(
    {
      table: 'users',
      primaryKey: fields.uuid,
      singularName: 'user',
      defaultOrderByColumn: fields.id,
    });
  
    this.fields = fields;

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
