
namespace TinyWars.Network {
export enum Codes {
C_Heartbeat = 1,
S_Heartbeat = 2,
C_Register = 3,
S_Register = 4,
C_Login = 5,
S_Login = 6,
C_Logout = 7,
S_Logout = 8,
S_Error = 10,
C_GetNewestMapDynamicInfos = 11,
S_GetNewestMapDynamicInfos = 12,
S_NewestConfigVersion = 14,
C_GetMapDynamicInfo = 15,
S_GetMapDynamicInfo = 16,
S_ServerDisconnect = 18,
C_McrCreateWar = 101,
S_McrCreateWar = 102,
C_McrExitWar = 103,
S_McrExitWar = 104,
C_McrGetJoinedWaitingInfos = 105,
S_McrGetJoinedWaitingInfos = 106,
C_McrGetUnjoinedWaitingInfos = 107,
S_McrGetUnjoinedWaitingInfos = 108,
C_McrJoinWar = 109,
S_McrJoinWar = 110,
C_McrGetJoinedOngoingInfos = 111,
S_McrGetJoinedOngoingInfos = 112,
C_McrContinueWar = 113,
S_McrContinueWar = 114,
C_McwPlayerBeginTurn = 151,
S_McwPlayerBeginTurn = 152,
C_McwPlayerEndTurn = 153,
S_McwPlayerEndTurn = 154,
C_McwPlayerSurrender = 155,
S_McwPlayerSurrender = 156,
C_McwUnitWait = 181,
S_McwUnitWait = 182,
C_McwUnitBeLoaded = 183,
S_McwUnitBeLoaded = 184,
}}
