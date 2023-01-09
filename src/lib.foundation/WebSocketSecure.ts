import {Guid} from './Guid.js';
import {IWebSocketSecureAttachable, IWebSocketSecureCallback} from './IWebSocketSecure';
import {IWebSocketSecureResponse} from './IWebSocketSecure';
import {IWebSocketSecureRaw} from './IWebSocketSecure';
import {IWebSocketSecureAttributes} from './IWebSocketSecure';



export class WebSocketSecure
{
	private _ws: WebSocket;
	private _guids: Guid = new Guid();
	private _timeoutMs: number = 5000;
	private _timeoutId: number = undefined;
	private _parsers: Map<string, IWebSocketSecureAttachable> = new Map();
	private _closers: Map<string, IWebSocketSecureAttachable> = new Map();
	private _parser: IWebSocketSecureAttachable;
	private _link: string;
	//---

	public constructor(attributes: IWebSocketSecureAttributes = {}) 
	{
		this._link = attributes.link;

		if(attributes.parser)
		{
			this._parser = attributes.parser;
			this.attachParser(attributes.parser);
		}
		else
			this._parser = {callback: (raw: IWebSocketSecureRaw, smuggler: any): IWebSocketSecureCallback => { return {success: true, response: raw.response}; }, smuggler: {}};


		if(attributes.closer)
			this.attachCloser(attributes.closer);
	}

	public attachParser(attachable: IWebSocketSecureAttachable): string
	{
		let guid: string = this._guids.create('1', '8');

		this._parsers.set(guid, attachable);

		return guid;
	}

	public attachCloser(attachable: IWebSocketSecureAttachable): string
	{
		let guid: string = this._guids.create('1', '9');

		this._closers.set(guid, attachable);

		return guid;
	}

	public detach(guid: string): void
	{
		if(/^.{18}-8/.test(guid))
			this._parsers.delete(guid);
		else if(/^.{18}-9/.test(guid))
			this._closers.delete(guid);

		this._guids.remove(guid);
	}

	public isConnected(): boolean
	{
		if(this._ws)
		{
			if(this._ws.readyState === 1)
				return true;
			else
				return false;
		}
		else
			return false;
	}

	public connect(): Promise<unknown>
	{
		return new Promise((resolve, reject) => {
			if(this.isConnected())
			{
				resolve(true);
				return;
			}

			this._ws = new WebSocket(this._link);

			this._ws.onopen = () =>
			{
				resolve(true);
			}

			this._ws.onmessage = (event) =>
			{
				let message = JSON.parse(event.data);

				if(this._parsers.has(message.guid))
					this._parsers.get(message.guid).callback(message, this._parsers.get(message.guid).smuggler);
			}

			this._ws.onerror = (event) =>
			{
				//this._closers.forEach((value, key, map) => {
				//	value.callback({response: 'socket connection closed unexpectedly'}, value.smuggler);
				//});

				clearTimeout(this._timeoutId);
				reject({status: 'wrong', message: 'The connection was closed abnormally', data: undefined});
			}

			this._ws.onclose = (event) =>
			{
				if(!event.wasClean)
				{
					let message = 'Unknown reason';

					if(event.code == 1000)
						message = 'Normal closure';
					else if(event.code == 1001)
						message = 'An endpoint is "going away"';
					else if(event.code == 1002)
						message = 'An endpoint is terminating the connection due to a protocol error';
					else if(event.code == 1003)
						message = 'An endpoint is terminating the connection because it has received a type of data it cannot accept';
					else if(event.code == 1004)
						message = 'Reserved';
					else if(event.code == 1005)
						message = 'No status code was actually present';
					else if(event.code == 1006)
						message = 'The connection was closed abnormally';
					else if(event.code == 1007)
						message = 'An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message';
					else if(event.code == 1008)
						message = 'An endpoint is terminating the connection because it has received a message that "violates its policy"';
					else if(event.code == 1009)
						message = 'An endpoint is terminating the connection because it has received a message that is too big for it to process';
					else if(event.code == 1011)
						message = 'A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request';
					else if(event.code == 1015)
						message = 'The connection was closed due to a failure to perform a TLS handshake';

					clearTimeout(this._timeoutId);

					this._closers.forEach((value, key, map) => {
						value.callback({response: message}, value.smuggler);
					});

					reject({status: 'wrong', message: message, data: undefined});
				}	
			}
		});
	}

	public close(): void
	{
		this._ws.close();
	}

	public send(payload: any, attachable?: IWebSocketSecureAttachable): Promise<IWebSocketSecureResponse>
	{
		let timeoutPromise: Promise<IWebSocketSecureResponse> = new Promise((resolve, reject) => {
			this._timeoutId = setTimeout(() => {
				clearTimeout(this._timeoutId);
				reject({status: 'wrong', message: 'Timeout', data: undefined});
			}, this._timeoutMs)
		});

		let sendPromise: Promise<IWebSocketSecureResponse> = new Promise((resolve, reject) => {
			function bridge(raw: IWebSocketSecureRaw, smuggler: any): any
			{
				let result: IWebSocketSecureCallback;
				
				if(attachable)
					result = attachable.callback(raw, smuggler.smuggler);
				else
					result = smuggler.default.callback(raw, smuggler.default.smuggler);

				smuggler.wss.detach(raw.guid);

				if(result.success === true)
				{
					//if(result.response)
						resolve(result.response);
					//else
					//	resolve(true);
				}
				else
				{
					//if(result.response)
						reject(result.response);
					//else
					//	reject(false);
				}
			}
			
			if(attachable)
				payload.guid = this.attachParser({callback: bridge, smuggler: {wss: this, smuggler: attachable.smuggler}});
			else
				payload.guid = this.attachParser({callback: bridge, smuggler: {wss: this, default: this._parser}});
						
			this.connect()
			.then(() => {
				this._ws.send(JSON.stringify(payload));
			})
			.catch((error) => {
				this.detach(payload.guid);
				reject(error);	
			});
		});

		return Promise.race([
			sendPromise,
			timeoutPromise
		]);
	}

	public setTimeout(ms: number): void
	{
		this._timeoutMs = ms;
	}
}


/*

import * as Foundation from './lib.foundation.js';

function parser(message: any, smuggler: any): any
{
	console.log('parser', message, smuggler);
	return true;
}

function closer(message: any, smuggler: any): any
{
	console.log(message);
}

let wss = new Foundation.WebSocketSecure('wss://www.zone09.net:8443');
wss.attachCloser({callback: closer, smuggler: null});

let promise = wss.send({route: 'root', query: 'blade ? layout iframe end', placeholders: {filename: 'auth.index'}}, {callback: parser, smuggler: null});
promise.then(
	success => { console.log('yes'); wss.close() },
	error   => { console.log(error); }
);


*/