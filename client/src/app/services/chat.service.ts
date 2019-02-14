import * as io from 'socket.io-client';

export class ChatService {
    private url = 'http://localhost:5000';
    private socket;    

    constructor() {
        this.socket = io(this.url);
    }
}
