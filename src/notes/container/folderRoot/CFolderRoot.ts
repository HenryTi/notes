import { CFolder } from "../CFolder";

export class CFolderRoot extends CFolder {
	protected renderIcon(): JSX.Element {
		return; //renderIcon(this.noteItem.toCount>0? 'files-o': 'file-o', 'text-info');
	}
}