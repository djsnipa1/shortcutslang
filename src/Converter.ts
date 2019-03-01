import * as uuidv4 from "uuid/v4";
import {Shortcut, Action} from "./OutputData";
import {WFAction} from "./ActionData"

export class ConvertingContext {
	vardata: {[key: string]: boolean}
	magicvardata: {[key: string]: {action: Action}}
	shortcut: Shortcut
	lastVariableAction: Action
	controlFlowStack: Array<{uuid: string, number: number, wfaction: any}>
	currentActions: Array<WFAction>

	constructor() {
		this.vardata = {};
		this.magicvardata = {};
		this.shortcut = new Shortcut("My Great Shortcut");
		this.lastVariableAction = undefined;
		///
		this.controlFlowStack = [];
		this.currentActions = []; // we're not going to use this
	}
	pushControlFlow(wfaction: any) {
		const res = {uuid: uuidv4(), number: 0, wfaction};
		this.controlFlowStack.push(res);
		return res;
	}
	nextControlFlow() {
		if(this.controlFlowStack.length === 0) {
			throw new Error(`There are no control flow groups active.`);
		}
		const last = this.controlFlowStack[this.controlFlowStack.length - 1];
		last.number = 1;
		return last;
	}
	endControlFlow() {
		if(this.controlFlowStack.length === 0) {
			throw new Error(`There are no control flow groups active.`);
		}
		const last = this.controlFlowStack.pop();
		last.number = 2;
		return last;
	}
	add(action: Action) {
		// Adds an action to a shortcut
		this.shortcut.add(action);
		this.lastVariableAction = action;
	}
	get currentAction(){
		return this.currentActions[this.currentActions.length - 1]
	}
	makeError(message: string){
		// converter will store what action is being edited and say that in the error message.
		// actions will be instantiated with a line number
		// PLAN!!!
		return new Error(`Error\`: ${message}`);
	}
    pushCurrentAction(action: WFAction) { // todo pushCurrentPosition/popCurrentPosition instead or something idk
		this.currentActions.push(action);
    }
    popCurrentAction(action: WFAction) {
		let poppedAction = this.currentActions.pop();
		if(poppedAction !== action){
			console.log(`WARN: The wrong action was popped`);
		}
    }
}
