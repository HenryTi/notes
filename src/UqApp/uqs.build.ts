import { Tuid, Query, Action/*, Map, Sheet, Tag*/ } from "../tonva";

//===============================
//======= UQ bruce/notes ========
//===============================

interface UqBruceNotes {
	Note: Tuid;

	BookProject: Tuid;

	BookUserProject: Tuid;

	BookReport: Tuid;

	Subject: Tuid;

	AddComment: Action;

	AddContact: Action;

	AddGroup: Action;

	AddGroupMember: Action;

	AddNote: Action;

	AddUnitMember: Action;

	AssignTask: Action;

	ChangeRootUnitProp: Action;

	CheckTask: Action;

	CreateRootUnit: Action;

	CreateUnit: Action;

	DoneTask: Action;

	GetNoteToAndSpawnCount: Action;

	HideNote: Action;

	InitMySetting: Action;

	RateTask: Action;

	RemoveGroupMember: Action;

	SendNoteTo: Action;

	SetContactAssinged: Action;

	SetGroup: Action;

	SetGroupProp: Action;

	SetNote: Action;

	SetNoteX: Action;

	SetUnitMemberProp: Action;

	SetUnitMemberRole: Action;

	SetUnitName: Action;

	SetUnitProjects: Action;

	GetAssignToContacts: Query;

	GetBookUserProjects: Query;

	GetGroupContacts: Query;

	GetGroupFolderMemberCount: Query;

	GetGroupMembers: Query;

	GetMyContacts: Query;

	GetMySum: Query;

	GetNote: Query;

	GetNoteItemFromId: Query;

	GetNotes: Query;

	GetProjectDaySum: Query;

	GetProjectFlow: Query;

	GetProjectMonthSum: Query;

	GetProjectYearSum: Query;

	GetRootUnitProjects: Query;

	GetRootUnitReports: Query;

	GetRootUnits: Query;

	GetShareContacts: Query;

	GetSpawnContacts: Query;

	GetSubjectUser: Query;

	GetSystemRole: Query;

	GetUnit: Query;

	GetUnitProjects: Query;

	GetUnitSum: Query;
}


