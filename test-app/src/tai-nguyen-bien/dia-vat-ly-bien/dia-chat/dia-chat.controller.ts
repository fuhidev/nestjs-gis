import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { DiaChatService } from './dia-chat.service';
import { DiaChatEntity } from './dia-chat.entity';
import { RouteMetadata, GISCrud } from 'nestjs-gis';

@RouteMetadata()
@GISCrud()
@Crud({
  model: { type: DiaChatEntity },
  params: {
    objectId: {
      primary: true,
      field: 'objectId',
      type: 'number',
    },
  },
})
@Controller('rest/dia-chat')
export class DiaChatController {
  constructor(private service: DiaChatService) {}

  ngOnInit() {}
}
