export class Mobile
{
	public static isMobile(): boolean
	{
		if(navigator.userAgent.match(/Android/i) ||
			navigator.userAgent.match(/webOS/i) ||
			navigator.userAgent.match(/iPhone/i) ||
			navigator.userAgent.match(/iPad/i) ||
			navigator.userAgent.match(/iPod/i) ||
			navigator.userAgent.match(/BlackBerry/i) ||
			navigator.userAgent.match(/IEMobile/i) ||
			navigator.userAgent.match(/Opera Mini/i) ||
			navigator.userAgent.match(/Windows Phone/i))
			return true;

		return false;
	}

	public static setMaxWidth(width: number)
	{
		const scale: number = screen.width / width
		document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=' + width + ', initial-scale=' + scale + ', user-scalable=no');
	}
}
