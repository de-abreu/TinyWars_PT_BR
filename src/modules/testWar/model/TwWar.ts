
namespace TinyWars.TestWar {
    import Logger                   = Utility.Logger;
    import ProtoTypes               = Utility.ProtoTypes;
    import ClientErrorCode          = Utility.ClientErrorCode;
    import Types                    = Utility.Types;
    import ConfigManager            = Utility.ConfigManager;
    import CommonConstants          = Utility.CommonConstants;
    import TimeModel                = Time.TimeModel;
    import BwWarRuleHelper          = BaseWar.BwWarRuleHelper;
    import WarEventHelper           = WarEvent.WarEventHelper;
    import WarSerialization         = ProtoTypes.WarSerialization;
    import ISerialWar               = WarSerialization.ISerialWar;
    import IMapRawData              = ProtoTypes.Map.IMapRawData;
    import WarAction                = ProtoTypes.WarAction;

    export class TwWar extends BaseWar.BwWar {
        private readonly _playerManager         = new TwPlayerManager();
        private readonly _turnManager           = new TwTurnManager();
        private readonly _field                 = new TwField();
        private readonly _commonSettingManager  = new BaseWar.BwCommonSettingManager();
        private readonly _warEventManager       = new BaseWar.BwWarEventManager();

        public getCanCheat(): boolean {
            return false;
        }
        public getPlayerManager(): TwPlayerManager {
            return this._playerManager;
        }
        public getTurnManager(): TwTurnManager {
            return this._turnManager;
        }
        public getField(): TwField {
            return this._field;
        }
        public getCommonSettingManager(): BaseWar.BwCommonSettingManager {
            return this._commonSettingManager;
        }
        public getWarEventManager(): BaseWar.BwWarEventManager {
            return this._warEventManager;
        }

        public updateTilesAndUnitsOnVisibilityChanged(): void {
            // nothing to do.
        }

        public async getDescForExePlayerDeleteUnit(action: WarAction.IWarActionPlayerDeleteUnit): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExePlayerEndTurn(action: WarAction.IWarActionPlayerEndTurn): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExePlayerProduceUnit(action: WarAction.IWarActionPlayerProduceUnit): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExePlayerSurrender(action: WarAction.IWarActionPlayerSurrender): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExePlayerVoteForDraw(action: WarAction.IWarActionPlayerVoteForDraw): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeSystemBeginTurn(action: WarAction.IWarActionSystemBeginTurn): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeSystemCallWarEvent(action: WarAction.IWarActionSystemCallWarEvent): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeSystemDestroyPlayerForce(action: WarAction.IWarActionSystemDestroyPlayerForce): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeSystemEndWar(action: WarAction.IWarActionSystemEndWar): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitAttackTile(action: WarAction.IWarActionUnitAttackTile): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitAttackUnit(action: WarAction.IWarActionUnitAttackUnit): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitBeLoaded(action: WarAction.IWarActionUnitBeLoaded): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitBuildTile(action: WarAction.IWarActionUnitBuildTile): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitCaptureTile(action: WarAction.IWarActionUnitCaptureTile): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitDive(action: WarAction.IWarActionUnitDive): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitDropUnit(action: WarAction.IWarActionUnitDropUnit): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitJoinUnit(action: WarAction.IWarActionUnitJoinUnit): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitLaunchFlare(action: WarAction.IWarActionUnitLaunchFlare): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitLaunchSilo(action: WarAction.IWarActionUnitLaunchSilo): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitLoadCo(action: WarAction.IWarActionUnitLoadCo): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitProduceUnit(action: WarAction.IWarActionUnitProduceUnit): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitSupplyUnit(action: WarAction.IWarActionUnitSupplyUnit): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitSurface(action: WarAction.IWarActionUnitSurface): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitUseCoSkill(action: WarAction.IWarActionUnitUseCoSkill): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitWait(action: WarAction.IWarActionUnitWait): Promise<string | undefined> {
            return undefined;
        }

        public async init(data: ISerialWar): Promise<ClientErrorCode> {
            const baseInitError = await this._baseInit(data);
            if (baseInitError) {
                return baseInitError;
            }

            return ClientErrorCode.NoError;
        }
        public async initByMapRawData(mapRawData: IMapRawData): Promise<ClientErrorCode> {
            const warData = await _createDataForCreateTwWar(mapRawData);
            if (warData == null) {
                return ClientErrorCode.TwWarInitByMapRawData00;
            }

            return await this.init(warData);
        }

        public getWarType(): Types.WarType {
            return Types.WarType.Test;
        }

        public getMapId(): number | null | undefined {
            return undefined;
        }

        public getIsNeedReplay(): boolean {
            return false;
        }

        public getIsWarMenuPanelOpening(): boolean {
            return false;
        }
    }

    async function _createDataForCreateTwWar(mapRawData: IMapRawData): Promise<ISerialWar | undefined> {
        const dataForPlayerManager = await _createInitialPlayerManagerDataForTw(mapRawData);
        if (!dataForPlayerManager) {
            Logger.error(`TwWar._createDataForCreateTwWar() failed _createInitialPlayerManagerDataForTw().`);
            return undefined;
        }

        const fieldData = await _createInitialFieldData(mapRawData);
        if (fieldData == null) {
            Logger.error(`TwWar._createDataForCreateTwWar() empty fieldData.`);
            return undefined;
        }

        const warRule = (mapRawData.warRuleArray || [])[0];
        if (warRule == null) {
            Logger.error(`TwWar._createDataForCreateTwWar() empty warRule.`);
            return undefined;
        }

        const seedRandomState = new Math.seedrandom("" + Math.random(), { state: true }).state();
        return {
            settingsForCommon       : {
                configVersion       : ConfigManager.getLatestFormalVersion(),
                warRule,
                presetWarRuleId     : warRule.ruleId,
            },

            warId                   : -1,
            executedActions         : [],
            remainingVotesForDraw   : undefined,
            playerManager           : dataForPlayerManager,
            turnManager             : _createInitialTurnData(),
            field                   : fieldData,
            seedRandomInitialState  : seedRandomState,
            seedRandomCurrentState  : seedRandomState,
            warEventManager         : {
                warEventFullData    : WarEventHelper.trimWarEventFullData(mapRawData.warEventFullData, warRule.warEventIdArray),
                calledCountList     : [],
            },
        };
    }

    function _createInitialTurnData(): WarSerialization.ISerialTurnManager {
        return {
            turnIndex       : CommonConstants.WarFirstTurnIndex,
            playerIndex     : 0,
            turnPhaseCode   : Types.TurnPhaseCode.WaitBeginTurn,
            enterTurnTime   : TimeModel.getServerTimestamp(),
        };
    }

    async function _createInitialPlayerManagerDataForTw(mapRawData: IMapRawData): Promise<WarSerialization.ISerialPlayerManager | undefined> {
        const configVersion = ConfigManager.getLatestFormalVersion();
        if (configVersion == null) {
            Logger.error(`TwWar._createInitialPlayerManagerDataForTw() empty configVersion.`);
            return undefined;
        }

        const playersCountUnneutral = mapRawData.playersCountUnneutral;
        if ((playersCountUnneutral == null) || (playersCountUnneutral < 2)) {
            Logger.error(`TwWar._createInitialPlayerManagerDataForTw() invalid playersCount!`);
            return undefined;
        }

        const bootTimerParams   = [Types.BootTimerType.Regular, CommonConstants.WarBootTimerRegularDefaultValue];
        const restTimeToBoot    = bootTimerParams ? bootTimerParams[1] : undefined;
        if (restTimeToBoot == null) {
            Logger.error(`TwWar._createInitialPlayerManagerDataForTw() empty restTimeToBoot.`);
            return undefined;
        }

        const players = [_createInitialSinglePlayerData({
            playerIndex         : 0,
            teamIndex           : 0,
            userId              : null,
            coId                : CommonConstants.CoEmptyId,
            restTimeToBoot      : 0,
            unitAndTileSkinId   : 0,
        })];

        const warRule = (mapRawData.warRuleArray || [])[0];
        if (warRule == null) {
            Logger.error(`TwWar._createInitialPlayerManagerDataForTw() empty warRule.`);
            return undefined;
        }

        const ruleForPlayers = warRule.ruleForPlayers;
        if (ruleForPlayers == null) {
            Logger.error(`TwWar._createInitialPlayerManagerDataForTw() empty ruleForPlayers.`);
            return undefined;
        }

        const ruleAvailability = warRule.ruleAvailability;
        if (ruleAvailability == null) {
            Logger.error(`TwWar._createInitialPlayerManagerDataForTw() empty ruleAvailability.`);
            return undefined;
        }

        if ((BwWarRuleHelper.getErrorCodeForRuleForPlayers({ ruleForPlayers, configVersion, playersCountUnneutral, ruleAvailability })) ||
            ((ruleForPlayers.playerRuleDataArray || []).length !== playersCountUnneutral)
        ) {
            Logger.error(`TwWar._createInitialPlayerManagerDataForTw() invalid ruleForPlayers! ${JSON.stringify(bootTimerParams)}`);
            return undefined;
        }

        for (let playerIndex = CommonConstants.WarFirstPlayerIndex; playerIndex <= playersCountUnneutral; ++playerIndex) {
            const teamIndex = BwWarRuleHelper.getTeamIndexByRuleForPlayers(ruleForPlayers, playerIndex);
            if (teamIndex == null) {
                Logger.error(`TwWar._createInitialPlayerManagerDataForTw() invalid teamIndex!`);
                return undefined;
            }

            players.push(_createInitialSinglePlayerData({
                playerIndex,
                teamIndex,
                userId              : 1,
                coId                : CommonConstants.CoEmptyId,
                restTimeToBoot,
                unitAndTileSkinId   : playerIndex,
            }));
        }

        return { players };
    }

    async function _createInitialFieldData(mapRawData: IMapRawData): Promise<WarSerialization.ISerialField | undefined> {
        const tiles = mapRawData.tileDataArray;
        if (tiles == null) {
            Logger.error(`TwWar._createInitialFieldData() empty tiles.`);
            return undefined;
        }

        const units = mapRawData.unitDataArray || [];
        return {
            tileMap     : {
                tiles,
            },
            unitMap : {
                units,
                nextUnitId  : units.length,
            },
            fogMap  : {
                forceFogCode: Types.ForceFogCode.None,
            },
        };
    }

    type DataForCreateSinglePlayerData = {
        playerIndex         : number;
        teamIndex           : number;
        userId              : number | null | undefined;
        coId                : number | null | undefined;
        restTimeToBoot      : number;
        unitAndTileSkinId   : number;
    }
    function _createInitialSinglePlayerData(data: DataForCreateSinglePlayerData): WarSerialization.ISerialPlayer {
        return {
            fund                        : 0,
            hasVotedForDraw             : false,
            aliveState                  : Types.PlayerAliveState.Alive,
            playerIndex                 : data.playerIndex,
            restTimeToBoot              : data.restTimeToBoot,
            userId                      : data.userId,
            unitAndTileSkinId           : data.unitAndTileSkinId,
            coId                        : data.coId,
            coCurrentEnergy             : null,
            coUsingSkillType            : Types.CoSkillType.Passive,
            coIsDestroyedInTurn         : false,
            watchOngoingSrcUserIdArray  : null,
            watchRequestSrcUserIdArray  : null,
        };
    }
}
