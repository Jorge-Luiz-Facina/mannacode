import { Application } from '../../declarations';
import { Id, Params } from '@feathersjs/feathers';
import { AdapterService } from '../adapter-service';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '../../models/enums/roles.enum';
import { IUsersMessage } from '../iusers/iusers.message';
import { throwRuleException } from '../../utils/exception';
import { acessExternal } from '../../utils/acess-external';
import { BaseValidate } from '../../utils/validate/base.validate';
import { Email } from '../../utils/validate/email.validate';
import { Password } from '../../utils/validate/password.validate';
import { ConfirmPassword } from '../../utils/validate/confirm-password.validate';
import { License } from '../../utils/validate/license.validate';
import { Name } from '../../utils/validate/name.validate';
import { Type } from '../../utils/validate/type.validate';
import { UserType } from '../../models/enums/user-type.enum';

export class Users extends AdapterService {
  private app: Application;

  constructor(app: Application) {
    super();
    this.app = app;
  }

  public async find(params: Params = {}): Promise<any> {
    const userService = this.app.service('iusers');
    return userService.find(acessExternal(params));
  }
  public async create(data: Partial<any>, params: Params = {}): Promise<any> {
    this.validate(data);
    const userService = this.app.service('iusers');
    const sequelize = this.app.get('sequelizeClient');

    const existingPlayer = await this.find({
      query: {
        role: {
          $ne: Role.ADMIN
        },
        $or: [
          { email: data.email.toLowerCase() },
        ]
      },
      paginate: false
    });

    if (existingPlayer.length) {
      throwRuleException(IUsersMessage.cadastroExistente);
    }

    const tx = await sequelize.transaction();
    const newParams = acessExternal({ ...params, sequelize: { transaction: tx } });
    try {
      if (!data.newsInfo) {
        data.newsInfo = false;
      }
      const newData = { ...data, role: Role.NORMAL, verifiedEmail: false };
      const createdPlayer = await userService.create(newData, newParams);

      const verifyToken = uuidv4();

      const updatedPlayer = await userService.patch(
        createdPlayer.id,
        {
          verifyToken,
        },
        newParams
      );

      let validity = new Date();
      validity.setDate(validity.getDate() + 7);
      await this.app.service('iplans').create({
        active: true, started: new Date(),
        validity: validity, numberPlayers: 3, onlineRooms: 1,
        value: 0.00, userId: createdPlayer.idFk,
      }, acessExternal(newParams));

      await this.app.service('sendemailconfirm').create({
        emailConfirm: updatedPlayer.email,
        user: updatedPlayer
      });
      await tx.commit();
      return updatedPlayer;
    } catch (error) {
      await tx.rollback();
      return Promise.reject(error);
    }
  }
  public async patch(
    id: Id,
    data: Partial<any>,
    params: Params = {},
  ): Promise<any> {
    const userService = this.app.service('iusers');
    const user = await userService.get(params.user?.id);
    const alterUser = { ...user, name:data.name, type: data.type };
    
    return userService.patch(params.user?.id, alterUser, acessExternal(params));
  }

  private validate(data: Partial<any>): void {
    const validates: BaseValidate[] = [new Email(data.email), new Password(data.password),
      new ConfirmPassword({ password: data.password, confirmPassword: data.confirmPassword }),
      new License(data.license), new Name(data.name), new Type({ value: data.type, types: [UserType.COMPANY, UserType.OTHER, UserType.STUDENT, UserType.TEACHER] })];

    for (const validate of validates) {
      if (validate.verifyField()) {
        validate.action();
      }
    }
  }
}
