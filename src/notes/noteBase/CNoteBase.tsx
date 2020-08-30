import React from 'react';
import { observable } from "mobx";
import { NoteItem, NoteModel, EnumNoteType, RelativeKey, CheckItem } from '../model';
import { CNotes } from '../CNotes';
import { CUqSub } from '../../tapp';
import { VNoteBaseItem } from './VNoteBaseItem';

export abstract class CNoteBase extends CUqSub<CNotes> {
	disableFrom: boolean = false;
	@observable noteModel: NoteModel;
	@observable noteItem: NoteItem;
	//@observable toCount: number;
	//@observable spawnCount: number;
	//@observable commentCount: number;
	//@observable commentUnread: number;
	@observable relativeKey: RelativeKey;

	get groupFolder(): number {
		if (!this.noteItem)
			return undefined;
		let ret = this.noteItem.groupFolder;
		if (!ret && this.noteItem.type === Number(EnumNoteType.groupFolder)) {
			ret = this.noteItem.note;
		}

		return ret;
	}

	init(param: NoteItem): void {
		this.noteItem = param;
		if (!param) return;
		this.title = param.caption;
		//this.toCount = param.toCount;
		//this.spawnCount = param.spawnCount;
		//this.commentCount = param.commentCount;
		//this.commentUnread = param.commentUnread;
		let { obj } = param;
		if (obj) {
			this.checkType = Number(obj.check);
			if (this.checkType === 0 || this.checkType === 3) {
				this.noteContent = obj.content;
			}
			else {
				this.items.splice(0, this.items.length);
				this.itemKey = obj.itemKey;
				this.items.push(...obj.items);
			}
		}
	}

	@observable title: string;
	@observable noteContent: string;
	@observable checkType: number = 0;
	@observable items: CheckItem[] = [];
	@observable changedNoteContent: string;
	itemKey: number = 1;

	protected async internalStart() { }

	addItem(value: string): boolean {
		if (this.checkType === 1) {
			this.items.push({
				key: this.itemKey++,
				text: value,
				checked: false,
			});
		}
		else if (this.checkType === 2) {
			this.items.push({
				key: this.itemKey++,
				text: value,
			});
		}
		return false;
	}

	protected newVNoteItem():VNoteBaseItem<any> {return new VNoteBaseItem(this);}

	renderListItem(index: number): JSX.Element {
		let vNoteItem = new VNoteBaseItem(this);
		return vNoteItem.render();
	}

	protected abstract renderIcon(): JSX.Element;
	renderViewIcon(): JSX.Element {
		return <div className="mr-3">{this.renderIcon()}</div>;
	}
	renderItemIcon(): JSX.Element {
		let {unread} = this.noteItem;
		let dot:any;
		if (unread>0) dot = <u/>;
		return <div className="mr-3 unread-dot">{this.renderIcon()}{dot}</div>
	}

	abstract showNoteView(): void;

	protected stringifyContent() {
		let ret = JSON.stringify(this.buildObj());
		return ret;
	}

	protected buildObj(): any {
		let obj = this.noteItem ? { ...this.noteItem.obj } : {};
		if (this.checkType === 0 || this.checkType === 3) {
			obj.check = this.checkType;
			obj.content = this.changedNoteContent || this.noteContent;
			delete obj.itemKey;
			delete obj.items;
		}
		else {
			obj.check = this.checkType;
			obj.itemKey = this.itemKey;
			obj.items = this.items;
			delete obj.content;
		}
		return obj;
	}

	// convertObj 可以在不同的继承中被重载
	convertObj(item: NoteItem): NoteItem {
		item.obj = this.parseContent(item.content);
		return item;
	}

	protected parseContent(content: string): any {
		try {
			if (!content) return undefined;
			return JSON.parse(content);
		}
		catch (err) {
			console.error(err);
			return undefined;
		}
	}

	async showTo(backPageCount: number) {
		await this.owner.showTo(this.noteItem, backPageCount);
	}

	onCheckableChanged(type: number) {
		let oldType = this.checkType;
		this.checkType = type;
		if (oldType === 0) {
			let content = this.changedNoteContent || this.noteContent;
			if (content) {
				this.items.splice(0, this.items.length);
				this.items.push(...content.split('\n').filter((v, index) => {
						return v.trim().length > 0;
					}).map((v, index) => {
					if (this.checkType === 1) {
						return {
							key: this.itemKey++,
							text: v,
							checked: false
						}
					}
					else {
						return {
							key: this.itemKey++,
							text: v,
						}
					}
				}));
			}
		}
		else {
			if (this.checkType === 0 || this.checkType === 3) {
				this.noteContent = this.items.map(v => v.text).join('\n');
			}
			else if (this.checkType === 1) {
				this.items.map(v => v.checked = false);
			}
			else if (this.checkType === 2) {
				this.items.map(v => delete v.checked);
			}
		}
		this.changedNoteContent = undefined;
	}

	async onCheckChange(key: number, checked: boolean) {
		let item = this.items.find(v => v.key === key);
		if (item) item.checked = checked;
		await this.SetNote(false);
	}

	async SetNote(showWaiting: boolean = true) {
		let noteContent = this.stringifyContent();
		await this.owner.editNote(showWaiting,
			this.noteItem,
			this.title,
			noteContent,
			this.buildObj());
		this.updateChange();
	}

	private updateChange() {
		if (this.changedNoteContent) {
			this.noteContent = this.changedNoteContent;
			this.changedNoteContent = undefined;
		}
		if (this.noteItem) {
			this.noteItem.$update = new Date();
			if (this.title && this.title !== this.noteItem.caption) {
				this.noteItem.caption = this.title;
			}
			this.owner.updateFolderTime(this.noteItem.note, this.noteItem.$update);
		}
	}

	updateTime(time:Date) {
		if (this.noteItem) {
			this.noteItem.$update = time;
		}
	}

	async AddNote(parent: number, type:EnumNoteType) {
		let noteContent = this.stringifyContent();
		let ret = await this.owner.addNote(parent, this.title, noteContent, this.buildObj(), type);
		this.updateChange();
		return ret;
	}

	async AddComment(content: string) {
		let ret = await this.uqs.notes.AddComment.submit({ note: this.noteModel.id, content });
		let commentId = ret.comment;
		// 加入note界面，显示comment
		if (commentId) {
			this.noteItem.commentCount++;
			this.noteModel.comments.unshift({
				id: commentId,
				content: content,
				owner: this.user.id,
				assigned: undefined,
				$create: new Date(),
				$update: new Date(),
			});
		}
	}
}