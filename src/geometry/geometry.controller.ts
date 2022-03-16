import {
  Body,
  Controller,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { GeometryService } from './geometry.service';
import * as shp2json from 'shp2json';
import { FileInterceptor } from '@nestjs/platform-express';
import { basename, extname, join } from 'path';
import { existsSync, lstatSync, readdirSync, rmdirSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { diskStorage } from 'multer';
import * as decompress from 'decompress';
const TMP_DIR = join(tmpdir(), 'geometyservice');
@Controller('services/geometry')
export class GeometryController {
  constructor(private readonly service: GeometryService) {}

  @Post('project')
  getProject(@Body() body) {
    return this.service.project(body);
  }

  @Post('shp2json')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: TMP_DIR,
        filename: (req, file, cb) => {
          // Generating a 32 random chars long string
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          //Calling the callback passing the random name generated with the original extension name
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),

      fileFilter: (req, file, callback) => {
        var ext = extname(file.originalname);
        if (ext !== '.zip') {
          return callback(
            new Error('Sai định dạng, chỉ chấp nhận file .zip'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  shp2Geojson(
    @UploadedFile('file') file: Express.Multer.File,
    @Res() res: Response,
  ) {
    res.contentType('application/json');
    const zipPath = join(
      TMP_DIR,
      basename(file.filename, extname(file.filename)),
    );
    decompress(file.path, zipPath).then(files => {
      const shpFile = files.find(file => extname(file.path) === '.shp');
      if (shpFile) {
        const shpPath = join(zipPath, shpFile.path);
        shp2json.fromShpFile(shpPath).pipe(res);
      } else {
        res
          .status(400)
          .send(new Error('Không xác định được file .shp trong thư mục .zip'));
      }
      unlinkSync(file.path);
      ;
    });
  }

   deleteFolderRecursive (directoryPath) {
    if (existsSync(directoryPath)) {
        readdirSync(directoryPath).forEach((file, index) => {
          const curPath = join(directoryPath, file);
          if (lstatSync(curPath).isDirectory()) {
           // recurse
            this.deleteFolderRecursive(curPath);
          } else {
            // delete file
            unlinkSync(curPath);
          }
        });
        rmdirSync(directoryPath);
      }
    };
}
