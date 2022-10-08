import { DB } from '../databases/connection';

/**
 * Base model for querying tables.
 *
 */
export class Model
{
  /** @type {import('knex').Transaction} */
  static transaction;

  /**
   * @typedef ModelParams
   * @property {string} table Table to associate with this model.
   * @property {string} primaryKey Primary key of the table.
   * @property {string} singularName Singular name of the table name.
   * @property {string} defaultOrderByColumn Singular name of the table name.
   *
   * @param {ModelParams}
   */
  constructor({ table, primaryKey, singularName, defaultOrderByColumn, defaultOrder })
  {
    this.db = DB;

    /** @type {function(): import('knex').QueryBuilder} */
    this.query = () => DB(table);

    if(! table)
      throw new Error(`Please set the table field of the model for the '${table}' table.`);

    if(! primaryKey)
      throw new Error(`Please set the primary key field of the model for the '${table}' table.`);

    if(! singularName)
      throw new Error(`Please set the singular name field of the model for the '${table}' table.`);

    this.table = table;
    this.primaryKey = primaryKey;
    this.singularName = singularName;
    this.defaultOrderByColumn = defaultOrderByColumn;
    this.defaultOrder = defaultOrder;
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /**
   * Starts a database transaction that cna be used by any model subclass.
   */
  async startTransaction()
  {
    Model.transaction = await DB.transaction();
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /**
   * Ends the database transaction by either committing or doing a rollback.
   *
   * @param {boolean} toCommit Whether the transaction should be committed or not.
   */
  endTransaction(toCommit = true)
  {
    if(! Model.transaction)
      return;

    if(toCommit)
      Model.transaction.commit();
    else
      Model.transaction.rollback();

    Model.transaction = null;
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /**
   * Gets all records.
   *
   * @param {number} page Number of the page of records to get (for pagination).
   * @param {limit} limit Number of records to get.
   */
  findAll(page = 1, limit = 10)
  {
    const query = (Model.transaction ? Model.transaction(this.table) : this.query())
      .orderBy(this.defaultOrderByColumn || `${this.singularName}_id`, this.defaultOrder || 'asc')
      .limit(limit)
      .offset(limit * (page - 1));

    this.lastQuery = query.toQuery();

    return query;
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /**
   * Gets one record by id.
   *
   * @param {number} id ID of the record to get.
   */
  async find(id)
  {
    const query = (Model.transaction ? Model.transaction(this.table) : this.query())
      .where({ [this.primaryKey]: id })
      .first();

    this.lastQuery = query.toQuery();

    return query
      .then(result => result || 0);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /**
   * Creates a record and returns the inserted row.
   *
   * @param {{}} data Data to insert.
   * @param {string | string[]} [returnColumns] Columns to return.
   */
  async insert(data, returnColumns)
  {
    const query = (Model.transaction ? Model.transaction(this.table) : this.query())
      .insert(data)
      .returning(returnColumns || '*');

    this.lastQuery = query.toQuery();

    return query
      .then(result => result || 0);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /**
   * Edits a record.
   *
   * @param {number} id ID of the record to update.
   * @param {{}} data New data to set to the record.
   */
  async update(id, data)
  {
    const query = (Model.transaction ? Model.transaction(this.table) : this.query())
      .where({ [this.primaryKey]: id })
      .update(data)
      .returning('*');

    this.lastQuery = query.toQuery();

    return query
      .then(([ result ]) => result || 0);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /**
   * Deletes a record.
   *
   * @param {number} id ID of the record to delete.
   */
  delete(id)
  {
    const query = (Model.transaction ? Model.transaction(this.table) : this.query())
      .where({ [this.idColumn]: id })
      .delete();

    this.lastQuery = query.toQuery();

    return query;
  }
}
