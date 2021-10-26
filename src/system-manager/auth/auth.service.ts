import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectEntityManager } from '@nestjs/typeorm';
import { compareSync } from 'bcrypt';
import { EntityManager, getRepository } from 'typeorm';
import { UserStatusEnum } from '../user/user.constant';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectEntityManager() private entityManager: EntityManager
  ) {}
  verifyToken(token: string) {
    return this.jwtService.verify(token);
  }
  async validateUser(username: string, password: string): Promise<UserEntity> {
    let result = {
      username,
      displayName: '',
      userId: '',
      roleId: '',
    } as UserEntity;
    const user = await this.userService.findOne(
      { username },
      {
        select: ['password', 'displayName', 'userId', 'statusId', 'roleId'],
        relations: ['role'],
      }
    );

    if (user && compareSync(password, user.password)) {
      if (user.statusId === UserStatusEnum.Locked) {
        throw new UnauthorizedException('Tài khoản đã bị khóa');
      } else if (user.statusId === UserStatusEnum.Request) {
        throw new UnauthorizedException('Tài khoản đang chờ duyệt');
      } else if (user.statusId === UserStatusEnum.Expired) {
        throw new UnauthorizedException('Tài khoản đã hết hạn');
      }
      result.displayName = user.displayName;
      result.userId = user.userId;
      result.roleId = user.roleId;
      return result;
    }
    return null;
  }

  async login(user: Partial<UserEntity>) {
    const payload = {
      username: user.username,
      userId: user.userId,
      displayName: user.displayName,
    };
    return {
      userId: user.userId,
      username: user.username,
      displayName: user.displayName,
      accessToken: this.jwtService.sign(payload),
      roleId: user.roleId,
      expired: Math.round(
        new Date(Date.now() + 7*24 * 60 * 60 * 1000).getTime() / 1000
      ),
    };
  }

  async refreshToken(userId: string) {
    const payload = await this.userService.findOne(userId, {
      select: ['username', 'displayName'],
    });
    return {
      accessToken: this.jwtService.sign({userId:payload.userId},{
        expiresIn:'15m',
      }),
      expired: Math.round(
        new Date(Date.now() + 15 * 60 * 1000).getTime()/1000
      ),
    };
  }

  /**
   * Kiểm tra quyền truy cập của tài khoản
   */
  async isAccess(params: { idApp: string; username: string }) {
    const { idApp, username } = params;
    const user = await this.userService.findOne(
      {
        username,
      },
      {
        relations: ['role', 'role.applications'],
      }
    );
    return user.role.applications.some(
      (f) => f.applicationId === idApp && f.isEnabled
    );
  }

  async getCapabilities(params: { userId: string }): Promise<string[]> {
    const capabilities: Array<any> = await this.entityManager.query(
      `select applicationId=c.applicationId from sys_user a inner join sys_role b on a.roleId=b.roleId inner join sys_role_application c on b.roleId=c.roleId where userId=@0`,
      [params.userId]
    );
    return capabilities.map((m) => m.applicationId);
  }

  async getLayerInfos(params: { username: string }) {
    const { username } = params;
    const result = await  getRepository(UserEntity).createQueryBuilder('usr')
    .innerJoin('usr.role','rl')
    .innerJoin('rl.layers','lyrs')
    .innerJoin('lyrs.layer','lr')
    .innerJoin('lr.dataset','dts')
    .where('usr.username=:usn',{usn:username})
    .select([
      'layerId = lr.layerId',
      'layerName = lr.layerName',
      'isView=lyrs.isView',
      'isCreate=lyrs.isCreate',
      'isDelete=lyrs.isDelete',
      'isEdit=lyrs.isEdit',
      'definition=lyrs.definition',
      'url=lr.url',
      'datasetId=dts.datasetId',
      'datasetName=dts.datasetName',
    ])
    .getRawMany();
    result.forEach(r=>{
      r.dataset = {
        datasetId:r.datasetId,
        datasetName:r.datasetName
      };
      r.isVisible = true
      delete r.datasetId;
      delete r.datasetName;
    })
    return result;
    // return user.role.layers.forEach((roleLayer) => {
    //   const layer = roleLayer.layer;
    //   return {
    //     layerId: layer.layerId,
    //     layerName: layer.layerName,
    //     isView: roleLayer.isView,
    //     isCreate: roleLayer.isCreate,
    //     isDelete: roleLayer.isDelete,
    //     isEdit: roleLayer.isEdit,
    //     definition: roleLayer.definition,
    //     url: layer.url,
    //     isVisible: true,
    //     dataset: layer.dataset,
    //   };
    // });
  }
}
