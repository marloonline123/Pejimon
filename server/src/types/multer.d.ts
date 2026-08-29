declare namespace Express {
  namespace Multer {
    interface File {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      size: number;
      destination: string;
      filename: string;
      path: string;
      buffer: Buffer;
    }
  }

  interface Request {
    file?: Express.Multer.File;
    files?:
      | Express.Multer.File[]
      | { [fieldname: string]: Express.Multer.File[] };
  }
}

declare module "multer" {
  import type { Request, Response, NextFunction } from "express";

  namespace multer {
    type FileFilterCallback = (
      error: Error | null,
      acceptFile?: boolean,
    ) => void;

    interface DiskStorageOptions {
      destination?:
        | string
        | ((
            req: Request,
            file: Express.Multer.File,
            callback: (error: Error | null, destination: string) => void,
          ) => void);
      filename?: (
        req: Request,
        file: Express.Multer.File,
        callback: (error: Error | null, filename: string) => void,
      ) => void;
    }

    interface StorageEngine {
      _handleFile(
        req: Request,
        file: Express.Multer.File,
        callback: (error?: any, info?: Partial<Express.Multer.File>) => void,
      ): void;
      _removeFile(
        req: Request,
        file: Express.Multer.File,
        callback: (error: Error | null) => void,
      ): void;
    }

    interface Options {
      dest?: string;
      storage?: StorageEngine;
      limits?: {
        fieldNameSize?: number;
        fieldSize?: number;
        fields?: number;
        fileSize?: number;
        files?: number;
        parts?: number;
        headerPairs?: number;
      };
      fileFilter?: (
        req: Request,
        file: Express.Multer.File,
        callback: FileFilterCallback,
      ) => void;
    }

    interface Instance {
      single(
        fieldname: string,
      ): (req: Request, res: Response, next: NextFunction) => void;
      array(
        fieldname: string,
        maxCount?: number,
      ): (req: Request, res: Response, next: NextFunction) => void;
      fields(
        fields: ReadonlyArray<{ name: string; maxCount?: number }>,
      ): (req: Request, res: Response, next: NextFunction) => void;
      none(): (req: Request, res: Response, next: NextFunction) => void;
      any(): (req: Request, res: Response, next: NextFunction) => void;
    }

    function diskStorage(options: DiskStorageOptions): StorageEngine;
    function memoryStorage(): StorageEngine;
  }

  function multer(options?: multer.Options): multer.Instance;

  export = multer;
}
