import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { RouteMetadata } from 'nestjs-gis';
import { DMVatChatNhanChimEntity } from './dm-vat-chat-nhan-chim.entity';
import { DMVatChatNhanChimService } from './dm-vat-chat-nhan-chim.service';

@RouteMetadata()
@Crud({
  model: { type: DMVatChatNhanChimEntity },
  params: {
    code: {
      field: 'code',
      primary: true,
      type: 'number',
    },
  },
})
@Controller('rest/dm-vat-chat-nhan-chim')
export class DMVatChatNhanChimController {
  constructor(private service: DMVatChatNhanChimService) {}
}
