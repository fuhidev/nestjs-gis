import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { DeepPartial } from 'typeorm';
import { RoleEntity } from '../role/role.entity';
import { hash } from '../auth.util';
import { compareSync } from 'bcrypt';
@Injectable()
export class UserService extends TypeOrmCrudService<UserEntity> {
  constructor(@InjectRepository(UserEntity) repo) {
    super(repo);
  }

  async create(user: UserEntity) {
    // kiểm tra trùng user
    const count = await this.repo.count({ username: user.username });
    if (count > 0) {
      throw new BadRequestException(
        `Tài khoản ${user.username} đã tồn tại trong hệ thống`,
      );
    }
    const result = await this.repo.save(this.repo.create(user));
    return result;
  }

  replaceOne(req: CrudRequest, dto: UserEntity) {
    if (dto.password) {
      delete dto.password;
    }
    return super.replaceOne(req, dto);
  }

  updateOne(req: CrudRequest, dto: UserEntity) {
    if (dto.password) {
      delete dto.password;
    }
    return super.updateOne(req, dto);
  }

  async changePassword(params: {
    userSessionId: string;
    currentPassword?: string;
    newPassword: string;
  }) {
    const { currentPassword, newPassword, userSessionId } = params;
    let isCoQuyen = false;
    // neu quyen quan tri se duoc phep doi mat khau
    // neu khong thi chi nguoi dung moi duoc phep doi mat khau
    const user = await this.repo.findOne(userSessionId, {
      select: ['password'],
    });
    if (!user) {
      throw new NotFoundException();
    }
    if (compareSync(currentPassword, user.password)) {
      await this.repo.update(userSessionId, { password: hash(newPassword) });
      return {
        message: 'Đổi mật khẩu thành công',
      };
    } else {
      throw new UnauthorizedException('Mật khẩu hiện tại không đúng');
    }
  }
  async changePasswordAdmin(params: {
    userSessionId: string;
    userId: string;
    newPassword: string;
  }) {
    const { userId, newPassword, userSessionId } = params;
    let isCoQuyen = false;
    // neu quyen quan tri se duoc phep doi mat khau
    // neu khong thi chi nguoi dung moi duoc phep doi mat khau
    const user = await this.repo.findOne(userId, { select: ['password'] });
    if (!user) {
      throw new NotFoundException();
    }
    const builder = await this.repo
      .createQueryBuilder('s')
      .innerJoin(
        qb =>
          qb
            .from(RoleEntity, 'role')
            .innerJoin('role.applications', 'ra')
            .select('role.roleId', 'roleId')
            .where('ra.applicationId=:id', {
              id: 'AAC47065-0F73-EA11-80CF-97CC0449692F',
            }),
        'role',
        'role.roleId=s.roleId',
      )
      .where(' s.userId=:userId', {
        userId: userSessionId,
      });
    const sessionUser = await builder.getOne();

    if (sessionUser) {
      isCoQuyen = true;
    }

    if (isCoQuyen) {
      await this.repo.update(userId, { password: hash(newPassword) });
      return {
        message: 'Đổi mật khẩu thành công',
      };
    } else {
      throw new UnauthorizedException('Không có quyền đổi mật khẩu');
    }
  }
}
