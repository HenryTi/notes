import { BoxId } from "tonva";
import { EnumTaskState } from "./note/task/TaskState";

export enum EnumNoteType {
	text=0, task=1, comment=2, folder=3, group=4, groupFolder=5, unit=6, assign=7,
	textList=8, textCheckable=9,
}

export interface NoteItem {
	seconds: number;
	owner: number | BoxId;
	note: number;
	type: EnumNoteType;
	caption: string;
	content: string;
	assigned: string;
	from: number | BoxId;
	fromAssigned: string;
	state: EnumTaskState;
	flowContent?: string;
	groupFolder?:number;
	unread: number;
	obj: any;
	toCount?: number;
	spawnCount?: number;
	commentCount?: number;
	commentUnread?: number;
	$create: Date;
	$update: Date;
}

export interface NoteFlow {	
}

export interface Access {
	user: number;
	access: number;
	assigned: string;
}

export interface CommentItem {
	id: number;
	content: string;
	owner: number;
	assigned: string;
	$create: Date;
	$update: Date;
}

export interface NoteModel {
	id: number;
	caption: string;
	content: string;
	type: EnumNoteType,
	$create: Date;
	$update: Date;
	to: Access[];
	flow: NoteFlow[];
	spawn: NoteItem[];
	contain: NoteItem[];
	comments: CommentItem[];
}

export function replaceAll(str:string, findStr:string, repStr:string):string {
	if (!str) return str;
	return str.split(findStr).join(repStr);
}

export function numberFromId(id:number|BoxId):number {
	let _id:number;
	switch (typeof id) {
			case 'object': _id = (id as BoxId).id; break;
			case 'number': _id = id as number; break;
			default: return;
	}
	return _id;
}
