import { REVISION } from './constants.js';

export { Key } from './Key.js';
export { Keyboard } from './Keyboard.js';
export { KeyboardScene } from './KeyboardScene.js';
export { KeyTemplate } from './KeyTemplate.js';
export { KeyboardStateHandler } from './KeyboardStateHandler.js';

if ( typeof window !== 'undefined' ) {

	if ( window.__KustomKeys__ ) {

		console.warn( 'WARNING: Multiple instances of KustomKeys.js being imported.' );

	} else {

		window.__KustomKeys__ = REVISION;

	}

}