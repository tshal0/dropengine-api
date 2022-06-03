import { SalesOrder } from "@sales/domain";
import mongoose from "mongoose";
import { StringQueryArgs } from "./StringQueryArgs";

/**
 * TODO: SOMEDAY
 * SalesOrderQuery
 * :in()
 * :-in()
 * :
 * :-
 * :<
 * :>
 * :<=
 * :>=
 * AND
 * OR --
 * () -- grouping
 * * -- exists
 * query="merchant:-in('Metal Unlimited')" >> {filter:{merchant.name : {$nin: ['Metal Unlimited'] }}}
 * query="merchant:-'Metal Unlimited'" >> {filter:{merchant.name : {$ne: 'Metal Unlimited' }}}
 * query="seller:-shine_on" >> {filter: {seller : {$ne: 'shine_on' }}}
 * query="(seller:-shine_on) AND (merchant:-in('Metal Unlimited'))"
 *      >> {filter: {$and: [{seller: {$ne: 'shine_on'}}, {merchant: {$nin['Metal Unlimited']}}]}}
 */

export class SalesOrderQuery {
  public static parse(str: string): mongoose.FilterQuery<SalesOrder> {
    let query: mongoose.FilterQuery<SalesOrder> = {};
    try {
      query = JSON.parse(str);
    } catch (err) {
      console.error(err);
    }
    return query;
  }
}
