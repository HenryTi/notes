import { CUqBase, EnumSpecFolder } from "tapp";
import { QueryPager } from "tonva";
import { VList, VSelectContact, SelectContactOptions } from "./views";
import { CTextNoteItem } from "./text";
import { EnumNoteItemType, NoteItem, NoteModel } from "./model";
import { CNoteItem } from "./item/CNoteItem";
import { VTo } from "./views/VTo";
import { CTaskNoteItem, EnumTaskState } from "./task/CTaskNoteItem";
import { Contact } from "model";
import { observable } from "mobx";
import { VSent } from "./views/VSent";
import { CFolderNoteItem } from "./folder";

const cNoteItems: {[key in EnumNoteItemType]: new (...args: any[])=> CNoteItem} = {
	[EnumNoteItemType.text]: CTextNoteItem,
	[EnumNoteItemType.task]: CTaskNoteItem,
	[EnumNoteItemType.folder]: CFolderNoteItem,
};

export class CNote extends CUqBase {
	protected foldItem: CFolderNoteItem[];
	@observable contacts: Contact[];
	noteItem: NoteItem;
	//noteModel: NoteModel;

    protected async internalStart() {
	}

	init(folderId?: number) {
		this.foldItem = [this.newSub(CFolderNoteItem)];
	}

	noteItemConverter = (item:NoteItem, queryResults:{[name:string]:any[]}):CNoteItem => {
		let cNoteItem = this.getCNoteItem(item.type);
		item = cNoteItem.convertObj(item);
		cNoteItem.init(item);
		return cNoteItem;
	}

	get currentFoldItem() {
		return this.foldItem[0];
	}

	get items() {
		return this.currentFoldItem.notesPager;
	}

	openFolder(foldItem:CFolderNoteItem) {
		this.foldItem.unshift(foldItem);
		this.currentFoldItem.showFolder();
	}

	popFolder() {
		if (this.foldItem.length > 1) {
			this.foldItem.splice(0, 1);
		}
	}

	getCNoteItem(type: EnumNoteItemType): CNoteItem {
		let ret = cNoteItems[type];
		if (ret === undefined) {
			debugger;
			throw new Error(`type ${type} CNoteItem not defined`);
		}
		return this.newSub(ret);
	}

	async load() {
		await this.currentFoldItem.load();
	}

	async refresh() {
		await this.currentFoldItem.refresh();
	}

	async getNote(id: number): Promise<NoteModel> {
		return await this.currentFoldItem.getNote(id);
	}

	async addNote(folder:number, caption:string, content:string, obj:any, type: EnumNoteItemType) {
		return await this.currentFoldItem.addNote(folder, caption, content, obj, type);
	}

	async setNote(waiting:boolean, noteItem:NoteItem, caption:string, content:string, obj:any) {
		return await this.currentFoldItem.setNote(waiting, noteItem, caption, content, obj);
	}

	async sendNoteTo(note:number, toList:number[]) {
		let tos = toList.join('|');
		await this.uqs.notes.SendNoteTo.submit({note, tos});
	}

	async hideNote(note:number, x:number) {
		await this.currentFoldItem.hideNote(note, x);
	}

	renderListView() {
		return this.currentFoldItem.renderListView();
	}

	showAddNotePage = (parent: number) => {
		let cTextNoteItem = this.newSub(CTextNoteItem);
		cTextNoteItem.showAddNotePage(parent);
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
