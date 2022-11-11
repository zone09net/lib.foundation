export interface IWebSocketSecureRaw 
{
	guid?: string,
	id?: number,
	ip?: string,
	response?: IWebSocketSecureResponse | any,
}

export interface IWebSocketSecureResponse 
{
	status: number | string, 
	message: string, 
	data: any
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
	parser?: IWebSocketSecureAttachable,
	closer?: IWebSocketSecureAttachable,
}
