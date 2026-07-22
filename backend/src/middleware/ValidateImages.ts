import { Request, Response, NextFunction } from "express";

export const validateImageBytes = (fileFields: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const fileTypeModule = await import("file-type");
            const fileTypeFromBuffer = fileTypeModule.fileTypeFromBuffer || (fileTypeModule as any).default?.fileTypeFromBuffer;

            if (!fileTypeFromBuffer) {
                throw new Error("Unable to load fileTypeFromBuffer from file-type package.");
            }

            // NORMALIZE req.files REGARDLESS IF I USE upload.any() OR upload.fields() MULTER
            let allFiles: Express.Multer.File[] = [];
            if (Array.isArray(req.files)) {
                allFiles = req.files;
            } else if (req.files && typeof req.files === "object") {
                allFiles = Object.values(req.files).flat();
            }

            if (allFiles.length === 0) {
                return next();
            }

            const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/avif"];
            const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

            for (const file of allFiles) {
                
                // CHEKC IF IT MATCHES FIELD EXACTLY OR GOT SOME PREFIX (stepImages_{12592})
                const matchesTargetField = fileFields.some(field => 
                    file.fieldname === field || file.fieldname.startsWith(field)
                );

                if (!matchesTargetField) {
                    continue;
                }

                if (file.size > MAX_FILE_SIZE) {
                    return res.status(400).json({
                        error: "VALIDATION_ERROR",
                        message: `File '${file.originalname}' exceeds the maximum allowed size of 10MB.`
                    });
                }

                const typeInfo = await fileTypeFromBuffer(file.buffer);

                if (!typeInfo || !allowedMimeTypes.includes(typeInfo.mime)) {
                    return res.status(400).json({
                        error: "SECURITY_ERROR",
                        message: `File '${file.originalname}' failed binary validation. Only real JPEGs, PNGs, and WebPs are permitted.`
                    });
                }
                
                // SET FILE TYPE TO ACTUAL MIMETYPES
                file.mimetype = typeInfo.mime;
            }

            next();
        } catch (err) {
            console.error("Image byte validation middleware failure:", err);
            return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
        }
    };
};