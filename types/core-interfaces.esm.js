/**
 *	Author: JCloudYu
 *	Create: 2018/12/04
**/
import {DumpBinaryString, DumpHexString} from "../helper.esm.js";

const DEFAULT_AB  = new ArrayBuffer(0);
const DEFAULT_BA  = new Uint8Array(DEFAULT_AB);

export class Binarized {
	/**
	 * Create a BinaryData Object that will contain specific size of data
	 *
	 * @param {Number} length
	**/
	constructor(length=0) {
		if ( arguments.length === 0 ) {
			this._ab = DEFAULT_AB;
			this._ba = DEFAULT_BA;
		}
		
		
		
		if ( typeof length !== "number" || length < 0 ) {
			throw new TypeError( "Given length must be an integer that is equal or greater than 0!" );
		}
	
		this._ab = new ArrayBuffer(length);
		this._ba = new Uint8Array(this._ab);
	}
	
	/**
	 * Return a copy of the contained binary data and resize the data into specific size
	 *
	 * @param {Number} size
	 * @returns {ArrayBuffer}
	**/
	toBytes(size=null) {
		if ( arguments.length <= 0 || typeof size !== "number" || size < 0 || this._ab.byteLength === size ) {
			return this._ab.slice(0);
		}
	
		if ( this._ab.byteLength > size ) {
			return this._ab.slice(0, size);
		}
		else {
			const buffer = new Uint8Array(size);
			buffer.set(this._ba);
			return buffer.buffer;
		}
	}
	
	/**
	 * Dumps the contained binary data into specific representation
	 *
	 * @param {Number} bits
	 * @returns {String}
	**/
	toString(bits=16) {
		switch(bits) {
			case 2:
				return DumpBinaryString(this._ab);
				
			case 16:
				return DumpHexString(this._ab);
				
			default:
				throw new RangeError( "Binarized.toString only supports binary & hex representation!" );
		}
	}
	
	
	
	
	
	
	/**
	 * Detect whether the given object implements the Binarized interface or not
	 *
	 * @returns {Boolean}
	**/
	static IsBinarized(input){
		if ( Object(input) !== input ) {
			return false;
		}
		
		if ( input instanceof Binarized ) {
			return true;
		}
		
		let check = input._ab instanceof ArrayBuffer;
		check = check && (input._ba instanceof Uint8Array);
		check = check && (typeof input.toBytes === "function");
		return check;
	}
}
export class BinarizedInt extends Binarized {
	/**
	 * Return a copy of the contained binary data and resize the data into specific size
	 *
	 * @param {Number} size
	 * @returns {ArrayBuffer}
	**/
	toBytes(size=null) {
		if ( arguments.length <= 0 || typeof size !== "number" || size < 0 || this._ab.byteLength === size ) {
			return this._ab.slice(0);
		}
	
		if ( this._ab.byteLength > size ) {
			return this._ab.slice(0, size);
		}
		else
		if ( this._ab.byteLength === 0 ) {
			return new ArrayBuffer(size);
		}
		else {
			const fill = !this.isSignedInt ? 0 : ((this._ba[this._ba.length-1] & 0x80) === 0 ? 0 : 1);
			const buffer = new Uint8Array(size);
			for(let i=0; i<buffer.length; i++) {
				buffer[i] = fill;
			}
			
			buffer.set(this._ba);
			return buffer.buffer;
		}
	}
	
	/** @type {boolean} */
	get isSignedInt() {
		return false;
	}
	
	
	
	
	
	
	/**
	 * Detect whether the given object implements the BinarizedInt interface or not
	 *
	 * @returns {Boolean}
	**/
	static IsBinarizedInt(input) {
		if ( !Binarized.IsBinarized() ) return false;
		return input.hasOwnProperty('isSignedInt');
	};
	
	
	
	[Symbol.toPrimitive](hint) {
		if( hint === 'string' ){
			return this.toString(10);
		}
		
		return this._ta[0];
	}
}