import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { NhanChimBienVatChatService } from './nhan-chim-bien-vat-chat.service';
import { NhanChimBienVatChatEntity } from './nhan-chim-bien-vat-chat.entity';
import { RouteMetadata } from 'nestjs-gis';

@RouteMetadata()
@Crud({
  model: { type: NhanChimBienVatChatEntity },
  params: {
    ma: {
      primary: true,
      field: 'ma',
      type: 'number',
    },
  },
  query: {
    join: {
      nhanChimBien: {},
      ten: {},
    },
  },
})
@Controller('rest/nhan-chim-bien-vat-chat')
export class NhanChimBienVatChatController {
  constructor(private service: NhanChimBienVatChatService) {}
}
