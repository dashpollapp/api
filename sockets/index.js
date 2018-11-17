import jwt from 'jsonwebtoken';
import User from '../models/User';


module.exports.logic = function(io){

    io.on('connection', function(socket) {
	console.log("SOCKET CONNECTION");
        setTimeout(function(){
            if(!socket.isAuthenticated) return socket.disconnect();
        }, 5000);

        socket.on('authentification', token => {

            jwt.verify(token, 'lucalucaluca', (err, data) => {
                if(err){
                    //console.error(err);
                    return socket.disconnect();
                }

                User.findById(data.id)
                    .then(user => {
                        if(!user) return socket.disconnect();
                        socket.user = user;

                        if(!socket.isAuthenticated) {
                            socket.join(socket.user._id, () => {
                                chat(io, socket);
                                map(io, socket);
                            });
                        } 

                        socket.isAuthenticated = true;
                        
                    })
                    .catch(err => {
                        console.error(err);
                        return socket.disconnect();
                    })

                    
            })

        })
    
        socket.on('disconnecting',() => {
            console.log('Socket disconnected');

        });
        
    });

}
