import multer from 'multer';
import path from 'path';
import { v4 } from 'uuid';

const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req: any, file: any, cb: any) => {
        const { title } = req.body;
        console.log('Componente multer.diskStorage: image: title ─> ', title);
        console.log(`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
        return cb(null, title + '-' + v4() + path.extname(file.originalname));
    },
});

export default multer({ storage });
