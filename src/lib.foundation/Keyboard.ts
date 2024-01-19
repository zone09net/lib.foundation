export class Keyboard 
{
	private _callbacks: Map<string, Array<(event: HTMLElementEventMap['keydown'], smuggler?: any) => void>> = new Map([
		['key', [this.onKey]]
	]);;
	private _element: HTMLElement;
	private _smuggler: any;
	//---

	public constructor(element: HTMLElement, smuggler?: any)
	{
		this._element = element;
		this._smuggler = smuggler || null;
	}

	public enable(): void
	{
		this._element.addEventListener("keydown", this.handleKeydown.bind(null, this), false);
	}

	public disable(): void
	{
		this._element.removeEventListener("keydown", this.handleKeydown.bind(null, this), false);
	}

	public setCallbacks(callbacks: Map<string, Array<(event: HTMLElementEventMap['keydown'], smuggler?: any) => void>>): void
	{
		this._callbacks = callbacks;
	}

	public onKey(event: HTMLElementEventMap['keydown'], smuggler?: any): void {}

	private handleKeydown(keyboard: Keyboard, event: HTMLElementEventMap['keydown']): void
	{
		let input: string = '';
		let keycode: number = event.keyCode;
		let callbacks: Array<(event: HTMLElementEventMap['keydown'], smuggler?: any) => void> = [];

		let valid: boolean =
			(keycode > 47 && keycode < 58)      ||    // number keys
			 keycode == 32 || keycode == 13     ||    // spacebar & return key(s)
			 keycode == 35 || keycode == 36		||		// home & end
			 keycode == 8 || keycode == 9       ||    // backspace, tab
			 keycode == 46 || keycode == 27     ||    // delete, escape
			(keycode > 36 && keycode < 41)      ||    // arrow keys
			(keycode > 64 && keycode < 91)      ||    // letter keys upper
			(keycode > 95 && keycode < 112)     ||    // numpad keys
			(keycode > 185 && keycode < 193)    ||    // ;=,-./` (in order)
			(keycode > 218 && keycode < 223);         // [\]' (in order)

		if(event.ctrlKey)
			input += 'ctrl+';
		if(event.shiftKey)
			input += 'shift+';
		if(event.altKey)
			input += 'alt+';

			if(valid)
		{
			if(event.key === 'ArrowRight')
				input += 'right';
			else if(event.key === 'ArrowLeft')
				input += 'left';
			else if(event.key === 'ArrowUp')
				input += 'up';
			else if(event.key === 'ArrowDown')
				input += 'down';
			else if(event.key === 'Enter')
				input += 'enter';
			else if(event.key === 'Backspace')
				input += 'backspace';
			else if(event.key === 'Delete')
				input += 'delete';
			else if(event.key === 'Escape')
				input += 'escape';
			else if(event.key === 'Tab')
				input += 'tab';
			else if(event.key === 'Home')
				input += 'home';
			else if(event.key === 'End')
				input += 'end';
			else if(input === 'shift+')
				input = event.key;
			else
				input += event.key;
			
			if(valid && input.length === 1)
				callbacks = keyboard._callbacks.get('key');
			else
				callbacks = keyboard._callbacks.get(input);

			if(callbacks)
			{
				if(callbacks.length != 0)
				{
					for(let callback of callbacks)
						callback(event, keyboard._smuggler);
				}
			}

			//event.preventDefault();
		}
	}
}

