export class Clipboard
{
	/*
	public static async getPermission()
	{
		//const queryOpts: PermissionDescriptor = { name: 'clipboard-read', allowWithoutGesture: false };
		const permissionStatus: PermissionStatus = await navigator.permissions.query({name: 'clipboard-read', allowWithoutGesture: false});

		console.log(permissionStatus.state);

		// Listen for changes to the permission state
		permissionStatus.onchange = () => {
			console.log(permissionStatus.state);
		};
	}
	*/


	public static async getContent(): Promise<string>
	{
		try
		{
			const clipboardItems: ClipboardItems = await navigator.clipboard.read();

			for(const clipboardItem of clipboardItems)
			{
				for(const type of clipboardItem.types)
				{
					if(type.startsWith('image/'))
					{
						const blob: Blob = await clipboardItem.getType(type);

						return new Promise((resolve, reject) => {
							const reader: FileReader = new FileReader();
							
							reader.onloadend = () => {
								resolve(reader.result as string);
							}
							reader.onerror = reject;
							reader.readAsDataURL(blob);
						 });
					}
					else if(type.startsWith('text/plain'))
					{
						const blob: Blob = await clipboardItem.getType(type);
						return await blob.text();
					}
					//else if(type.startsWith('text/html'))
					//{}
				}
			}
		}
		catch(exception)
		{
			console.error(exception.name, exception.message);
			console.log('make sure you are using https:// or localhost');
		}
	}

	public static setContent(content: string): Promise<void>
	{
		try
		{
			return new Promise((resolve, reject) => {
				navigator.clipboard.writeText(content).then(
					() => { resolve(); },
					() => { reject(); }
				);
			});
		}
		catch(exception)
		{
			console.error(exception.name, exception.message);
			console.log('make sure you are using https:// or localhost');
		}
	}
}
