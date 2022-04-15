export abstract class IAggregate<Props, Value, DbEntity> {
  public abstract entity(): DbEntity;
  public abstract props(): Props;
  protected constructor(protected _value: Value, protected _entity: DbEntity) {}
}
