import { User } from './User';
import * as moment from 'moment';
import { UserSignedUp } from '../events/UserEvent';
import { CreateUserDto } from '../../dto/CreateUserDto';
import { UUID } from '@shared/domain/ValueObjects';
jest
  .spyOn(global.Date, 'now')
  .mockImplementation(() => new Date('2021-01-01T00:00:00.000Z').valueOf());
describe(`User`, () => {
  describe(`init`, () => {
    it(`should initialize a new user given a UUID`, () => {
      const mockUuid = UUID.generate();
      const user = User.init(mockUuid);
      const props = user.getProps();
      const defaultUserStatus = 'DEACTIVATED';
      const defaultPicture = '';
      const now = moment().toDate();

      expect(props).toEqual({
        id: mockUuid.value,
        email: '',
        name: '',
        firstName: '',
        lastName: '',
        status: defaultUserStatus,
        picture: defaultPicture,
        createdAt: now,
        updatedAt: now,
        events: [],
      });
    });
  });

  // describe(`fromDb`, () => {
  //   it(`should load a user from the db into the domain object`, () => {
  //     const mockUuid = UUID.generate();
  //     const now = moment().toDate();

  //     const mockPrismaUser: PrismaUser = {
  //       id: mockUuid.value,
  //       email: 'mock@email.com',
  //       name: 'Mock User',
  //       status: 'ACTIVATED',
  //       firstName: 'Mock',
  //       lastName: 'User',
  //       createdAt: now,
  //       updatedAt: now,
  //       picture: 'Picture',
  //       lastLogin: now,
  //       lastIp: 'Ip Address',
  //       loginsCount: 0,
  //     };

  //     const user = User.fromDb(mockPrismaUser);
  //     const props = user.getProps();
  //     expect(props).toEqual({
  //       id: mockUuid.value,
  //       email: 'mock@email.com',
  //       name: 'Mock User',
  //       status: 'ACTIVATED',
  //       firstName: 'Mock',
  //       lastName: 'User',
  //       createdAt: now,
  //       updatedAt: now,
  //       picture: 'Picture',
  //       lastLogin: now,
  //       lastIp: 'Ip Address',
  //       loginsCount: 0,
  //       events: [],
  //     });
  //   });
  // });

  describe(`signUp`, () => {
    it(`should update the users email, name, and add a UserSignedUp event`, () => {
      const mockUuid = UUID.generate();
      const mockSignUpDto: CreateUserDto = {
        email: 'mock@email.com',
        firstName: 'Mock',
        lastName: 'User',
        externalUserId: 'MockAuth0Id',
        id: mockUuid.value,
        picture: 'MockPicture',
      };
      const event = UserSignedUp.generate(mockSignUpDto);
      const user = User.init(mockUuid);
      const now = moment().toDate();
      user.signUp(event);
      const props = user.getProps();
      expect(props).toEqual({
        id: mockUuid.value,
        email: 'mock@email.com',
        name: 'Mock User',
        status: 'ACTIVATED',
        firstName: 'Mock',
        lastName: 'User',
        createdAt: now,
        updatedAt: now,
        picture: 'MockPicture',
        events: [event.getProps()],
      });
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
