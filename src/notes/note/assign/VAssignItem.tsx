import React from 'react';
import { observer } from 'mobx-react';
import { VNoteBaseItem } from '../../noteBase';
import { CNoteAssign } from './CNoteAssign';

export class VAssignItem extends VNoteBaseItem<CNoteAssign> {
	/*
	render() {
		return React.createElement(observer(() => {
			let {title} = this.controller;
			return <div className="">
				{this.renderViewTop()}
				<div className="bg-white py-2 mb-3">
					{title && <div className="px-3 py-2">
						<div><b>{title}</b></div>
					</div>}
					{this.renderContent()}
				</div>
				{this.renderRelatives()}
			</div>;
		}));
	}
	*/
}