const rootPath = require('../../rootPath')
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const storagePath = path.join(rootPath, "storage")


const saveFile = async (img) => {
    const fileName = uuidv4() + path.extname(img.name);
    const desPath = path.join(storagePath, fileName)

    try {
        await new Promise((resolve, reject) => {
            img.mv(desPath, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                console.log('File has been saved to:', desPath);
                resolve();
            });
        })
        const result = fileName;
        return result;
    } catch {
        console.error('Error moving the file:', err);
        return null;
    }
}

module.exports = { saveFile }