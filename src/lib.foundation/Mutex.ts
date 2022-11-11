export class Mutex 
{
	private _mutex: Promise<void> = Promise.resolve();
	//---
 
	public lock(): PromiseLike<() => void> 
	{
		let begin: (unlock: () => void) => void = unlock => {};
 
		this._mutex = this._mutex.then(() => {
			return new Promise(begin);
		});
 
		return new Promise(result => {
			begin = result;
		});
	}
 
	async dispatch<T>(func: (() => T) | (() => PromiseLike<T>)): Promise<T> 
	{
		const unlock = await this.lock();
	
		try 
		{
			return await Promise.resolve(func());
		}
		finally
		{
			unlock();
		}
	}
}


/*

const collectionMutex = new Mutex();

async function set(collection: string, key: string, value: string): {[key:
string]: string} {
  const unlock = await collectionMutex.lock();
  
  const data = await fetchCollection(collection);
  data[key] = val;
  await sendCollection(collection, data);

  unlock();
  return data;
}

or

const collectionMutex = new Mutex();

async function set(collection: string, key: string, value: string): {[key:
string]: string} {
  return await collectionMutex.dispatch(async () => {
    const data = await fetchCollection(collection);
    data[key] = val;
    await sendCollection(collection, data);
    return data;
  });
}

*/