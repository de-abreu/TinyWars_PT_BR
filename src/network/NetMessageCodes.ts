
namespace TinyWars.Network {
export enum Codes {
MsgCommonHeartbeat = 0,
MsgCommonError = 1,
MsgCommonServerDisconnect = 2,
MsgCommonLatestConfigVersion = 3,
MsgCommonGetServerStatus = 4,
MsgCommonGetRankList = 5,
MsgUserRegister = 20,
MsgUserLogin = 21,
MsgUserLogout = 22,
MsgUserGetPublicInfo = 23,
MsgUserGetOnlineUsers = 24,
MsgUserSetNickname = 25,
MsgUserSetDiscordId = 26,
MsgUserSetPrivilege = 27,
MsgUserSetPassword = 28,
MsgUserSetSettings = 29,
MsgMapGetEnabledBriefDataList = 40,
MsgMapGetEnabledRawDataList = 41,
MsgMapGetBriefData = 42,
MsgMapGetRawData = 43,
MsgMeGetMapDataList = 60,
MsgMeGetMapData = 61,
MsgMeSubmitMap = 62,
MsgMeSubmitWarRule = 63,
MsgMeGetSubmittedWarRuleList = 64,
MsgChatAddMessage = 80,
MsgChatGetAllMessages = 81,
MsgChatUpdateReadProgress = 82,
MsgChatGetAllReadProgressList = 83,
MsgMmSetMapAvailability = 100,
MsgMmSetMapEnabled = 101,
MsgMmGetReviewingMaps = 102,
MsgMmReviewMap = 103,
MsgMmGetReviewingWarRuleList = 104,
MsgMmReviewWarRule = 105,
MsgMmSetMapTag = 106,
MsgReplaySetRating = 120,
MsgReplayGetInfoList = 121,
MsgReplayGetData = 122,
MsgMcrCreateRoom = 140,
MsgMcrExitRoom = 141,
MsgMcrJoinRoom = 142,
MsgMcrDeleteRoomByPlayer = 143,
MsgMcrDeleteRoomByServer = 144,
MsgMcrSetReady = 145,
MsgMcrDeletePlayer = 146,
MsgMcrSetSelfSettings = 147,
MsgMcrSetWarRule = 148,
MsgMcrGetOwnerPlayerIndex = 149,
MsgMcrStartWar = 150,
MsgMcrGetJoinedRoomInfoList = 151,
MsgMcrGetRoomInfo = 152,
MsgMcrGetJoinableRoomInfoList = 153,
MsgMpwCommonGetMyWarInfoList = 160,
MsgMpwCommonContinueWar = 161,
MsgMpwCommonSyncWar = 162,
MsgMpwCommonHandleBoot = 163,
MsgMpwCommonBroadcastGameStart = 164,
MsgMpwWatchMakeRequest = 180,
MsgMpwWatchHandleRequest = 181,
MsgMpwWatchDeleteWatcher = 182,
MsgMpwWatchGetUnwatchedWarInfos = 183,
MsgMpwWatchGetOngoingWarInfos = 184,
MsgMpwWatchGetRequestedWarInfos = 185,
MsgMpwWatchGetWatchedWarInfos = 186,
MsgMpwWatchContinueWar = 187,
MsgMpwActionSystemBeginTurn = 200,
MsgMpwActionSystemCallWarEvent = 201,
MsgMpwActionSystemDestroyPlayerForce = 202,
MsgMpwActionSystemEndWar = 203,
MsgMpwActionPlayerEndTurn = 211,
MsgMpwActionPlayerSurrender = 212,
MsgMpwActionPlayerProduceUnit = 213,
MsgMpwActionPlayerDeleteUnit = 214,
MsgMpwActionPlayerVoteForDraw = 215,
MsgMpwActionUnitWait = 220,
MsgMpwActionUnitBeLoaded = 221,
MsgMpwActionUnitCaptureTile = 222,
MsgMpwActionUnitAttackTile = 223,
MsgMpwActionUnitAttackUnit = 224,
MsgMpwActionUnitDropUnit = 225,
MsgMpwActionUnitBuildTile = 226,
MsgMpwActionUnitDive = 227,
MsgMpwActionUnitSurface = 228,
MsgMpwActionUnitJoinUnit = 229,
MsgMpwActionUnitLaunchFlare = 230,
MsgMpwActionUnitLaunchSilo = 231,
MsgMpwActionUnitProduceUnit = 232,
MsgMpwActionUnitSupplyUnit = 233,
MsgMpwActionUnitLoadCo = 234,
MsgMpwActionUnitUseCoSkill = 235,
MsgSpmCreateScw = 240,
MsgSpmCreateSfw = 241,
MsgSpmCreateSrw = 242,
MsgSpmGetWarSaveSlotFullDataArray = 243,
MsgSpmDeleteWarSaveSlot = 244,
MsgSpmSaveScw = 245,
MsgSpmSaveSfw = 246,
MsgSpmSaveSrw = 247,
MsgSpmValidateSrw = 248,
MsgSpmGetSrwRankInfo = 249,
MsgMrrSetMaxConcurrentCount = 260,
MsgMrrGetMaxConcurrentCount = 261,
MsgMrrGetMyRoomPublicInfoList = 262,
MsgMrrGetRoomPublicInfo = 263,
MsgMrrDeleteRoomByServer = 264,
MsgMrrSetBannedCoIdList = 265,
MsgMrrSetSelfSettings = 266,
MsgBroadcastGetMessageList = 280,
MsgBroadcastAddMessage = 281,
MsgBroadcastDeleteMessage = 282,
MsgBroadcastDoBroadcast = 283,
MsgChangeLogGetMessageList = 300,
MsgChangeLogAddMessage = 301,
MsgChangeLogModifyMessage = 302,
MsgMfrCreateRoom = 320,
MsgMfrExitRoom = 321,
MsgMfrJoinRoom = 322,
MsgMfrDeleteRoomByPlayer = 323,
MsgMfrDeleteRoomByServer = 324,
MsgMfrSetReady = 325,
MsgMfrDeletePlayer = 326,
MsgMfrSetSelfSettings = 327,
MsgMfrStartWar = 328,
MsgMfrGetOwnerPlayerIndex = 329,
MsgMfrGetJoinedRoomInfoList = 330,
MsgMfrGetRoomInfo = 331,
MsgMfrGetJoinableRoomInfoList = 332,
}}
