
namespace TwnsNetMessageCodes {
// eslint-disable-next-line no-shadow
export enum NetMessageCodes {
MsgCommonHeartbeat = 1,
MsgCommonError = 2,
MsgCommonServerDisconnect = 3,
MsgCommonLatestConfigVersion = 4,
MsgCommonGetServerStatus = 5,
MsgCommonGetRankList = 6,
MsgUserRegister = 20,
MsgUserLogin = 21,
MsgUserLogout = 22,
MsgUserGetPublicInfo = 23,
MsgUserGetBriefInfo = 24,
MsgUserGetOnlineState = 25,
MsgUserGetOnlineUserIdArray = 26,
MsgUserSetNickname = 27,
MsgUserSetDiscordId = 28,
MsgUserSetPrivilege = 29,
MsgUserSetPassword = 30,
MsgUserSetSettings = 31,
MsgUserSetMapRating = 32,
MsgUserSetAvatarId = 33,
MsgUserSetMapEditorAutoSaveTime = 34,
MsgMapGetEnabledMapIdArray = 40,
MsgMapGetBriefData = 41,
MsgMapGetRawData = 42,
MsgMeGetMapDataList = 60,
MsgMeGetMapData = 61,
MsgMeSubmitMap = 62,
MsgChatAddMessage = 80,
MsgChatGetAllMessages = 81,
MsgChatUpdateReadProgress = 82,
MsgChatGetAllReadProgressList = 83,
MsgChatDeleteMessage = 84,
MsgMmSetWarRuleAvailability = 100,
MsgMmSetMapEnabled = 101,
MsgMmGetReviewingMaps = 102,
MsgMmReviewMap = 103,
MsgMmSetMapTag = 104,
MsgMmSetMapName = 105,
MsgMmAddWarRule = 106,
MsgMmDeleteWarRule = 107,
MsgReplaySetSelfRating = 120,
MsgReplayGetSelfRating = 121,
MsgReplayGetReplayIdArray = 122,
MsgReplayGetData = 123,
MsgReplayGetReplayInfo = 124,
MsgMcrCreateRoom = 140,
MsgMcrExitRoom = 141,
MsgMcrJoinRoom = 142,
MsgMcrDeleteRoom = 143,
MsgMcrSetReady = 144,
MsgMcrDeletePlayer = 145,
MsgMcrSetSelfSettings = 146,
MsgMcrStartWar = 147,
MsgMcrGetJoinedRoomIdArray = 148,
MsgMcrGetJoinableRoomIdArray = 149,
MsgMcrGetRoomStaticInfo = 150,
MsgMcrGetRoomPlayerInfo = 151,
MsgMpwCommonGetMyWarIdArray = 160,
MsgMpwCommonContinueWar = 161,
MsgMpwCommonSyncWar = 162,
MsgMpwCommonHandleBoot = 163,
MsgMpwCommonBroadcastGameStart = 164,
MsgMpwCommonGetWarSettings = 165,
MsgMpwCommonGetWarProgressInfo = 166,
MsgMpwWatchMakeRequest = 180,
MsgMpwWatchHandleRequest = 181,
MsgMpwWatchDeleteWatcher = 182,
MsgMpwWatchGetRequestableWarIdArray = 183,
MsgMpwWatchGetOngoingWarIdArray = 184,
MsgMpwWatchGetRequestedWarIdArray = 185,
MsgMpwWatchGetWatchedWarIdArray = 186,
MsgMpwWatchContinueWar = 187,
MsgMpwWatchGetIncomingInfo = 188,
MsgMpwWatchGetOutgoingInfo = 189,
MsgMpwExecuteWarAction = 200,
MsgMpwGetHalfwayReplayData = 201,
MsgSpmCreateScw = 240,
MsgSpmCreateSfw = 241,
MsgSpmCreateSrw = 242,
MsgSpmGetWarSaveSlotFullDataArray = 243,
MsgSpmDeleteWarSaveSlot = 244,
MsgSpmSaveScw = 245,
MsgSpmSaveSfw = 246,
MsgSpmSaveSrw = 247,
MsgSpmValidateSrw = 248,
MsgSpmGetRankList = 249,
MsgSpmGetReplayData = 250,
MsgSpmDeleteAllScoreAndReplay = 251,
MsgMrrSetMaxConcurrentCount = 260,
MsgMrrGetMaxConcurrentCount = 261,
MsgMrrGetJoinedRoomIdArray = 262,
MsgMrrGetRoomPublicInfo = 263,
MsgMrrDeleteRoomByServer = 264,
MsgMrrSetBannedCoIdList = 265,
MsgMrrSetSelfSettings = 266,
MsgBroadcastGetAllMessageIdArray = 280,
MsgBroadcastAddMessage = 281,
MsgBroadcastDeleteMessage = 282,
MsgBroadcastDoBroadcast = 283,
MsgBroadcastGetMessageData = 284,
MsgChangeLogGetMessageList = 300,
MsgChangeLogAddMessage = 301,
MsgChangeLogModifyMessage = 302,
MsgMfrCreateRoom = 320,
MsgMfrExitRoom = 321,
MsgMfrJoinRoom = 322,
MsgMfrDeleteRoom = 323,
MsgMfrSetReady = 324,
MsgMfrDeletePlayer = 325,
MsgMfrSetSelfSettings = 326,
MsgMfrStartWar = 327,
MsgMfrGetJoinedRoomIdArray = 328,
MsgMfrGetJoinableRoomIdArray = 329,
MsgMfrGetRoomStaticInfo = 330,
MsgMfrGetRoomPlayerInfo = 331,
MsgCcrCreateRoom = 340,
MsgCcrExitRoom = 341,
MsgCcrJoinRoom = 342,
MsgCcrDeleteRoom = 343,
MsgCcrSetReady = 344,
MsgCcrDeletePlayer = 345,
MsgCcrSetSelfSettings = 346,
MsgCcrStartWar = 347,
MsgCcrGetJoinedRoomIdArray = 348,
MsgCcrGetJoinableRoomIdArray = 349,
MsgCcrGetRoomStaticInfo = 350,
MsgCcrGetRoomPlayerInfo = 351,
MsgLbSpmOverallGetTopDataArray = 360,
MsgLbSpmOverallGetRankIndex = 361,
}}
