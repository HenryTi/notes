import React from 'react';
import { VPage, tv, FA } from "tonva";
import { CTaskNoteItem } from "./CTaskNoteItem";
import { VNoteBase, CheckItem } from 'note/item';
import { observer } from 'mobx-react';
import { VEdit } from './VEdit';


export class VView extends VNoteBase<CTaskNoteItem> {
	protected get back(): 'close' | 'back' | 'none' {return 'close'}
	header() {return '任务'}
	content() {
		let {note} = this.param;
		return tv(note, (values) => {
			let {caption, content} = values;
			if (!this.title) this.title = caption;
			this.parseContent(content);
			return <div className="my-2 mx-1 border rounded">
				<div className="bg-white">
					{caption && <div className="px-3 py-2 border-bottom">
						<div><b>{caption}</b></div>
					</div>}
					{
						this.checkable===false? 
						<div className="py-3">{this.renderContent()}</div>
						: this.renderItems()
					}
				</div>
				{this.renderBottomCommands()}
			</div>;
		});
	}

	protected renderBottomCommands() {
		let {owner, assigned} = this.param;
		let left:any, right:any;
		let isMe = this.isMe(owner);
		if (isMe === true) {
			left = <button onClick={this.onDone} className="btn btn-primary mx-3">
				完成
			</button>;
			right = <>
				<div onClick={this.onEdit} className="px-3 py-2 cursor-pointer text-primary ml-3">
					<FA name="pencil-square-o" />
				</div>
			</>;
		}
		else {
			right = <div className="px-2 text-muted small">
				来自：{this.renderContact(owner as number, assigned)}
			</div>;
		}
		return <div className="py-2 bg-light border-top d-flex">
			{left}
			<div className="mr-auto" />
			{right}
		</div>;
	}

	private onEdit = () => {
		this.parsed = false;
		this.openVPage(VEdit, this.param);
	}

	private onDone = async () => {
		//await this.controller.cApp.loadRelation();
		//this.controller.showTo(this.param.note)
		alert('提交完成');
	}

	protected renderItem(v:CheckItem) {
		let {key, text, checked} = v;
		let cn = 'form-control-plaintext ml-3 ';
		let content: any;
		if (checked === true) {
			cn += 'text-muted';
			content = <del>{text}</del>;
		}
		else {
			content = text;
		}
		return <label key={key} className="d-flex mx-3 my-0 align-items-center form-group form-check">
			<input className="form-check-input mr-3 mt-0" type="checkbox"
				defaultChecked={checked}
				onChange={this.onCheckChange}
				data-key={key} />
			<div className={cn}>{content}</div>
		</label>;
	}

	protected renderItems() {
		return React.createElement(observer(() => {
			let uncheckedItems:CheckItem[] = [];
			let checkedItems:CheckItem[] = [];
			for (let ci of this.items) {
				let {checked} = ci;
				if (checked === true) checkedItems.push(ci);
				else uncheckedItems.push(ci);
			}			
			return <div className="">
				{uncheckedItems.map((v, index) => this.renderItem(v))}
				{
					checkedItems.length > 0 && <div className="border-top mt-2 pt2">
						<div className="px-3 pt-2 small text-muted">{checkedItems.length}项完成</div>
						{checkedItems.map((v, index) => this.renderItem(v))}
					</div>
				}
			</div>;
		}));
	}

	private onCheckChange = async (evt:React.ChangeEvent<HTMLInputElement>) => {
		let t = evt.currentTarget;
		let key = Number(t.getAttribute('data-key'));
		let item = this.items.find(v => v.key === key);
		if (item) item.checked = t.checked;

		let noteContent = this.stringifyContent();
		await this.controller.owner.setNote(false,
			this.param,
			this.title, 
			noteContent);
	}
}
