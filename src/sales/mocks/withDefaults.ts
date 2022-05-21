import { AccountsRepository } from "@auth/database/AccountsRepository";
import { StoresRepository } from "@auth/database/StoresRepository";
import {
  DbProductType,
  DbProduct,
  DbProductVariant
} from "@catalog/database/entities";
import { getRepositoryToken } from "@mikro-orm/nestjs";
import { mockSalesModule } from "@sales/mocks/sales.module.mock";

export const withDefaults = () => {
  return mockSalesModule()
    .overrideProvider(getRepositoryToken(DbProductType))
    .useValue({})
    .overrideProvider(getRepositoryToken(DbProduct))
    .useValue({})
    .overrideProvider(getRepositoryToken(DbProductVariant))
    .useValue({})
    .overrideProvider(AccountsRepository)
    .useValue({})
    .overrideProvider(StoresRepository)
    .useValue({});
};
