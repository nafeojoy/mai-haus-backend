

export default (app, router, client, logger, authorize) => {
    router.post("/upload-file", (req, res) => {
        if (req.files === null) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }
        const file = req.files.file;

        file.mv(`${process.env.UPLOAD_IMAGE_PATH}/${file.name}`, err => {
            if (err) {
                console.error(err);
                return res.status(500).send(err);
            }

            res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
        });
    });

}