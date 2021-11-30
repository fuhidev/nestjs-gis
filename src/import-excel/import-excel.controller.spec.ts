import { Test, TestingModule } from '@nestjs/testing';
import { ImportExcelController } from './import-excel.controller';

describe('ImportExcel Controller', () => {
  let controller: ImportExcelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImportExcelController],
    }).compile();

    controller = module.get<ImportExcelController>(ImportExcelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
