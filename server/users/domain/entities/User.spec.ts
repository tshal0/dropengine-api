import { IUser, User, UserProps } from "./User";
import * as moment from "moment";
import { UserSignedUp } from "../events/UserEvent";
import {
  CreateAuth0UserResponseDto,
  CreateUserDto,
} from "../../dto/CreateUserDto";
import { UUID } from "@shared/domain/ValueObjects";
import { DbUser } from "@shared/modules/prisma/models/User";
import { BaseDomainEvent } from "@shared/domain/events/BaseDomainEvents";
jest
  .spyOn(global.Date, "now")
  .mockImplementation(() => new Date("2021-01-01T00:00:00.000Z").valueOf());
describe(`User`, () => {
  describe(`init`, () => {
    it(`should initialize a new user given a UUID`, () => {
      const mockEventId = "00000000-0000-0000-0000-00000000000e";
      const mockEventUuid = UUID.from(mockEventId);
      const mockGenerateEventId = jest.fn().mockReturnValue(mockEventUuid);
      BaseDomainEvent.generateUuid = mockGenerateEventId;

      const mockUserId = "00000000-0000-0000-0000-000000000001";
      const mockUserUuid = UUID.from(mockUserId);
      const mockGenerateUserId = jest.fn().mockReturnValue(mockUserUuid);
      User.generateUuid = mockGenerateUserId;

      const user = User.create();
      const props = user.getProps();
      const defaultUserStatus = "DEACTIVATED";
      const defaultPicture = "";
      const now = moment().toDate();

      expect(props).toEqual({
        id: mockUserId,
        email: "",
        firstName: "",
        lastName: "",
        status: defaultUserStatus,
        picture: defaultPicture,
        createdAt: now,
        updatedAt: now,
        events: [],
      });
    });
  });

  describe(`fromDb`, () => {
    it(`should load a user from the db into the domain object`, () => {
      const mockEventId = "00000000-0000-0000-0000-00000000000e";
      const mockEventUuid = UUID.from(mockEventId);
      const mockGenerateEventId = jest.fn().mockReturnValue(mockEventUuid);
      BaseDomainEvent.generateUuid = mockGenerateEventId;

      const mockUserId = "00000000-0000-0000-0000-000000000001";
      const mockUserUuid = UUID.from(mockUserId);
      const mockGenerateUserId = jest.fn().mockReturnValue(mockUserUuid);
      User.generateUuid = mockGenerateUserId;

      const now = moment().toDate();

      const mockDbUser: DbUser = {
        id: mockUserId,
        externalUserId: "mock|12345",
        email: "mock@email.com",
        status: "ACTIVATED",
        firstName: "Mock",
        lastName: "User",
        createdAt: now,
        updatedAt: now,
        picture: "Picture",
        events: [],
      };

      const user = User.fromDb(mockDbUser);
      const props = user.getProps();
      expect(props).toEqual({
        id: mockUserId,
        email: "mock@email.com",
        status: "ACTIVATED",
        firstName: "Mock",
        lastName: "User",
        createdAt: now,
        updatedAt: now,
        picture: "Picture",
        events: [],
      });
    });
  });

  describe(`signUp`, () => {
    it(`should update the users email, name, and add a UserSignedUp event`, () => {
      const mockEventId = "00000000-0000-0000-0000-00000000000e";
      const mockEventUuid = UUID.from(mockEventId);
      const mockGenerateEventId = jest.fn().mockReturnValue(mockEventUuid);
      BaseDomainEvent.generateUuid = mockGenerateEventId;

      const mockUserId = "00000000-0000-0000-0000-000000000001";
      const mockUserUuid = UUID.from(mockUserId);
      const mockGenerateUserId = jest.fn().mockReturnValue(mockUserUuid);
      User.generateUuid = mockGenerateUserId;

      const mockSignUpDto: CreateUserDto = {
        email: "mock@email.com",
        firstName: "Mock",
        lastName: "User",
        password: "password123",
      };

      // const event = UserSignedUp.generate(mockSignUpDto);
      const user = User.create();
      const now = moment().toDate();
      user.signUp(mockSignUpDto);
      const props = user.getProps();

      const expectedUser = {
        id: "00000000-0000-0000-0000-000000000001",
        email: "mock@email.com",
        status: "ACTIVATED",
        firstName: "Mock",
        lastName: "User",
        createdAt: now,
        updatedAt: now,
        picture: "",
        events: [
          {
            aggregateId: "00000000-0000-0000-0000-000000000001",
            aggregateType: "User",
            details: {
              email: "mock@email.com",
              firstName: "Mock",
              lastName: "User",
            },
            eventId: "00000000-0000-0000-0000-00000000000e",
            eventType: "UserSignedUp",
            timestamp: now,
          },
        ],
      };
      expect(props).toEqual(expectedUser);
    });
  });
  describe(`updateAuth0UserId`, () => {
    it(`should update users Auth0 ID`, () => {
      const mockEventId = "00000000-0000-0000-0000-00000000000e";
      const mockEventUuid = UUID.from(mockEventId);
      const mockGenerateEventId = jest.fn().mockReturnValue(mockEventUuid);
      BaseDomainEvent.generateUuid = mockGenerateEventId;

      const mockUserId = "00000000-0000-0000-0000-000000000001";
      const mockUserUuid = UUID.from(mockUserId);
      const mockGenerateUserId = jest.fn().mockReturnValue(mockUserUuid);
      User.generateUuid = mockGenerateUserId;

      const mockSignUpDto: CreateUserDto = {
        email: "mock@email.com",
        firstName: "Mock",
        lastName: "User",
        password: "password123",
      };

      const user = User.create();
      const now = moment().toDate();
      const mockAuth0Resp: CreateAuth0UserResponseDto = {
        _id: "MOCK_AUTH0_USER_ID",
        email_verified: false,
        email: mockSignUpDto.email,
        username: "",
        given_name: mockSignUpDto.firstName,
        family_name: mockSignUpDto.lastName,
        name: "",
        nickname: "",
        picture: "",
      };

      user.updateAuth0Details(mockAuth0Resp);

      const expectedUser: IUser = {
        id: "00000000-0000-0000-0000-000000000001",
        externalUserId: `MOCK_AUTH0_USER_ID`,
        email: "mock@email.com",
        status: "ACTIVATED",
        firstName: "Mock",
        lastName: "User",
        createdAt: now,
        updatedAt: now,
        picture: "",
        events: [
          {
            aggregateId: "00000000-0000-0000-0000-000000000001",
            aggregateType: "User",
            details: {
              _id: "MOCK_AUTH0_USER_ID",
              email_verified: false,
              email: mockSignUpDto.email,
              username: "",
              given_name: mockSignUpDto.firstName,
              family_name: mockSignUpDto.lastName,
              name: "",
              nickname: "",
              picture: "",
            },
            eventId: "00000000-0000-0000-0000-00000000000e",
            eventType: "UserCreatedInAuth0",
            timestamp: now,
          },
        ],
      };
      const props = user.getProps();
      expect(props).toEqual(expectedUser);
    });
  });
  describe(`updateEmail`, () => {
    it(`should update users email`, () => {
      return;
    });
  });
  describe(`updateName`, () => {
    it(`should update users email`, () => {
      return;
    });
  });
  describe(`updatePicture`, () => {
    it(`should update users picture`, () => {
      return;
    });
  });
  describe(`activate`, () => {
    it(`should activate the users account`, () => {
      return;
    });
  });
  describe(`deactivate`, () => {
    it(`should deactivate the users account`, () => {
      return;
    });
  });
  describe(`disable`, () => {
    it(`should disable the users account`, () => {
      return;
    });
  });
});
