export class Keyboard 
{
	private _keydownCallbacks: Map<string, Array<(event: HTMLElementEventMap['keydown'], smuggler?: any) => void>> = new Map([
		['key', [this.onKeydown]]
	]);
	private _keyupCallbacks: Map<string, Array<(event: HTMLElementEventMap['keyup'], smuggler?: any) => void>> = new Map([
		['key', [this.onKeyup]]
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
		this._element.addEventListener("keyup", this.handleUp.bind(null, this), false);
	}

	public disable(): void
	{
		this._element.removeEventListener("keydown", this.handleKeydown.bind(null, this), false);
		this._element.removeEventListener("keyup", this.handleUp.bind(null, this), false);
	}

	public setKeydownCallbacks(callbacks: Map<string, Array<(event: HTMLElementEventMap['keydown'], smuggler?: any) => void>>): void
	{
		this._keydownCallbacks = callbacks;
	}

	public setKeyupCallbacks(callbacks: Map<string, Array<(event: HTMLElementEventMap['keyup'], smuggler?: any) => void>>): void
	{
		this._keyupCallbacks = callbacks;
	}

	public onKeydown(event: HTMLElementEventMap['keydown'], smuggler?: any): void {}

	public onKeyup(event: HTMLElementEventMap['keyup'], smuggler?: any): void {}

	private filter(event: HTMLElementEventMap['keydown']): string
	{
		let input: string = '';
		const keycode: number = event.keyCode;
		const valid: boolean =
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

		if(event.ctrlKey || (!event.ctrlKey && event.key == 'Control' && event.type == 'keyup'))
			input += 'ctrl';
		if(event.shiftKey || (!event.shiftKey && event.key == 'Shift' && event.type == 'keyup'))
		{
			if(input.length > 0)
				input += '+';

			input += 'shift';
		}
		if(event.altKey || (!event.altKey && event.key == 'Alt' && event.type == 'keyup'))
		{
			if(input.length > 0)
				input += '+';

			input += 'alt';
		}

		if(valid)
		{
			if(input.length > 0)
				input += '+';

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
		}

		if(input.length > 0)
			return input;
		else
			return null;
	}


	private handleKeydown(keyboard: Keyboard, event: HTMLElementEventMap['keydown']): void
	{
		const input: string = keyboard.filter(event);
		let callbacks: Array<(event: HTMLElementEventMap['keydown'], smuggler?: any) => void> = [];

		if(input)
		{
			if(input.length === 1)
				callbacks = keyboard._keydownCallbacks.get('key');
			else
				callbacks = keyboard._keydownCallbacks.get(input);

			if(callbacks)
			{
				if(callbacks.length != 0)
				{
					for(let callback of callbacks)
						callback(event, keyboard._smuggler);
				}
			}
		}
	}

	private handleUp(keyboard: Keyboard, event: HTMLElementEventMap['keyup']): void
	{
		const input: string = keyboard.filter(event);
		let callbacks: Array<(event: HTMLElementEventMap['keyup'], smuggler?: any) => void> = [];

		if(input)
		{
			if(input.length === 1)
				callbacks = keyboard._keyupCallbacks.get('key');
			else
				callbacks = keyboard._keyupCallbacks.get(input);

			if(callbacks)
			{
				if(callbacks.length != 0)
				{
					for(let callback of callbacks)
						callback(event, keyboard._smuggler);
				}
			}
		}
	}
}

