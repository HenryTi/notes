import { numberFromId } from "../../../model";
import { CNoteTask } from "../CNoteTask";
import { VTaskStart } from "./VTaskStart";
import { TaskStateResult, EnumTaskState } from "../TaskState";

export class CTaskStart extends CNoteTask {	
	showViewPage():void {this.openVPage(VTaskStart);};

	get taskStateResult(): TaskStateResult {
		return {content: '待办', isEnd: false}
	}

	async DoneTask() {
		let { note: noteId, caption } = this.noteItem;
		let obj = this.endContentInput();
		let content = JSON.stringify(obj);
		let data = {
			groupFolder: this.owner.currentFold.groupFolder,
			folder: this.owner.currentFold.folderId,
			note: numberFromId(noteId),
			content: content,
			caption: caption,
			hours: this.hours
		}

		await this.uqs.notes.DoneTask.submit(data);
		this.noteItem.state = Number(EnumTaskState.Done);
		this.noteItem.$update = new Date();
	}
}
