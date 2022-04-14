
// import TwnsCommonWarAdvancedSettingsPage    from "../../common/view/CommonWarAdvancedSettingsPage";
// import TwnsCommonWarBasicSettingsPage       from "../../common/view/CommonWarBasicSettingsPage";
// import TwnsCommonWarPlayerInfoPage          from "../../common/view/CommonWarPlayerInfoPage";
// import McrProxy                             from "../../multiCustomRoom/model/McrProxy";
// import CommonConstants                      from "../../tools/helpers/CommonConstants";
// import Helpers                              from "../../tools/helpers/Helpers";
// import Types                                from "../../tools/helpers/Types";
// import Notify                               from "../../tools/notify/Notify";
// import TwnsNotifyType                       from "../../tools/notify/NotifyType";
// import ProtoTypes                           from "../../tools/proto/ProtoTypes";
// import WarRuleHelpers                       from "../../tools/warHelpers/WarRuleHelpers";
// import UserModel                            from "../../user/model/UserModel";
// import WarMapModel                          from "../../warMap/model/WarMapModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MultiCustomRoom.McrModel {
    import IMcrRoomStaticInfo                       = CommonProto.MultiCustomRoom.IMcrRoomStaticInfo;
    import IMcrRoomPlayerInfo                       = CommonProto.MultiCustomRoom.IMcrRoomPlayerInfo;
    import WarBasicSettingsType                     = Types.WarBasicSettingsType;
    import McrRoomFilter                            = Types.McrRoomFilter;
    import ConfigManager                            = Config.ConfigManager;
    import OpenDataForCommonWarBasicSettingsPage    = TwnsCommonWarBasicSettingsPage.OpenDataForCommonWarBasicSettingsPage;
    import OpenDataForCommonWarAdvancedSettingsPage = TwnsCommonWarAdvancedSettingsPage.OpenDataForCommonWarAdvancedSettingsPage;
    import OpenDataForCommonWarPlayerInfoPage       = TwnsCommonWarPlayerInfoPage.OpenDataForCommonWarPlayerInfoPage;

    const _roomStaticInfoAccessor = Helpers.createCachedDataAccessor<number, IMcrRoomStaticInfo>({
        reqData : (roomId: number) => McrProxy.reqMcrGetRoomStaticInfo(roomId),
    });
    const _roomPlayerInfoAccessor = Helpers.createCachedDataAccessor<number, IMcrRoomStaticInfo>({
        // dataExpireTime  : 30,
        reqData         : (roomId: number) => McrProxy.reqMcrGetRoomPlayerInfo(roomId),
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for rooms.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function getRoomStaticInfo(roomId: number): Promise<IMcrRoomStaticInfo | null> {
        return _roomStaticInfoAccessor.getData(roomId);
    }
    export function setRoomStaticInfo(roomId: number, info: IMcrRoomStaticInfo | null): void {
        _roomStaticInfoAccessor.setData(roomId, info);
    }

    export function getRoomPlayerInfo(roomId: number): Promise<IMcrRoomPlayerInfo | null> {
        return _roomPlayerInfoAccessor.getData(roomId);
    }
    export function setRoomPlayerInfo(roomId: number, info: IMcrRoomPlayerInfo | null): void {
        _roomPlayerInfoAccessor.setData(roomId, info);
    }

    export async function getUnjoinedRoomIdSet(roomFilter: McrRoomFilter | null): Promise<Set<number>> {
        const unjoinedRoomIdArray   : number[] = [];
        const selfUserId            = UserModel.getSelfUserId();
        if (selfUserId == null) {
            return new Set();
        }

        const allRoomIdArray        = _roomPlayerInfoAccessor.getRequestedKeyArray();
        const roomPlayerInfoArray   = Helpers.getNonNullElements(await Promise.all(allRoomIdArray.map(v => getRoomPlayerInfo(v))));
        for (const roomPlayerInfo of roomPlayerInfoArray) {
            const playerDataList = roomPlayerInfo.playerDataList ?? [];
            if ((playerDataList.length < Helpers.getExisted(roomPlayerInfo.playersCountUnneutral))  &&
                (playerDataList.every(v => v.userId !== selfUserId))
            ) {
                unjoinedRoomIdArray.push(Helpers.getExisted(roomPlayerInfo.roomId));
            }
        }

        return (roomFilter == null)
            ? new Set(unjoinedRoomIdArray)
            : getFilteredRoomIdSet(unjoinedRoomIdArray, roomFilter);
    }
    export async function getJoinedRoomIdSet(roomFilter: McrRoomFilter | null): Promise<Set<number>> {
        const joinedRoomIdArray : number[] = [];
        const selfUserId        = UserModel.getSelfUserId();
        if (selfUserId == null) {
            return new Set();
        }

        const allRoomIdArray        = _roomPlayerInfoAccessor.getRequestedKeyArray();
        const roomPlayerInfoArray   = Helpers.getNonNullElements(await Promise.all(allRoomIdArray.map(v => getRoomPlayerInfo(v))));
        for (const roomPlayerInfo of roomPlayerInfoArray) {
            if (roomPlayerInfo.playerDataList?.some(v => v.userId === selfUserId)) {
                joinedRoomIdArray.push(Helpers.getExisted(roomPlayerInfo.roomId));
            }
        }

        return (roomFilter == null)
            ? new Set(joinedRoomIdArray)
            : getFilteredRoomIdSet(joinedRoomIdArray, roomFilter);
    }
    async function getFilteredRoomIdSet(roomIdArray: number[], filter: McrRoomFilter): Promise<Set<number>> {
        const [roomStaticInfoArray, roomPlayerInfoArray] = await Promise.all([
            await Promise.all(roomIdArray.map(v => getRoomStaticInfo(v))),
            await Promise.all(roomIdArray.map(v => getRoomPlayerInfo(v))),
        ]);
        const filteredRoomIdSet = new Set<number>();
        for (let i = 0; i < roomIdArray.length; ++i) {
            const roomId = roomIdArray[i];
            if (await checkIsMeetFilter({
                roomId,
                roomStaticInfo  : roomStaticInfoArray[i],
                roomPlayerInfo  : roomPlayerInfoArray[i],
                filter,
            })) {
                filteredRoomIdSet.add(roomId);
            }
        }

        return filteredRoomIdSet;
    }

    export async function checkIsRed(): Promise<boolean> {
        for (const roomId of await getJoinedRoomIdSet(null)) {
            if (await checkIsRedForRoom(roomId)) {
                return true;
            }
        }
        return false;
    }
    export async function checkIsRedForRoom(roomId: number): Promise<boolean> {
        const [roomStaticInfo, roomPlayerInfo] = await Promise.all([
            getRoomStaticInfo(roomId),
            getRoomPlayerInfo(roomId),
        ]);
        if ((roomStaticInfo == null) || (roomPlayerInfo == null)) {
            return false;
        }

        const selfUserId        = UserModel.getSelfUserId();
        const playerDataList    = roomPlayerInfo.playerDataList || [];
        const selfPlayerData    = playerDataList.find(v => v.userId === selfUserId);
        if ((selfPlayerData) && (!selfPlayerData.isReady)) {
            return true;
        }

        if ((playerDataList.length === WarRuleHelpers.getPlayersCountUnneutral(Helpers.getExisted(roomStaticInfo.settingsForCommon?.warRule)))  &&
            (playerDataList.every(v => (v.isReady) && (v.userId != null)))                                                                      &&
            (selfPlayerData)                                                                                                                    &&
            (roomPlayerInfo.ownerPlayerIndex === selfPlayerData.playerIndex)
        ) {
            return true;
        }

        return false;
    }
    export async function checkCanStartGame(roomId: number): Promise<boolean> {
        const [roomStaticInfo, roomPlayerInfo] = await Promise.all([
            getRoomStaticInfo(roomId),
            getRoomPlayerInfo(roomId),
        ]);
        if ((roomStaticInfo == null) || (roomPlayerInfo == null)) {
            return false;
        }

        const selfUserId        = UserModel.getSelfUserId();
        const playerDataList    = roomPlayerInfo.playerDataList || [];
        const selfPlayerData    = playerDataList.find(v => v.userId === selfUserId);
        return (selfPlayerData != null)
            && (selfPlayerData.playerIndex === roomPlayerInfo.ownerPlayerIndex)
            && (playerDataList.length == WarRuleHelpers.getPlayersCountUnneutral(Helpers.getExisted(roomStaticInfo.settingsForCommon?.warRule)))
            && (playerDataList.every(v => (v.isReady) && (v.userId != null)));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function createDataForCommonWarPlayerInfoPage(roomId: number | null): Promise<OpenDataForCommonWarPlayerInfoPage> {
        if (roomId == null) {
            return null;
        }

        const [roomStaticInfo, roomPlayerInfo] = await Promise.all([
            getRoomStaticInfo(roomId),
            getRoomPlayerInfo(roomId),
        ]);
        if ((roomStaticInfo == null) || (roomPlayerInfo == null)) {
            return null;
        }

        const settingsForCommon     = Helpers.getExisted(roomStaticInfo.settingsForCommon);
        const warRule               = Helpers.getExisted(settingsForCommon.warRule);
        const playersCountUnneutral = Helpers.getExisted(WarRuleHelpers.getPlayersCountUnneutral(warRule));
        const playerDataList        = roomPlayerInfo.playerDataList || [];
        const playerInfoArray       : TwnsCommonWarPlayerInfoPage.PlayerInfo[] = [];
        for (let playerIndex = CommonConstants.WarFirstPlayerIndex; playerIndex <= playersCountUnneutral; ++playerIndex) {
            const playerData = playerDataList.find(v => v.playerIndex === playerIndex);
            playerInfoArray.push({
                playerIndex,
                teamIndex           : WarRuleHelpers.getTeamIndex(warRule, playerIndex),
                isAi                : false,
                userId              : playerData?.userId ?? null,
                coId                : playerData?.coId ?? null,
                unitAndTileSkinId   : playerData?.unitAndTileSkinId ?? null,
                isReady             : playerData?.isReady ?? null,
                isInTurn            : null,
                isDefeat            : null,
                restTimeToBoot      : null,
            });
        }

        return {
            gameConfig              : await Config.ConfigManager.getGameConfig(Helpers.getExisted(settingsForCommon.configVersion)),
            playersCountUnneutral,
            roomOwnerPlayerIndex    : Helpers.getExisted(roomPlayerInfo.ownerPlayerIndex),
            callbackOnExitRoom      : () => {
                if ((roomPlayerInfo.playerDataList?.filter(v => v.userId != null).length ?? 0) > 1) {
                    McrProxy.reqMcrExitRoom(roomId);
                } else {
                    McrProxy.reqMcrDeleteRoom(roomId);
                }
            },
            callbackOnDeletePlayer  : (playerIndex) => McrProxy.reqMcrDeletePlayer(roomId, playerIndex),
            playerInfoArray,
            enterTurnTime           : null,
        };
    }

    export async function createDataForCommonWarBasicSettingsPage(roomId: number | null, showPassword: boolean): Promise<OpenDataForCommonWarBasicSettingsPage> {
        if (roomId == null) {
            return null;
        }

        const roomInfo = await getRoomStaticInfo(roomId);
        if (roomInfo == null) {
            return { dataArrayForListSettings: [] };
        }

        const settingsForCommon = Helpers.getExisted(roomInfo.settingsForCommon);
        const warRule           = Helpers.getExisted(settingsForCommon.warRule);
        const settingsForMcw    = Helpers.getExisted(roomInfo.settingsForMcw);
        const bootTimerParams   = Helpers.getExisted(settingsForMcw.bootTimerParams);
        const warPassword       = settingsForMcw.warPassword;
        const timerType         = bootTimerParams[0] as Types.BootTimerType;
        const openData          : OpenDataForCommonWarBasicSettingsPage = {
            dataArrayForListSettings    : [
                {
                    settingsType    : WarBasicSettingsType.MapName,
                    currentValue    : await WarMapModel.getMapNameInCurrentLanguage(Helpers.getExisted(settingsForMcw.mapId)),
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarName,
                    currentValue    : settingsForMcw.warName ?? null,
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarPassword,
                    currentValue    : warPassword == null ? null : (showPassword ? warPassword : `****`),
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarComment,
                    currentValue    : settingsForMcw.warComment ?? null,
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarRuleTitle,
                    currentValue    : null,
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.HasFog,
                    currentValue    : null,
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.Weather,
                    currentValue    : null,
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.TurnsLimit,
                    currentValue    : settingsForCommon.turnsLimit ?? CommonConstants.WarMaxTurnsLimit,
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.TimerType,
                    currentValue    : timerType,
                    warRule,
                    callbackOnModify: null,
                },
            ],
        };
        if (timerType === Types.BootTimerType.Regular) {
            openData.dataArrayForListSettings.push({
                settingsType    : WarBasicSettingsType.TimerRegularParam,
                currentValue    : bootTimerParams[1],
                warRule,
                callbackOnModify: null,
            });
        } else if (timerType === Types.BootTimerType.Incremental) {
            openData.dataArrayForListSettings.push(
                {
                    settingsType    : WarBasicSettingsType.TimerIncrementalParam1,
                    currentValue    : bootTimerParams[1],
                    warRule,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.TimerIncrementalParam2,
                    currentValue    : bootTimerParams[2],
                    warRule,
                    callbackOnModify: null,
                },
            );
        } else {
            throw Helpers.newError(`McrModel.createDataForCommonWarBasicSettingsPage() invalid timerType.`);
        }

        return openData;
    }

    export async function createDataForCommonWarAdvancedSettingsPage(roomId: number | null): Promise<OpenDataForCommonWarAdvancedSettingsPage> {
        if (roomId == null) {
            return null;
        }

        const roomInfo = await getRoomStaticInfo(roomId);
        if (roomInfo == null) {
            return null;
        }

        const settingsForCommon = Helpers.getExisted(roomInfo.settingsForCommon);
        const warRule           = Helpers.getExisted(settingsForCommon.warRule);
        return {
            gameConfig  : await Config.ConfigManager.getGameConfig(Helpers.getExisted(settingsForCommon.configVersion)),
            warRule,
            warType     : warRule.ruleForGlobalParams?.hasFogByDefault ? Types.WarType.McwFog : Types.WarType.McwStd,
        };
    }

    async function checkIsMeetFilter({ roomId, roomPlayerInfo, roomStaticInfo, filter }: {
        roomId          : number;
        roomPlayerInfo  : IMcrRoomPlayerInfo | null;
        roomStaticInfo  : IMcrRoomStaticInfo | null;
        filter          : Types.Undefinable<McrRoomFilter>;
    }): Promise<boolean> {
        if (roomPlayerInfo == null) {
            return false;
        }

        if (filter == null) {
            return true;
        }

        {
            const filterRoomId = filter.roomId;
            if ((filterRoomId != null) && (roomId !== filterRoomId)) {
                return false;
            }
        }

        const warRule = roomStaticInfo?.settingsForCommon?.warRule;
        {
            const filterHasFog = filter.hasFog;
            if ((filterHasFog != null) && ((!!warRule?.ruleForGlobalParams?.hasFogByDefault) !== filterHasFog)) {
                return false;
            }
        }

        const playerDataList = roomPlayerInfo.playerDataList ?? [];
        {
            const filterUserIdInRoom = filter.userIdInRoom;
            if ((filterUserIdInRoom != null) && (!playerDataList.some(v => v.userId === filterUserIdInRoom))) {
                return false;
            }
        }

        {
            const filterUserIdNotInRoom = filter.userIdNotInRoom;
            if ((filterUserIdNotInRoom != null) && (playerDataList.some(v => v.userId === filterUserIdNotInRoom))) {
                return false;
            }
        }

        {
            const filterCoName = filter.coName?.trim();
            if (filterCoName) {
                const configVersion = roomStaticInfo?.settingsForCommon?.configVersion;
                if (configVersion == null) {
                    return false;
                }

                const gameConfig = await ConfigManager.getGameConfig(configVersion);
                if (gameConfig == null) {
                    return false;
                }

                const lowerCaseName = filterCoName.toLowerCase();
                if (!playerDataList.some(v => {
                    const coId = v.coId;
                    const name = coId == null ? null : gameConfig.getCoBasicCfg(coId)?.name;
                    return (name != null) && (name.toLowerCase().includes(lowerCaseName));
                })) {
                    return false;
                }
            }
        }

        {
            const filterMapName = filter.mapName?.trim();
            if (filterMapName) {
                const mapId = roomStaticInfo?.settingsForMcw?.mapId;
                if (mapId == null) {
                    return false;
                }

                const mapRawData    = await WarMapModel.getRawData(mapId);
                const lowerCaseName = filterMapName.toLowerCase();
                if (!(mapRawData?.mapNameArray || []).some(v => {
                    const name = v.text;
                    return (!!name) && (name.toLowerCase().includes(lowerCaseName));
                })) {
                    return false;
                }
            }
        }

        {
            const filterUserNickname = filter.userNickname?.trim();
            if (filterUserNickname) {
                const lowerCaseName = filterUserNickname.toLowerCase();
                let hasPlayer       = false;
                for (const playerInfo of playerDataList) {
                    const userId    = playerInfo.userId;
                    const nickname  = (userId == null ? null : await UserModel.getUserBriefInfo(userId))?.nickname;
                    if ((nickname != null) && (nickname.toLowerCase().includes(lowerCaseName))) {
                        hasPlayer = true;
                        break;
                    }
                }
                if (!hasPlayer) {
                    return false;
                }
            }
        }

        return true;
    }
}

// export default McrModel;
