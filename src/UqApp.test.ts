import fs from 'fs';
import { render, screen } from '@testing-library/react';
import { Action, Book, nav, Query, Sheet, Tuid, UqMan, UQsMan, Map, History, Tag, Pending, Entity } from 'tonva';

const uqAppPath = 'src/UqApp';
const red = '\x1b[41m%s\x1b[0m';
let lastBuildTime:number = 0;
test('build UqApp', async () => {
	if (lastBuildTime > 0) {
	//if (Date.now() - lastBuildTime < 30*1000) {
		console.log(red, 'quit !');
		return;
	}
	if (!fs.existsSync(uqAppPath)) {
		fs.mkdirSync(uqAppPath);
	}
	let ts = await buildTsFile();
	let fileFullPath = uqAppPath + '/uqs.build.ts';
	fs.writeFileSync(fileFullPath, ts);
	lastBuildTime = Date.now();
	console.log(red, `${fileFullPath} is built`);
}, 60*1000);

const appName = 'bruce/notes';
const appVersion = '1.0.0';
async function buildTsFile() {
	process.env.REACT_APP_UNIT = '24';
	await nav.init();
	await UQsMan.load(appName, appVersion, undefined);
	let uqsMan = UQsMan.value;
	let ret = 'import { Tuid, Query, Action/*, Map, Sheet, Tag*/ } from "../tonva";';
	let coll = uqsMan.getUqCollection();
	for (let i in coll) {
		let uq = coll[i];
		ret += '\n';
		ret += '\n//===============================';
		ret += `\n//======= UQ ${uq.name} ========`;
		ret += '\n//===============================';
		ret += '\n';
		ret += buildUQ(uq);
		ret += '\n';
		ret += '\n';
		ret += '\n';
	}

	return ret;
}

function uqBlock<T extends Entity>(entity: T, build: (entity: T)=>string) {
	let {name} = entity;
	if (name.indexOf('$') >= 0) return '';
	let entityCode = build(entity);
	if (!entityCode) return '';
	return uqFirstLine(entity) + '\n' + entityCode + '\n';
}

const aCode = 'a'.charCodeAt(0);
const zCode = 'z'.charCodeAt(0);
function firstCharUppercase(s:string) {
	let c = s.charCodeAt(0);
	if (c >= aCode && c <= zCode) {
		return String.fromCharCode(c - 0x20) + s.substr(1);
	}
	return s;
}

function buildUQ(uq:UqMan) {
	let {uqOwner, uqName} = uq;
	let ts:string = `\ninterface Uq${firstCharUppercase(uqOwner) + firstCharUppercase(uqName)} {`;
	uq.tuidArr.forEach(v => ts += uqBlock<Tuid>(v, buildTuid));
    uq.actionArr.forEach(v => ts += uqBlock<Action>(v, buildAction));
    uq.sheetArr.forEach(v => ts += uqBlock<Sheet>(v, buildSheet));
    uq.queryArr.forEach(v => ts += uqBlock<Query>(v, buildQuery));
    uq.bookArr.forEach(v => ts += uqBlock<Book>(v, buildBook));
    uq.mapArr.forEach(v => ts += uqBlock<Map>(v, buildMap));
    uq.historyArr.forEach(v => ts += uqBlock<History>(v, buildHistory));
    uq.pendingArr.forEach(v => ts += uqBlock<Pending>(v, buildPending));
	uq.tagArr.forEach(v => ts += uqBlock<Tag>(v, buildTag));
	ts += '}';
	return ts;
}

function uqFirstLine(entity: Entity) {
	return ''; // `// ${entity.typeName.toUpperCase()} ${entity.sName}`;
}

function buildTuid(tuid: Tuid) {
	let ts = `\t${tuid.sName}: Tuid;`;
	return ts;
}

function buildAction(action: Action) {
	let ts = `\t${action.sName}: Action;`;
	return ts;
}

function buildQuery(query: Query) {
	let ts = `\t${query.sName}: Query;`;
	return ts;
}

function buildSheet(sheet: Sheet) {
	let ts = `\t${sheet.sName}: Sheet;`;
	return ts;
}

function buildBook(book: Book):string {
	return;
}

function buildMap(map: Map):string {
	return;
}

function buildHistory(history: History):string {
	return;
}

function buildPending(pending: Pending):string {
	return;
}

function buildTag(tag: Tag):string {
	return;
}
