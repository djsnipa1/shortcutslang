let totalSteps = 0;
let began: Date;

export type ProductionResolveable = Production | {getProd: () => Production}

// function debuglog(..._args: any[]){
	// do nothing
// }

export class Performance {
	static startMonitoring() {
		totalSteps = 0;
		began = new Date();
		console.log(`Started parsing.`); //eslint-disable-line no-console
	}
	static stopMonitoring() {
		const ended = new Date();
		console.log(`Parsed in ${totalSteps} steps over ${ended.getTime() - began.getTime()}ms.`); //eslint-disable-line no-console
	}
}

export class Position{
	line: number
	character: number
	constructor(line:number,character:number){
		this.line = line;
		this.character = character;
	}
	copy(){
		return new Position(this.line, this.character);
	}
	toString(){
		return `line ${this.line} character ${this.character}`;
	}
}

let _debugIndent = ""

export class ParsingString { // a data object containing a string
	position: Position
	str: string
	data: any
	constructor(str: string, position: Position){
		this.str = str;
		this.position = position;
		this.data = undefined;
	}
	take(take: string){
		this.str = this.str.substr(take.length); // replaces first instance
		if(take.indexOf("\n") > -1){
			let split = take.split("\n");
			this.position.line += split.length;
			this.position.character = 0;
			take = split[split.length - 1];
		};
		this.position.character += take.length;
		return;
	}
	copy(){
		return new ParsingString(this.str, this.position.copy());
	}
	applyChanges(changedParse: ParsingString){
		this.position = changedParse.position
		this.str = changedParse.str
	}
	error(val: string): Error{
		return new Error("Error on "+this.position.toString()+": "+val);
	}
}

export class Production {
	cb: (a: any, fromPos: Position, toPos: Position) => any // todo cb: (input: any) => Parse
	name: string
	constructor(cb = (a: any, _fromPos: Position, _toPos: Position) => a) {
		this.cb = cb;
	}
	scb(cb: (a: any, fromPos: Position, toPos: Position) => any) {
		this.cb = cb;
		return this;
	}
	getProd() {
		return this;
	}
	parse(ps: ParsingString): (ParsingString | Error) {
		totalSteps++;
		let startingPos = ps.position.copy();

		// debuglog(_debugIndent + "Parsing:: "+this.name + " ("+this.constructor.name+")");
		// _debugIndent += "| ";

		let nps = this._parse(ps);

		// _debugIndent = _debugIndent.substr(0, _debugIndent.length - 2);
		if(nps instanceof Error) {
			// debuglog(_debugIndent + "- Failed:: "+nps.message);
			return nps;
		}

		// debuglog(_debugIndent + "+ Passed:: "+nps.position.toString());

		// debuglog(_debugIndent + "Setting Data");
		nps.data = this.cb(nps.data, startingPos, ps.position.copy());
		// debuglog(_debugIndent + "Data Set");
		return nps;
	}
	_parse(ps: ParsingString): (ParsingString | Error){
		return ps.error("No parser was defined");
	}
	beginParse(str: string){
		let ps = new ParsingString(str, new Position(0,1));
		let nps = this.parse(ps.copy());
		if(nps instanceof Error){
			throw nps;
		}
		if(nps.str.length > 0){
			throw new Error("Could not parse everything, ended at "+nps.position.toString());
		}
		return nps.data;
	}
	toString(){
		return "UndefinedProduction";
	}
	nameOrTostring(){
		return this.name || this.toString();
	}
}

export class OrderedProduction extends Production {
	requirements: Array<ProductionResolveable>
	constructor(...requirements: Array<ProductionResolveable>) {
		super();
		this.requirements = requirements;
	}
	_parse(ps: ParsingString) {
		const resdata: Array<any> = [];
		const success = this.requirements.every(requirement => {
			const nps = requirement.getProd().parse(ps.copy());
			if(nps instanceof Error){return false;}
			ps.applyChanges(nps);
			resdata.push(nps.data);
			return true;
		});
		if(!success) { return ps.error("Not all items matched."); }

		ps.data = resdata;
		return ps;
	}
	toString() {
		return `${this.requirements.map(option => option.getProd().nameOrTostring()).join(" ")}`;
	}
}
export class OrProduction extends Production {
	options: Array<ProductionResolveable>
	constructor(...options: Array<ProductionResolveable>) {
		super();
		this.options = options;
	}
	_parse(ps: ParsingString) {
		let resdata;
		const success = this.options.some(option => { // find the first option that parses... might cause problems if things try to parse too deep only to realise the code is wrong... may want to have some number of depth or something idk
			const nps = option.getProd().parse(ps.copy());
			if(nps instanceof Error) {return false;}
			ps.applyChanges(nps);
			resdata = nps.data;
			return true;
		});
		if(!success) { return ps.error("None of the items matched."); }
		ps.data = resdata;
		return ps;
	}
	toString() {
		return `( ${this.options.map(option => option.getProd().nameOrTostring()).join(" | ")} )`;
	}
}
export class NotProduction extends Production {
	options: Array<ProductionResolveable> // why does notproduction have an array just do not(or(a,b,c))
	constructor(...options: Array<ProductionResolveable>) {
		super();
		this.options = options;
	}
	_parse(ps: ParsingString) { // notproduction doesn't match anything is the point to not(a,b,c,d...) regex/./? that'd work but idk
		let resdata;
		const success = this.options.every(option => { // ensure every option fails
			const nps = option.getProd().parse(ps.copy());
			if(nps instanceof Error) {return false;}  // if success, fail.
			ps.applyChanges(nps);
			resdata = nps.data;
			return true;
		});
		if(!success) { return ps.error("One of the items matched."); }
		ps.data = resdata;
		return ps;
	}
	toString() {
		return `!( ${this.options.map(option => option.getProd().nameOrTostring()).join(" | ")} )`;
	}
}

export class RegexProduction extends Production {
	regex: RegExp
	constructor(regex: RegExp) {
		super();
		this.regex = regex;
	}
	_parse(ps: ParsingString) {
		const match = ps.str.match(this.regex);
		if(match &&  ps.str.startsWith(match[0])) {
			ps.take(match[0]);
			ps.data = match;
			return ps;
		}
		if(match) {
			console.warn("WARN: regex ", this.regex, " does not start matching at beginning of line");
		}
		return ps.error("Regex didn't match.");
	}
	toString() {
		return `${this.regex.toString()}`;
	}
}

export class StringProduction extends Production {
	string: string
	constructor(string: string) {
		super();
		this.string = string;
	}
	_parse(ps: ParsingString) {
		if(ps.str.startsWith(this.string)) {
			ps.take(this.string);
			ps.data = this.string;
			return ps;
		}
		return ps.error(`Expected \`${this.string}\` but found \`${ps.str.substr(0, this.string.length)}\``);
	}
	toString() {
		return `${JSON.stringify(this.string)}`;
	}
}

export class ManyProduction extends Production {
	prod: ProductionResolveable
	start: number
	end: number
	constructor(thing: ProductionResolveable, start = -Infinity, end = Infinity) { // range = 0.. 1.. 0..1 ..1 or something
		super();
		this.prod = thing;
		this.start = start;
		this.end = end;
	}

	_parse(ps: ParsingString) {
		const results = [];
		let succeeding = true;
		while(succeeding) {
			if(results.length > this.end) {succeeding = false; continue;}
			const nps = this.prod.getProd().parse(ps.copy());
			if(nps instanceof Error) {succeeding = false; continue;}
			const changed = ps.str.length - nps.str.length;
			if(changed === 0) {succeeding = false; continue;} // if it succeeds but matches nothing, count it as a failure (to avoid loops)
			ps.applyChanges(nps);
			results.push(nps.data);
		}
		if(results.length < this.start) {return ps.error(`Expected from ${this.start} to ${this.end} but didn't get that`);}

		ps.data = results;
		return ps;
	}
	toString() {
		return `{ ${this.start}..${this.end} }( ${this.prod.getProd().nameOrTostring()} )`;
	}
}
