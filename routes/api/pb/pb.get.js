import sharp from 'sharp';

const allowedResolutions = [ 68, 136, 270, 256, 540, 1080 ],
allowedQualities = [ 20, 30, 40, 50, 60, 70, 80, 90, 100 ];

export default function getImage(req, res, next) {

    const uri = req.params.pb;

    let resolution = parseInt(req.query.r) || 270, 
        quality = parseInt(req.query.q) || 100;

    if(uri === 'default'){
        res.redirect('https://static.dashpoll.net/img/default.jpg');
    }

    if(!allowedResolutions.includes(resolution)){
        return res.status(400).json({status: 'error', msg: 'invalid resolution'});
    }

    if(!allowedQualities.includes(quality)){
        return res.status(400).json({status: 'error', msg: 'invalid quality'});
    }

    if((req.get('Accept') || '').toLowerCase().includes('image/webp')) {

        sharp(__dirname + '/../../../uploads/pb/' + uri)
            .resize(resolution)
            .background({r: 255, g: 255, b: 255, alpha: 1})
            .flatten()
            .webp({quality: quality})
            .toBuffer()
            .then((data) => {
                res.setHeader("Content-type", "image/webp");
                res.end(data);
            })
            .catch((err) => {
                console.log(err);
                res.redirect('https://static.dashpoll.net/img/default.jpg')
                res.end();
            });

    } else {

        sharp(__dirname + '/../../../uploads/pb/' + uri)
            .resize(resolution)
            .jpeg({quality: quality})
            .toBuffer()
            .then((data) => {
                res.setHeader("Content-type", "image/jpeg");
                res.end(data);
            })
            .catch((err) => {
                console.log(err);
                res.redirect('https://static.dashpoll.net/img/default.jpg')
                res.end();
            });
    }

}