import * as App from 'express';
import * as HttpServer from 'http';
import * as IoServer from 'socket.io';
import { Subject } from 'rxjs';
import { Chat } from './services/Chat';
import { Queue } from './services/Queue';
import { Crawler } from './services/Crawler';
let HttpS:any = HttpServer;

let Http = HttpS.Server(App);
let Io = IoServer(Http);
let Db = require('./utils/db.js');
let Clients = new Db('./storage/clients.json',[]);
let ProxyData = require('./storage/proxy-list.json');


export class loaderModule{
	
	queue = new Queue();
	crawler = new Crawler();
	Io = Io;
	socket:any;
	total:number=0;
	enviados:number=0;
	queueData = new Subject<{total:number,enviados:number}>();

	constructor () {
		this.queueData.asObservable().subscribe((data:any) => console.log(data));
		this.crawler.doneItem = (data:any) => this.doneItem(data);
		this.socketRouter(
				[
					{
						event:'newList',
						function: (data) => this.newList(data)
					}
				]
			);
		

		
	}

	newList (url) {
		this.crawler.start(url);
	}

	socketRouter (routes:Array<any>) {
		Io.sockets.on('connection',  (socket) => {
			this.socket = socket;
			for (var i = routes.length - 1; i >= 0; i--) {
				var func = routes[i].function;
				socket.on(routes[i].event, (data) => func(data) )
			}
		});
		Http.listen(4242,() => {
			console.log('listen in: 4242');
		});
	}

	doneItem(data:any) {

		this.total = this.total+1;
		let c = Clients.read();
		if(c[data.user]) {return;}
		c.push(data.user);
		Clients.write(c)
		let chat = new Chat('442d4b723a7310d58c4e1a70d8bf089e0427372e',data.id);
		try { 
		chat.callback =  () => this.queueUpdate();
		this.queue.add(chat);	
		} catch {return;}

	}
	queueUpdate () {

		console.log( {total:this.total,enviados:this.enviados});
		try { 

		this.enviados = this.enviados+1;
		this.socket.emit('updateQueue', {total:this.total,enviados:this.enviados});
		} catch {return;}
		
	}
}

new loaderModule();