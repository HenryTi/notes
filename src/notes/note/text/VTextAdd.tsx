import React from "react";
import { VTextEdit } from "./VTextEdit";
import { observer } from "mobx-react";

export class VTextAdd extends VTextEdit {
	protected parentId: number;

	init(param?:any):void 
	{
		super.init(param);
		this.parentId = param;
	}

	header() {return '新建文字单'}

	protected async onButtonSave(): Promise<void> {
		//this.controller.cContent.checkHaveNewItem?.();
		await this.controller.AddNote(this.parentId);
		this.closePage();
		return;
	}

	protected renderExButtons():JSX.Element {
		return React.createElement(observer(() => {
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
		//this.checkInputAdd();
		let cnewNote = await this.controller.AddNote(this.parentId);
		this.closePage();
		await cnewNote.cApp.loadRelation();
		cnewNote.showTo(1);
	}

}
