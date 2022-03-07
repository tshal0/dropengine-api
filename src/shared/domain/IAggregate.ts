export abstract class IAggregate<Value, DbEntity, Props> {
  public abstract value(): Value;
  public abstract entity(): DbEntity;
  public abstract props(): Props;
  protected constructor(protected _props: Value, protected _entity: DbEntity) {}
}
