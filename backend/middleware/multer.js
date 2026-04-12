const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadOnCloudinary = require('../utils/cloudinary');

const tempDir = path.join(__dirname, '../public/temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname || '');
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 25 * 1024 * 1024 }
});

const uploadStartupAssets = upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'media', maxCount: 5 }
]);

function normalizeMultipartBody(req) {
    const b = req.body;
    if (!b || typeof b !== 'object') return;
    if (typeof b.categories === 'string' && b.categories.trim().match(/^[\[]/)) {
        try {
            b.categories = JSON.parse(b.categories);
        } catch (_) {}
    }
    if (typeof b.discount === 'string' && b.discount !== '') {
        const n = Number(b.discount);
        if (!Number.isNaN(n)) b.discount = n;
    }
    if (typeof b.hasSpecialOffer === 'string') {
        b.hasSpecialOffer = b.hasSpecialOffer === 'true' || b.hasSpecialOffer === '1';
    }
}

const attachCloudinaryUrls = async (req, res, next) => {
    try {
        normalizeMultipartBody(req);
        const files = req.files;
        if (!files || (!files.logo && !files.media)) {
            return next();
        }

        if (files.logo && files.logo[0]) {
            const local = files.logo[0].path;
            const r = await uploadOnCloudinary(local);
            try {
                if (fs.existsSync(local)) fs.unlinkSync(local);
            } catch (_) {}
            if (r && r.secure_url) req.body.logo = r.secure_url;
        }

        if (files.media && files.media.length) {
            const urls = [];
            for (const f of files.media.slice(0, 5)) {
                const r = await uploadOnCloudinary(f.path);
                try {
                    if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
                } catch (_) {}
                if (r && r.secure_url) urls.push(r.secure_url);
            }
            req.body.media = urls;
        }

        next();
    } catch (err) {
        next(err);
    }
};

module.exports = {
    upload,
    uploadStartupAssets,
    attachCloudinaryUrls
};
