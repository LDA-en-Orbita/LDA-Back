import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';

const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const bodyParser = (req: Request, res: Response, next: NextFunction) => {
  const contentType = req.headers['content-type'] || '';

  if (contentType.includes('application/json')) {
    express.json()(req, res, next);
  } else if (contentType.includes('application/x-www-form-urlencoded')) {
    express.urlencoded({ extended: true })(req, res, next);
  } else if (contentType.includes('multipart/form-data')) {
    upload.any()(req, res, function(err) {
      if (err) return next(err);
      if (Array.isArray(req.files)) {
        const filesByKey: { [key: string]: Express.Multer.File[] } = {};
        for(const file of req.files){
          if (!filesByKey[file.fieldname]) filesByKey[file.fieldname] = [];
          filesByKey[file.fieldname].push(file);
        }
        req.files = filesByKey;
      }
      next();
    });
  } else {
    next();
  }
};
