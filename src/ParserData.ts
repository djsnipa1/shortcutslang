import {Action, Dictionary, Text, MagicVariable, NamedVariable, Variable, Attachment, List} from "./OutputData";
import {getActionFromName} from "./ActionData";
import {ConvertingContext} from "./Converter.js"
import {setVariable, getVariable} from "./HelpfulActions"
import {Position} from "./Production"

class PositionedError extends Error{ // an error at a position
	start: Position
	end: Position
	constructor(message: string, start: Position, end: Position) {
		super("Error from "+start.toString()+" to "+end.toString()+": "+message)
		this.start = start; this.end = end;
	}
}

class Parse {
	special: ("InputArg" | "ControlFlowMode" | "Arglist" | undefined)
	start: Position
	end: Position
	constructor(start: Position, end: Position) {
		this.start = start; this.end = end;
	}

	error(message: string){
		return new PositionedError(message, this.start, this.end);
	}
}

interface AsString extends Parse{
	asString(): string
}

export function canBeString(parse: Parse): parse is AsString {
    return (<AsString>parse).asString !== undefined;
}

interface AsBoolean extends Parse{
	asBoolean(): boolean
}

export function canBeBoolean(parse: Parse): parse is AsBoolean {
    return (<AsBoolean>parse).asBoolean !== undefined;
}

interface AsText extends Parse{
	asText(cc: ConvertingContext): Text
}

export function canBeText(parse: Parse): parse is AsText {
    return (<AsText>parse).asText !== undefined;
}

interface AsList extends Parse{
	asList(cc: ConvertingContext): List
}

export function canBeList(parse: Parse): parse is AsList {
    return (<AsList>parse).asList !== undefined;
}

interface AsArray extends Parse{
	asArray(): Array<string>
}

export function canBeArray(parse: Parse): parse is AsArray {
    return (<AsArray>parse).asArray !== undefined;
}

interface AsVariable extends Parse{
	asVariable(cc: ConvertingContext): Variable
}

export function canBeVariable(parse: Parse): parse is AsVariable {
    return (<AsVariable>parse).asVariable !== undefined;
}

interface AsAction extends Parse{
	asAction(cc: ConvertingContext): Action
}

export function canBeAction(parse: Parse): parse is AsAction {
    return (<AsAction>parse).asAction !== undefined;
}

interface AsDictionary extends Parse{
	asDictionary(cc: ConvertingContext): Dictionary
}

export function canBeDictionary(parse: Parse): parse is AsDictionary {
    return (<AsDictionary>parse).asDictionary !== undefined;
}

interface AsRawDictionary extends Parse{
	asRawDictionary(): {[key: string]: string}
}

export function canBeRawDictionary(parse: Parse): parse is AsRawDictionary {
    return (<AsRawDictionary>parse).asRawDictionary !== undefined;
}

interface AsRawKeyedDictionary extends Parse{
	asRawKeyedDictionary(): {[key: string]: AsAble}
}

export function canBeRawKeyedDictionary(parse: Parse): parse is AsRawKeyedDictionary {
    return (<AsDictionary>parse).asDictionary !== undefined;
}

interface AsNameType extends Parse{
	asNameType(): {name: string, type: string}
}

export function canBeNameType(parse: Parse): parse is AsNameType {
    return (<AsNameType>parse).asNameType !== undefined;
}

interface AsStringVariable extends Parse{
	asStringVariable(): string
}

export function canBeStringVariable(parse: Parse): parse is AsStringVariable {
    return (<AsStringVariable>parse).asStringVariable !== undefined;
}

export type AsAble = AsString | AsText | AsList | AsArray | AsVariable | AsAction | AsDictionary | AsRawDictionary | AsRawKeyedDictionary | AsNameType | AsBoolean | AsStringVariable;

export class DictionaryParse extends Parse implements AsRawDictionary, AsRawKeyedDictionary, AsDictionary {
	keyvaluepairs: Array<{key: AsAble, value: AsAble}>
	constructor(start: Position, end: Position, keyvaluepairs: Array<{key: AsAble, value: AsAble}>) {
		super(start, end);
		this.keyvaluepairs = keyvaluepairs;
	}
	asRawDictionary() { // for static things that cannot have interpolated keys or values
		const dictionary: {[key: string]: string} = {};
		this.keyvaluepairs.forEach(({key, value}) => {
			if(!canBeString(key)) {throw key.error("To convert to a raw dictionary, key must be a string")}
			if(!canBeString(value)) {throw value.error("To convert to a raw dictionary, value must be a string")}
			const stringKey = key.asString();
			if(dictionary[stringKey]) {throw new Error(`Key ${stringKey} is already defined in this dictionary.`);}
			dictionary[stringKey] = value.asString();
		});
		return dictionary;
	}
	asRawKeyedDictionary() {
		// returns a raw dictionary (keys are raw, not values) for this DictionaryParse
		const dictionary: {[key: string]: AsAble} = {};
		this.keyvaluepairs.forEach(({key, value}) => {
			if(!canBeString(key)) {throw key.error("To convert to a raw keyed dictionary, key must be a string")}
			const stringKey = key.asString();
			if(dictionary[stringKey]) {throw new Error(`Key ${stringKey} is already defined in this dictionary.`);}
			dictionary[stringKey] = value;
		});
		return dictionary;
	}
	asDictionary(cc: ConvertingContext) {
		// returns an Output Dictionary for this DictionaryParse
		const dictionary = new Dictionary();
		this.keyvaluepairs.forEach(({key, value}) => {
			let type;
			let outputValue;
			if(!canBeText(key)) {throw key.error("Dictionary keys must be texts")}
			if(canBeList(value)) {type = 2; outputValue = value.asList(cc);}
			else if(canBeDictionary(value)) {type = 1; outputValue = value.asDictionary(cc);}
			else if(canBeText(value)) {type = 0; outputValue = value.asText(cc);}
			else{throw value.error("This dictionary can only values that are lists, texts, or dictionaries.");}
			dictionary.add(key.asText(cc), outputValue, type);
		});
		return dictionary;
	}
}
export class ListParse extends Parse implements AsArray, AsList {
	items: Array<AsAble>;

	constructor(start: Position, end: Position, items: Array<AsAble>) {
		super(start, end);
		this.items = items;
	}
	asArray() { // -> ""[]
		return this.items.map(item => {
			if(!canBeString(item)) {throw item.error("To convert to an array, all elements must be strings")}
			return item.asString()
		});
	}
	asList(cc: ConvertingContext) { // -> Text[]
		return new List(this.items.map(item => {
			if(!canBeText(item)) {throw item.error("To convert to a list, all items must be texts")}
			return item.asText(cc)
		}));
	}
}
export class BarlistParse extends ListParse implements AsText, AsString {
	asString() {
		return this.items.map(item => {
			if(!canBeString(item)) {throw item.error("To convert to an array, all elements must be strings")}
			return item.asString()
		}).join("\n");
	}
	asText(cc: ConvertingContext) { // -> Text
		const finalText = new Text;
		this.items.forEach((item, i) => {
			if(!canBeText(item)) {throw item.error("To convert to a text, all elements must be texts")}
			finalText.add(item.asText(cc));
			if(this.items.length - 1 !== i) {
				finalText.add("\n");
			}
		});
		// this.data.join`\n` but for non-strings
		// finalText.add(...this.data.items.map(i=>i.asText()));
		return finalText;
	}
}

export class CharsParse extends Parse implements AsString, AsText {
	// [...string|Parse(has asVariable)]
	items: [string | AsAble]
	constructor(start: Position, end: Position, items: [string | AsAble]) {
		super(start, end);
		this.items = items;
	}
	asString() { // returns a raw string
		let string = "";
		this.items.forEach(item => {
			if(typeof item === "string") {
				string += item;
				return;
			}
			throw new Error(`To convert to a string, all items must be strings.`);
		});
		return string;
	}
	asText(cc: ConvertingContext) {
		const text = new Text;
		this.items.forEach(item => {
			if(typeof item === "string") {
				return text.add(item);
			}
			if(!canBeVariable(item)) {throw item.error("To convert to text, all items must be variables")}
			return text.add(item.asVariable(cc));
		});
		return text;
	}
}
export class IdentifierParse extends Parse implements AsString, AsBoolean, AsText {
	value: string
	constructor(start: Position, end: Position, str: string) {
		super(start, end);
		this.value = str;
	}
	asString() {
		return this.value;
	}
	asBoolean() {
		const string = this.asString();
		if(string === "true") {return true;}
		if(string === "false") {return false;}
		throw this.error("To convert to a boolean, the value must be true or false.");
	}
	asText(_cc: ConvertingContext) {
		const text = new Text;
		text.add(this.value);
		return text;
	}
}
export class ArglistParse extends DictionaryParse {
	constructor(start: Position, end: Position, keyValuePairs: { key: AsAble; value: AsAble; }[] ){
		super(start, end, keyValuePairs);
		this.special = "Arglist";
	}
}
export class VariableFlagParse extends Parse {
	variable: AsAble
	constructor(start: Position, end: Position, variable: AsAble) {
		super(start, end);
		this.variable = variable;
	}
}
export class ActionParse extends Parse implements AsText, AsVariable, AsAction {
	name: AsAble
	args: Array<AsAble>
	variable: AsAble
	constructor(start: Position, end: Position, name: AsAble, args: Array<AsAble>, variable: AsAble) {
		super(start, end);
		this.name = name;
		this.args = args;
		this.variable = variable;
	}
	// Action[Argument,Argument...]
	asText(cc: ConvertingContext) { // Gets a text containing this action as a variable
		const variable = this.asVariable(cc);
		const text = new Text();
		text.add(variable);
		return text;
	}
	asVariable(cc: ConvertingContext) { // returns the Variable for this ActionParse
		const action = this.asAction(cc); // adds the action
		return new MagicVariable(action);
		// otherwise: add a Set Variable action
		// throw new Error(`Actions of type ${action.info.id} cannot be converted to a variable.`);
	}
	asAction(cc: ConvertingContext) { // returns an Action for this ActionParse
		if(!canBeString(this.name)) {throw this.name.error("To convert to an action, the action name must be a string")}
		const actionName = this.name.asString().toLowerCase();
		let wfAction;
		let controlFlowData;
		if(actionName === "flow"
		|| actionName === "otherwise"
		|| actionName === "else"
		|| actionName === "case") { // flow/case/otherwise action
			controlFlowData = cc.nextControlFlow();
			wfAction = controlFlowData.wfaction;
		}else if(actionName === "end") {
			controlFlowData = cc.endControlFlow();
			wfAction = controlFlowData.wfaction;
		}else{
			wfAction = getActionFromName(actionName);
		}
		if(!wfAction) {
			throw new Error(`The action named ${actionName.toLowerCase()} could not be found.`);
		}
		const action = wfAction.build(cc, controlFlowData, ...this.args);
		// WFAction adds it to cc for us, no need to do it ourselves.
		// now add any required set variable actions
		if(this.variable) {
			if(!canBeNameType(this.variable)) {throw this.variable.error("To convert to an action, the output variable must be a nametype")}
			const {name, type} = this.variable.asNameType(); // TODO not this
			if(type === "v") {
				cc.add(setVariable(name));
				cc.vardata[name] = true;
			}else if(type === "mv") {
				action.magicvarname = `${type}:${name}`;
				cc.magicvardata[name] = {action: action};
			}
		}
		return action;
	}
}
export class VariableParse extends Parse implements AsStringVariable, AsNameType, AsText, AsVariable, AsAction {
	type: AsAble
	name: AsAble
	forkey: AsAble
	options: AsAble

	constructor(start: Position, end: Position, type: AsAble, name: AsAble, forkey: AsAble, options: AsAble) {
		super(start, end);
		this.type = type;
		this.name = name;
		this.forkey = forkey;
		this.options = options;
	}
	asStringVariable() {

		if(!canBeString(this.name)) {throw this.name.error("To convert to a stringvariable, the variable name must be a string")}
		if(!canBeString(this.type)) {throw this.type.error("To convert to a stringvariable, the variable type must be a string")}
		const name = this.name.asString();
		const type = this.type.asString();

		if(type !== "v") {throw new Error(`Only named (v:) variables can be used in this field.`);}
		return name;
	}
	asNameType() {

		if(!canBeString(this.name)) {throw this.name.error("To convert to a nametype, the variable name must be a string")}
		if(!canBeString(this.type)) {throw this.type.error("To convert to a nametype, the variable type must be a string")}
		const name = this.name.asString();
		const type = this.type.asString();

		if(type !== "v" && type !== "mv") {throw new Error(`Only v:and mv: variables can be used in an arrow.`);}
		return {name, type};
	}
	asText(cc: ConvertingContext) {
		const text = new Text;
		text.add(this.asVariable(cc));
		return text;
	}
	asVariable(cc: ConvertingContext) { //Converts this v:variable to a variable
		let variable: Attachment;

		if(!canBeString(this.name)) {throw this.name.error("To convert to a variable, the variable name must be a string")}
		if(!canBeString(this.type)) {throw this.type.error("To convert to a variable, the variable type must be a string")}
		const name = this.name.asString();
		const type = this.type.asString();
		let aggrandizements: {[key: string]: string};
		if(this.options) {
			if(!canBeRawDictionary(this.options)) {throw this.options.error("To convert to a variable, the aggrandizements object must be a raw dictionary")}
			aggrandizements = this.options.asRawDictionary(); // should be asRawKeyedDictionary and then use asstirng inside
		}else{
			aggrandizements = {};
		}

		if(type === "v") { // named variable
			let vardata = cc.vardata[name];
			if(name.startsWith("Repeat Index") || name.startsWith("Repeat Item")) {vardata = true;}
			if(!vardata) {throw new Error(`${type}:${name} is not yet defined.`);}
			variable = new NamedVariable(name);
		}else if(type === "mv") { // magic variable
			const vardata = cc.magicvardata[name];
			if(!vardata) {throw new Error(`${type}:${name} is not yet defined.`);}
			const mvact = vardata.action;
			variable = new MagicVariable(mvact);
		}else if(type === "s") { // special variable
			const attachtype: {[key: string]: string} = {clipboard: "Clipboard", askwhenrun: "Ask", currentdate: "CurrentDate", shortcutinput: "ExtensionInput", actioninput: "Input"};
			const attachvalue = attachtype[name.toLowerCase()];
			if(!attachvalue) {
				throw new Error(`Invalid special variable type ${name.toLowerCase()} valid are ${Object.keys(attachtype)}`);
			}
			variable = new Attachment(attachvalue);
		}else{
			throw new Error(`Invalid vartype ${type}. Valid are v, mv, s`);
		}
		if(this.forkey) {
			variable.aggrandizements.coerce("dictionary");
			if(!canBeString(this.forkey)) {throw this.forkey.error("To convert to a variable, the forkey value must be a string")}
			variable.aggrandizements.forKey(this.forkey.asString());
		}
		Object.keys(aggrandizements).forEach(key => {
			const value = aggrandizements[key];
			switch (key.toLowerCase()) {
				case "key":
				case "forkey":
					variable.aggrandizements.forKey(value);
					break;
				case "as":
				case "coerce":
					variable.aggrandizements.coerce(value);
					break;
				case "get":
				case "property":
					variable.aggrandizements.property(value);
					break;
				default:
					throw new Error(`Invalid aggrandizement ${key.toLowerCase()}, valid are [key, as, get]`);
			}
		});
		return variable;
	}
	asAction(cc: ConvertingContext) {
		const action = getVariable(this.asVariable(cc));
		cc.add(action);
		return action;
	}
}

export class ActionsParse {
	actions: Array<AsAble>
	constructor(actions: Array<AsAble>) {
		this.actions = actions;
	}
	asShortcut() {
		const cc = new ConvertingContext();
		this.actions.forEach(action => {
			if(!canBeAction(action)) {throw action.error("To convert to a shortcut, all actions must be actions")}
			action.asAction(cc)
		});
		if(cc.controlFlowStack.length !== 0) {
			throw new Error(`There are ${cc.controlFlowStack.length} unterminated block actions. Check to make sure every block has an else.`);
		}
		return cc.shortcut;
	}
}
// Text::asString
// Text::build
