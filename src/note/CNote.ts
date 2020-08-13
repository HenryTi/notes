import { CUqBase, EnumSpecFolder } from "tapp";
import { QueryPager } from "tonva";
import { VList, VSelectContact, SelectContactOptions } from "./views";
import { CTextNoteItem } from "./text";
import { EnumNoteItemType, NoteItem, NoteModel } from "./model";
import { CNoteItem } from "./item/CNoteItem";
import { VTo } from "./views/VTo";
import { CTaskNoteItem } from "./task/CTaskNoteItem";
import { Contact } from "model";
import { observable } from "mobx";
import { VSent } from "./views/VSent";

const cNoteItems: {[key in EnumNoteItemType]: new (...args: any[])=> CNoteItem} = {
	[EnumNoteItemType.text]: CTextNoteItem,
	[EnumNoteItemType.task]: CTaskNoteItem,
};

export class CNote extends CUqBase {
	folderId: number;
	notesPager: QueryPager<CNoteItem>;
	@observable contacts: Contact[];
	noteItem: NoteItem;
	//noteModel: NoteModel;

    protected async internalStart() {
	}

	init(folderId?: number) {
		if (!folderId) this.folderId = -EnumSpecFolder.notes;
		else this.folderId = folderId;
		let {notes} = this.uqs;
		this.notesPager = new QueryPager<CNoteItem>(notes.GetNotes, undefined, undefined, true);
		this.notesPager.setItemConverter(this.noteItemConverter);
	}

	private noteItemConverter = (item:NoteItem, queryResults:{[name:string]:any[]}):CNoteItem => {
		let cNoteItem = this.getCNoteItem(item.type);
		cNoteItem.parseItemObj(item);
		cNoteItem.init(item);
		return cNoteItem;
	}

	private getCNoteItem(type: EnumNoteItemType): CNoteItem {
		let ret = cNoteItems[type];
		if (ret === undefined) {
			debugger;
			throw new Error(`type ${type} CNoteItem not defined`);
		}
		return this.newSub(ret);
	}

	async load() {
		await this.notesPager.first({folderId: this.folderId});
	}

	async refresh() {
		//每次刷新取5个。
		let newnotes = new QueryPager<NoteItem>(this.uqs.notes.GetNotes, 5, 5, false);
		await newnotes.first({folderId: this.folderId});
		let newitems = newnotes.items;
		if (newitems) {
			let len = newitems.length;
			let items = this.notesPager.items;
			for (let i = len - 1; i >= 0; --i) {
				let item = newitems[i];
				let note = item.note;
				let index = items.findIndex(v => v.noteItem.note===note);
				if (index >= 0) {
					items.splice(index, 1);
				}
				let cNoteItem = this.noteItemConverter(item, undefined);
				items.unshift(cNoteItem);
			}
		}
	}

	async getNote(id: number): Promise<NoteModel> {
		let ret = await this.uqs.notes.GetNote.query({folder: this.folderId, note: id});
		let noteModel:NoteModel = ret.ret[0];
		noteModel.to = ret.to;
		noteModel.flow = ret.flow;
		noteModel.spawn = ret.spawn;
		noteModel.contain = ret.contain;
		return noteModel;
	}

	async addNote(caption:string, content:string, obj:any) {
		let type = EnumNoteItemType.text;
		let sub = 0;
		let ret = await this.uqs.notes.AddNote.submit({caption, content, type, sub});
		let {note} = ret;
		//let {Note} = this.uqs.notes;
		let date = new Date();
		let noteItem:NoteItem = {
			seconds: undefined,
			owner: this.user.id,
			note: note as number,
			type: EnumNoteItemType.text,
			from: undefined,
			caption,
			content,
			assigned: undefined,
			state: undefined,
			unread: undefined,
			obj,
			$create: date,
			$update: date,
		}
		let cNoteItem = this.getCNoteItem(EnumNoteItemType.text);
		cNoteItem.init(noteItem);
		this.notesPager.items.unshift(cNoteItem);
		return cNoteItem;
	}

	async setNote(waiting:boolean, noteItem:NoteItem, caption:string, content:string, obj:any) {
		let {SetNote, Note} = this.uqs.notes;
		let {note, type} = noteItem;
		await SetNote.submit({note, caption, content, type}, waiting);
		Note.resetCache(note);
		let {items} = this.notesPager;
		let index = items.findIndex(v => v.noteItem.note===note);
		if (index >= 0) {
			let theItems = items.splice(index, 1);
			let theItem = theItems[0];
			theItem.noteItem.caption = caption;
			theItem.noteItem.content = content;
			theItem.noteItem.obj = obj;
			items.unshift(theItem);
		}
	}

	async sendNoteTo(note:number, toList:number[]) {
		let tos = toList.join('|');
		await this.uqs.notes.SendNoteTo.submit({note, tos});
	}

	async hideNote(note:number, x:number) {
		await this.uqs.notes.HideNote.submit({note, x});
		let index = this.notesPager.items.findIndex(v => v.noteItem.note === note);
		if (index >= 0) this.notesPager.items.splice(index, 1);
	}

	renderListView() {
		return this.renderView(VList);
	}

	showAddNotePage = () => {
		let cTextNoteItem = this.newSub(CTextNoteItem);
		cTextNoteItem.showAddNotePage();
	}

	showTo(noteItem:NoteItem, backPageCount:Number) {
		this.noteItem = noteItem;
		this.openVPage(VTo, backPageCount);
	}

	showSentPage() {
		this.openVPage(VSent);
	}

	async callSelectContact(options: SelectContactOptions): Promise<Contact[]> {
		return await this.vCall(VSelectContact, options);
	}

	showAssignTaskPage() {
		let cTaskNoteItem = this.newSub(CTaskNoteItem);
		cTaskNoteItem.init(this.noteItem);
		cTaskNoteItem.showAssignTaskPage();
	}
}
