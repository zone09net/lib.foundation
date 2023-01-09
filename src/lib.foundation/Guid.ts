export class Guid
{
	private _guids: Array<string> = [];
	private _force: string = null;
	//---

	public constructor() {}

	public create(version: string, variant: string): string
	{
		let guid: string;

		if(!this._force)
		{
			version = version ? (/1|2|3|4|5/.test(version) ? version : '1') : '1';
			variant = variant ? (/8|9|a|b/.test(variant) ? variant : 'a') : 'a';

			//let str = 'xxxxxxxx-xxxx-' + version + 'xxx-' + variant + 'xxx-xxxxxxxxxxxx';

			do
			{
				/*
				guid = str.replace(/[xy]/g, () => {
					return (Math.random() * 16 | 0).toString(16);
				});
				*/
				
				let random: string = Math.random().toString(16).substring(2) + Math.random().toString(16).substring(2) + Math.random().toString(16).substring(2);
				let splitted: Array<string> = random.substring(0, 36).split('');

				splitted[8] = '-';
				splitted[13] = '-';
				splitted[14] = version
				splitted[18] = '-';
				splitted[19] = variant
				splitted[23] = '-';

				guid = splitted.join('');
			}
			while(this._guids.includes(guid))
		}
		else
		{
			guid = this._force;
			this._force = null;
		}

		this._guids.push(guid);

		return guid;
	}

	public remove(guid: string): void
	{
		this._guids = this._guids.filter(item => item !== guid)
	}

	public has(guid: string): boolean
	{
		if(this._guids.includes(guid))
			return true;

		return false;
	}

	public force(guid: string): void
	{
		if(this.valid(guid))
			this._force = guid;
		else
			throw new Error('not a valid guid');
	}

	public valid(guid: string): boolean
	{
		return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(guid);
	}
}
