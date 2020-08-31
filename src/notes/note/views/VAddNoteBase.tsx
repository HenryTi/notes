import React from "react";
import { VNoteForm } from './VNoteForm';
import { CNote } from '../CNote';

export class VAddNoteBase<T extends CNote> extends VNoteForm<T> {
	protected get back(): 'close' | 'back' | 'none' {return 'close'}
	protected parentId: number;

	init(param?:any):void 
	{
		super.init(param);
		this.parentId = param;
	}

	content() {
		return <>VAddNoteBase</>; // this.renderEdit();
	}

	// protected getOptions(): {val:number, text:string}[] {
	// 	return [
	// 		{ val: 0, text: '文字' },
	// 		{ val: 2, text: '列表' },
	// 		{ val: 1, text: '勾选事项' },
	// 		{ val: 3, text: '小单夹' },
	// 	];
	// }
	/*
	protected getSaveDisabled():boolean {
		if (this.controller.title !== undefined) {
			return this.controller.title.length === 0;
		}
		if (this.controller.changedNoteContent !== undefined) {
			return this.controller.changedNoteContent.length === 0;
		}
		return true;
    }

	protected async onButtonSave(): Promise<void> {
		this.checkInputAdd();
		let type =  //this.controller.checkType === EnumCheckType.folder ? EnumNoteType.folder : EnumNoteType.text;
		await this.controller.AddNote(this.parentId); //, type);
		this.closePage();
		return;
	}

	protected renderExButtons():JSX.Element {
		return React.createElement(observer(() => {
			//if (this.controller.checkType === EnumCheckType.folder)
			//	return;
			return this.renderShareButton();
		}));
	}

	protected renderShareButton() {
		return <button onClick={this.onSaveAndSendNote}
			className="btn btn-outline-primary mr-3">
			发给
		</button>;
	}

	protected onSaveAndSendNote = async () => {
		this.checkInputAdd();
		let type = this.controller.checkType === EnumCheckType.folder ? EnumNoteType.folder : EnumNoteType.text;
		let cnewNote = await this.controller.AddNote(this.parentId, type);
		this.closePage();
		await cnewNote.cApp.loadRelation();
		cnewNote.showTo(1);
	}
	*/
}
