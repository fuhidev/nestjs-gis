import { Body, Controller, Get, Post } from '@nestjs/common';
import { GeometryService } from './geometry.service';

@Controller('services/geometry')
export class GeometryController{
  constructor(private readonly service:GeometryService){}

  @Post('project')
  getProject(
    @Body() body
  ){
    return this.service.project(body);
  }
}