import multer from 'multer';
import * as appRootPath from 'app-root-path';
import { Request } from 'express';

const storage = multer.diskStorage({
  destination:  (req: Request, file: any, cb: any) => {
    cb(null, `${appRootPath}/public/images`);
  },
  filename:  (req: Request, file: any, cb: any) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.png');
  }
});

export const imageUpload = multer({ storage });