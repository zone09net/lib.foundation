export class ExtendedMap
{
	private _sorted: Array<any> = [];
	private _map: Map<string, any> = new Map();
	//---

	public constructor() {}

	public has(name: string): boolean
	{
		if(this._map.has(name))
			return true;
		else
			return false;
	}

	public set(name: string, object: any): any
	{
		if(!this._map.has(name))
		{
			this._map.set(name, {index: this.index(), object: object});
			this.sort();

			let entry: any = this._map.get(name);
			return entry.object;
		}

		throw new Error('duplicate name in map');
	}

	public get(name: string): any
	{
		if(this._map.has(name))
			return this._map.get(name).object;
		else
			return undefined;
	}

	public delete(name: string): boolean
	{
		return this._map.delete(name);
	}

	public index(name?: string, index?: number): number
	{
		let newindex: number = 0;

		this._map.forEach((object) => {
			if(object.index == index)
				throw new Error('duplicate index in map');

			if(object.index >= newindex)
				newindex = object.index;
		});

		if(name && index)
			this._map.get(name).index = index;
		else
			return ++newindex;
	}

	public sort(): void
	{
		let entries: [string, any][] = [...this._map.entries()];
		this._sorted = entries.sort((a, b) => { return a[1].index - b[1].index; }).filter(Boolean);
	}

	public reverse(): void
	{
		let entries: [string, any][] = [...this._map.entries()];
		this._sorted = entries.sort((a, b) => { return b[1].index - a[1].index; }).filter(Boolean);
	}

	public filter(func: any): Array<any>
	{
		let filtered: Array<any> = [];

		for(let i = 0; i < this._sorted.length; i++)
		{
			if(func(this._sorted[i]))
				filtered.push(this._sorted[i]);
		}

		return filtered;
	}

	public clear(): void
	{
		this._sorted = [];
		this._map.clear();
	}



	// getter|setter
	// --------------------------------------------------------------------------

	get map(): Map<string, any>
	{
		return this._map;
	}

	get sorted(): Array<any>
	{
		return this._sorted;
	}
}
