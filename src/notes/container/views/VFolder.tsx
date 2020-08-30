import React from 'react';
import { List, FA, User, Image, UserView } from 'tonva';
import { CContainer } from '../CContainer';
import { CNoteBase, VNoteBaseView } from "../../noteBase";

export class VFolder extends VNoteBaseView<CContainer> {
	afterBack() {
		this.controller.owner.popFolder();
	}
	header() {
		let {noteItem} = this.controller;
		if (noteItem) {
			return noteItem.caption;
		}
		return this.t('notes')
	}

	right() {
		// 应该任何群成员都可以发小单吧
		//if (this.isMe(this.controller.noteItem.owner)) {
			return this.controller.owner.renderSpaceDropDown();
		//}
	}

	protected top() {
		let {noteItem} = this.controller;
		if (!noteItem) return;

		let paragraphs: string;
		let {content: contentString} = noteItem;
		let json = JSON.parse(contentString);
		if (json) {
			let {content} = json;
			paragraphs = (content as string)?.trimEnd();
		}
		else {
			paragraphs = "整理小单";
		}
		let left: any;
		if (this.isMe(this.controller.noteItem.owner)) {
			left = <>
				<FA className="mr-3 text-warning py-3" name={noteItem.toCount > 0 ? "folder-open":"folder"} size="3x" />
				<div className="small text-muted py-3">{this.renderParagraphs(paragraphs)}</div>
			</>;
		}
		else {
			let {owner, assigned} = noteItem;
			let renderUser = (user:User) => {
				let {name, nick, icon} = user;
				return <>
					<Image className="w-3c h-3c mr-2 my-3" src={icon || '.user-o'} />
					<div className="py-3">
						<div className="small">{assigned || nick || name}</div>
						<div className="small text-muted py-3">{this.renderParagraphs(paragraphs)}</div>
					</div>
				</>;
			}
			left = <UserView user={owner as number} render={renderUser} />;
		}
		return <div className="d-flex ml-3">
			{left}
			<div className="ml-auto align-self-stretch cursor-pointer px-3 d-flex align-items-center" 
				onClick={(e)=>{e.stopPropagation(); this.controller.showFolderView()}}>
				<FA name="ellipsis-h" />
			</div>
		</div>;
	}

	content() {
		let {notesPager} = this.controller;
		return <div>
			{this.top()}
			<List className="" 
				items={notesPager} 
				item={{render: this.renderListItem, key: this.noteKey, onClick: this.onNoteClick, className:'notes'}} />
		</div>
	}

	renderListView() {
		return this.content();
	}

	private noteKey = (item: CNoteBase) => {
		let note = item.noteItem.note;
		return note;
	}

	private renderListItem = (cNoteBase: CNoteBase, index:number) => {
		return <div className="d-block mb-2 bg-white">{cNoteBase.renderListItem(index)}</div>;
	}

	private onNoteClick = async (item: CNoteBase) => {
		let noteItem = item.noteItem;
		let noteModel = await this.controller.getNote(noteItem.note);
		noteItem.unread = 0;
		noteItem.commentUnread = 0;
		item.noteModel = noteModel;
		return item.showNoteView();
	}
}