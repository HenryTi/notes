import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { VBasePage } from './VBasePage';
import { List, User, Image, UserView, FA } from 'tonva';
import { Contact } from 'model';

export interface SelectContactOptions {
	title?: string;
	action?: string;
	single?: boolean;
}

export class VSelectContact extends VBasePage {
	@observable private anySelected:boolean = false;
	@observable private contacts: Contact[];
	@observable private multiple:boolean = false;
	private list: List;
	private options: SelectContactOptions;

	init(options: SelectContactOptions):void {
		this.options = options;
	}

	protected get back(): 'close' | 'back' | 'none' {return 'close'}

	header() {return this.options?.title ?? '选择'}
	right() {
		return React.createElement(observer(this.buildRight));
	}

	private buildRight = () => {
		if (this.options?.single === true) return;
		let cn = 'btn btn-sm btn-success mr-1';
		if (this.multiple === false) {
			return <button className={cn} onClick={this.onToggleSelect}>多选</button>;
		}
		if (this.contacts && this.contacts.length > 0) {
			return <button className={cn} onClick={this.onNext} disabled={!this.anySelected}>
				{this.options?.action ?? '选中'}({this.contacts.length}) <FA name="angle-right" />
			</button>;
		}
		return <button className={cn} onClick={this.onToggleSelect}>单选</button>;
	}

	private onToggleSelect = () => {
		this.multiple = !this.multiple;
	}

	content() {
		let render = () => {
			let list:any;
			let items = this.controller.cApp.contacts;
			if (this.multiple === true) {
				list = <List ref={v => this.list = v}
					items={items} 
					item={{render:this.renderContact, onSelect:this.onContactSelect}} />
			}
			else {
				list = <List ref={v => this.list = v}
					items={items} 
					item={{render:this.renderContact, onClick:this.onContactClick}} />
			}
			return <div className="">
				{list}
			</div>;
		}
		return React.createElement(observer(render));
	}

	private renderContact = (item:Contact, index:number) => {
		let {contact, assigned} = item;
		let renderUser = (user:User) => {
			let {name, nick, icon} = user;
			return <div className="px-3 py-2">
				<Image className="w-2c h-2c mr-3" src={icon} />
				{name} {nick} {assigned}
			</div>
		}
		return <UserView user={contact} render={renderUser} />;
	}

	private onContactSelect = (item:Contact, isSelected:boolean, anySelected:boolean):void => {
		this.anySelected = anySelected;
		this.contacts = this.list.selectedItems;
	}

	private onContactClick = (item:Contact) => {
		this.returnCall([item]);
	}

	private onNext = () => {
		this.returnCall(this.list.selectedItems);
		/*
		let contacts = this.list.selectedItems;
		this.controller.contacts = contacts;
		this.openVPage(VActions); //, {contacts, noteId: this.currentNoteId});
		*/
	}
}