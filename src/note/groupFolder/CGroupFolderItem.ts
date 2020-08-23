import { CFolderNoteItem } from "../folder";
import { VGroupFolderItem } from "./VFolderNoteItem";
import { VGroupFolder } from "./VGroupFolder";

export class CGroupFolderItem extends CFolderNoteItem {
	renderItem(index: number): JSX.Element {
		let vNoteItem = new VGroupFolderItem(this);
		return vNoteItem.render();
	}

	showFolder() {
		this.load();
		this.openVPage(VGroupFolder);
	}
}