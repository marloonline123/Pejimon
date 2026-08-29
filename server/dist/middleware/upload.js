import multer, {} from "multer";
import path from "path";
import fs from "fs";
const uploadsBaseDir = path.join(process.cwd(), "uploads");
const organizationsUploadDir = path.join(uploadsBaseDir, "organizations");
// Ensure target directory exists
if (!fs.existsSync(organizationsUploadDir)) {
    fs.mkdirSync(organizationsUploadDir, { recursive: true });
}
const storageConfig = {
    destination: (_req, _file, cb) => {
        if (!fs.existsSync(organizationsUploadDir)) {
            fs.mkdirSync(organizationsUploadDir, { recursive: true });
        }
        cb(null, organizationsUploadDir);
    },
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `logo-${uniqueSuffix}${ext}`);
    },
};
const organizationStorage = multer.diskStorage(storageConfig);
const imageFileFilter = (_req, file, cb) => {
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
    }
    else {
        cb(new Error("Invalid file type. Only JPG, PNG, WEBP, GIF, and SVG images are allowed."));
    }
};
export const uploadOrganizationLogo = multer({
    storage: organizationStorage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
    },
});
//# sourceMappingURL=upload.js.map