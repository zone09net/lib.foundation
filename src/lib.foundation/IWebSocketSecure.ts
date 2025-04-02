export interface IWebSocketSecureRaw 
{
	guid?: string,
	id?: number,
	ip?: string,
	response?: IWebSocketSecureResponse | any,
	request?: IWebSocketSecureRequest,
}

export interface IWebSocketSecureResponse 
{
	status: number | string, 
	message: string, 
	data?: any
}

export interface IWebSocketSecureRequest
{
	route?: string,
	query?: string,
	placeholders?: any[],
}

export interface IWebSocketSecureCallback 
{
	success: boolean,
	response: IWebSocketSecureResponse
}

export interface IWebSocketSecureAttachable 
{
	callback: (raw: IWebSocketSecureRaw, smuggler: any) => IWebSocketSecureCallback,
	smuggler: any
}

export interface IWebSocketSecureAttributes
{
	link?: string,
	initier?: IWebSocketSecureAttachable,
	parser?: IWebSocketSecureAttachable,
	closer?: IWebSocketSecureAttachable,
}

