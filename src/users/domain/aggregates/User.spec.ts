import { NotImplementedException } from "@nestjs/common";
import { UUID } from "@shared/domain";
import moment from "moment";

import {
  CreateAuth0UserResponseDto,
  CreateUserDto,
} from "@users/dto/CreateUserDto";
import { User } from "./User";
import { IUserProps } from "../interfaces";
import { DbUser } from "../entities/User.entity";

jest
  .spyOn(global.Date, "now")
  .mockImplementation(() => new Date("2021-01-01T00:00:00.000Z").valueOf());
describe(`User`, () => {
  const mockUserId = "00000000-0000-0000-0000-000000000001";
  const mockUserUuid = UUID.from(mockUserId);

  const mockGenUserId = jest.fn().mockReturnValue(mockUserUuid);
  const now = moment().toDate();
  const baseCreateUserDto: CreateUserDto = {
    email: "MOCK_EMAIL",
    firstName: "MOCK_FIRST_NAME",
    lastName: "MOCK_LAST_NAME",
    password: "MOCK_PASSWORD",
  };
  const baseExpectedProps: IUserProps = {
    id: mockUserId,
    email: "MOCK_EMAIL",
    firstName: "MOCK_FIRST_NAME",
    lastName: "MOCK_LAST_NAME",
    status: "DEACTIVATED",
    externalUserId: undefined,
    picture: undefined,
    createdAt: now,
    updatedAt: now,
  };
  const mockDbUser = () => {
    let dbe: DbUser = new DbUser();
    dbe.id = mockUserId;
    dbe.email = "MOCK_EMAIL";
    dbe.firstName = "MOCK_FIRST_NAME";
    dbe.lastName = "MOCK_LAST_NAME";
    dbe.status = "DEACTIVATED";
    dbe.externalUserId = undefined;
    dbe.picture = undefined;
    dbe.createdAt = now;
    dbe.updatedAt = now;
    return dbe;
  };
  describe(`create`, () => {
    describe("with a valid DTO", () => {
      it(`should generate a valid User`, () => {
        User.generateUuid = mockGenUserId;
        let dto = { ...baseCreateUserDto };
        let result = User.create(dto);
        expect(result.isSuccess).toBe(true);
        let user = result.value();
        let props = user.props();

        expect(props).toEqual(baseExpectedProps);
      });
    });
  });

  describe(`db`, () => {
    describe("with a valid DbUser Aggregate", () => {
      it(`should load a valid User`, () => {
        const dbe = mockDbUser();
        let result = User.db(dbe);
        expect(result.isSuccess).toBe(true);
        let user = result.value();
        let props = user.props();

        expect(props).toEqual(baseExpectedProps);
      });
    });
  });

  describe(`applyAuth0Response`, () => {
    let dbe: DbUser = new DbUser();
    let mockUser: User = null;
    const baseActivatedUserProps = {
      createdAt: now,
      email: "MOCK_EMAIL",
      externalUserId: "auth0|MOCK_AUTH0_ID",
      firstName: "MOCK_FIRST_NAME",
      id: "00000000-0000-0000-0000-000000000001",
      lastName: "MOCK_LAST_NAME",
      picture: "MOCK_PICTURE",
      status: "ACTIVATED",
      updatedAt: now,
    };
    beforeEach(() => {
      dbe = mockDbUser();
      let result = User.db(dbe);
      mockUser = result.value();
    });
    it(`should update the users externalUserId, email, picture, first, last, and activate`, () => {
      let dto: CreateAuth0UserResponseDto = {
        _id: "MOCK_AUTH0_ID",
        email_verified: false,
        email: "MOCK_EMAIL",
        username: "",
        given_name: "MOCK_FIRST_NAME",
        family_name: "MOCK_LAST_NAME",
        name: "",
        nickname: "",
        picture: "MOCK_PICTURE",
      };
      let result = mockUser.applyAuth0Response(dto);
      expect(result.isFailure).toBe(false);
      let props = mockUser.props();

      expect(props).toEqual(baseActivatedUserProps);
    });
  });
  // describe(`updateAuth0UserId`, () => {
  //   it(`should update users Auth0 ID`, () => {
  //     throw new NotImplementedException();
  //   });
  // });
  // describe(`updateEmail`, () => {
  //   it(`should update users email`, () => {
  //     throw new NotImplementedException();
  //   });
  // });
  // describe(`updateName`, () => {
  //   it(`should update users name`, () => {
  //     throw new NotImplementedException();
  //   });
  // });
  // describe(`updatePicture`, () => {
  //   it(`should update users picture`, () => {
  //     throw new NotImplementedException();
  //   });
  // });
  // describe(`activate`, () => {
  //   it(`should activate the users account`, () => {
  //     throw new NotImplementedException();
  //   });
  // });
  // describe(`deactivate`, () => {
  //   it(`should deactivate the users account`, () => {
  //     throw new NotImplementedException();
  //   });
  // });
  // describe(`disable`, () => {
  //   it(`should disable the users account`, () => {
  //     throw new NotImplementedException();
  //   });
  // });
  // describe(`setPending`, () => {
  //   it(`should disable the users account to Pending`, () => {
  //     throw new NotImplementedException();
  //   });
  // });
});
