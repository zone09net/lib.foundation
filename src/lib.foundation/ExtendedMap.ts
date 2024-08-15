export class ExtendedMap
{
	private _sorted: ExtendedMap;
	private _map: Map<string, any> = new Map();
	//---

	public constructor(map?: Map<string, any>) 
	{
		if(map)
			this._map = map;
	}

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

	public first(): any
	{
		return this._map.entries().next().value[0];
	}

	public delete(name: string): boolean
	{
		return this._map.delete(name);
	}

	public index(key?: string, index?: number): number
	{
		let newindex: number = 0;

		this._map.forEach((object) => {
			if(object.index == index)
				throw new Error('duplicate index in map');

			if(object.index >= newindex)
				newindex = object.index;
		});

		if(key && index)
			this._map.get(key).index = index;
		else
			return ++newindex;
	}

	public sort(): void
	{
		this._sorted = new ExtendedMap(
			new Map(
				[...this._map.entries()].sort((a, b) => { 
					return a[1].index - b[1].index;
				}).filter(Boolean))
			);
	}

	public reverse(): void
	{
		this._sorted = new ExtendedMap(
			new Map(
				[...this._map.entries()].sort((a, b) => { 
					return b[1].index - a[1].index; 
				}).filter(Boolean)
			)
		);
	}

	public filter(func: any): Array<any>
	{
		let filtered: Array<any> = [];

		this._map.forEach((value: any, key: string, map: Map<string, any>) => {
			if(func(value.object, map.get(key).index))
				filtered.push(value.object);
		});

		return filtered;
	}

	public clear(): void
	{
		if(this._sorted)
			this._sorted.clear();
			
		this._map.clear();
	}

	public forEach(func: any): void
	{
		this._map.forEach((value) => {
			func(value.object);
		});
	}

	[Symbol.iterator]() 
	{
		const values: any = this._map.values();
		let index: number = -1;

		return {
			next: () => { 
				let done: boolean = false;
				let value: any

				if(++index < this._map.size)
					value = values.next().value.object;
				else
				{
					value = undefined;
					done = true;
				}

				return {value: value, done: done }
			}
		}
	}



	// getter|setter
	// --------------------------------------------------------------------------

	get map(): Map<string, any>
	{
		return this._map;
	}

	get sorted(): ExtendedMap
	{
		if(!this._sorted)
			this._sorted = new ExtendedMap();

		return this._sorted;
	}
}
