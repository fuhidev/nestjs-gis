import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth';
import { UserService } from '../user/user.service';

@Injectable()
export class DesktopService {
  constructor(
    private readonly service: UserService,
    private authService: AuthService,
  ) {}

  async getLayerInfos(params: { username: string }) {
    const { username } = params;
    const user = await this.service.findOne({
      where: {
        username,
      },
      relations: [
        'role',
        'role.layers',
        'role.layers.layer',
        'role.layers.layer.dataset',
      ],
    });
    return user.role.layers.map(roleLayer => {
      const layer = roleLayer.layer;
      return {
        LayerID: layer.layerId,
        LayerName: layer.layerName,
        IsView: roleLayer.isView,
        IsCreate: roleLayer.isCreate,
        IsDelete: roleLayer.isDelete,
        IsEdit: roleLayer.isEdit,
        Definition: roleLayer.definition,
        Url: null,
        IsVisible: true,
        GroupLayer: layer.dataset && {
          ID: layer.dataset.datasetId,
          Name: layer.dataset.datasetName,
        },
      };
    });
  }

  isAccess(params: { appId: string; userId: string }) {
    return this.authService.isAccessRequest({
      idApp: params.appId,
      userId: params.userId,
    });
  }
}
