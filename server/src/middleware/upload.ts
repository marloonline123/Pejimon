import multer, {
  type FileFilterCallback,
  type DiskStorageOptions,
} from "multer";
import path from "path";
import fs from "fs";
import type { Request } from "express";

const uploadsBaseDir = path.join(process.cwd(), "uploads");
const organizationsUploadDir = path.join(uploadsBaseDir, "organizations");

// Ensure target directory exists
if (!fs.existsSync(organizationsUploadDir)) {
  fs.mkdirSync(organizationsUploadDir, { recursive: true });
}

const storageConfig: DiskStorageOptions = {
  destination: (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => {
    if (!fs.existsSync(organizationsUploadDir)) {
      fs.mkdirSync(organizationsUploadDir, { recursive: true });
    }
    cb(null, organizationsUploadDir);
  },
  filename: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `logo-${uniqueSuffix}${ext}`);
  },
};

const organizationStorage = multer.diskStorage(storageConfig);

const imageFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPG, PNG, WEBP, GIF, and SVG images are allowed.",
      ),
    );
  }
};

export const uploadOrganizationLogo = multer({
  storage: organizationStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

