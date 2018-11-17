import user from './api/user';
import login from './api/login';
import polls from './api/polls';
import follow from './api/follow';
import search from './api/search';
import vote from './api/vote';
import explore from './api/explore';
import chats from './api/chats';
import map from './api/map';
import pb from './api/pb';
import block from "./api/block";

export default function(app){
    app.use('/polls', polls);      // -> Polls.post / Polls.create / Polls.delete / Polls.put
    app.use('/follow', follow);    // -> Follow.post / Follow.get / Follow.delete
    app.use('/user', user);        // -> User.post / User.get / User.put
    app.use('/login', login);      // -> Login.post / Login.get / Login.delete
    app.use('/search', search);    // -> Search.get
    app.use('/vote', vote);        // -> Vote.post
    app.use('/explore', explore);  // -> Explore.get
    app.use('/chats', chats);      // -> Chats.get / Chats.post
    app.use('/map', map);          // -> Map.get
    app.use('/pb', pb);  
    app.use('/block', block);  

    /*
    app.use('/bild', require('./api/bild'));
    app.use('/pb', require('./api/pb'));
    app.use('/explore', require('./api/explore'));
    app.use('/notifications', require('./api/notification'));
    app.use('/chats', require('./api/chats'));
    app.use('/chats/uploadimage', require('./api/chats/uploadimage'));
    app.use('/test', require('./test'));
    */
}
