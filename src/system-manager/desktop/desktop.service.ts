import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";

@Injectable()
export class DesktopService {
    constructor(
        private readonly service: UserService,
    ) { }

    async isAccess(params: {
        idApp: string,
        username: string
    }) {
        const { idApp, username } = params;
        const user = this.service.findOne({
            username,
            role: {
                applications: [{ applicationId: idApp }]
            }
        }, {
            relations: ['role', 'role.applications'],
        });
        return Boolean(user);
    }

    async getLayerInfos(params: {
        username: string
    }) {
        const { username } = params;
        const user = await this.service.findOne({
            username
        }, {
            relations: ['role', 'role.layers', 'role.layers.layer', 'role.layers.layer.dataset'],
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
                    Name: layer.dataset.datasetName
                }
            };
        });

    }

}