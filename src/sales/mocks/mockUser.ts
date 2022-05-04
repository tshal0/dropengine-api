import { AuthenticatedUser } from "@shared/decorators";

export function newMockUser() {
  return new AuthenticatedUser({
    email: "mockUser@email.com",
    id: "MOCK_USER_ID",
    metadata: {
      accounts: [
        {
          companyCode: "MOCK_COMPANY_CODE",
          id: "MOCK_ACCOUNT_ID",
          name: "Mock Company",
          permissions: ["manage:orders"],
          roles: [],
        },
      ],
      authorization: {},
    },
  });
}
