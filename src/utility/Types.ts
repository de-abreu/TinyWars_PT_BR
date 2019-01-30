
namespace TinyWars.Utility.Types {
    import Codes = Network.Codes;

    ////////////////////////////////////////////////////////////////////////////////
    // Config types.
    ////////////////////////////////////////////////////////////////////////////////
    export interface FullConfig extends ProtoTypes.IFullConfig {
        TileCategory    : TileCategoryCfg[];
        UnitCategory    : UnitCategoryCfg[];
        TileTemplate    : TileTemplateCfg[];
        UnitTemplate    : UnitTemplateCfg[];
        DamageChart     : DamageChartCfg[];
        MoveCost        : MoveCostCfg[];
        UnitPromotion   : UnitPromotionCfg[];
        VisionBonus     : VisionBonusCfg[];
        BuildableTile   : BuildableTileCfg[];
    }
    export interface TileCategoryCfg extends ProtoTypes.ITileCategoryCfg {
        category: TileCategory;
    }
    export interface UnitCategoryCfg extends ProtoTypes.IUnitCategoryCfg {
        category: UnitCategory;
    }
    export interface TileTemplateCfg extends ProtoTypes.ITileTemplateCfg {
        type                : TileType;
        defenseAmount       : number;
        defenseUnitCategory : UnitCategory;
        hideUnitCategory?   : UnitCategory;
    }
    export interface UnitTemplateCfg extends ProtoTypes.IUnitTemplateCfg {
        type                    : UnitType;
        maxHp                   : number;
        armorType               : ArmorType;
        isAffectedByLuck        : number;
        moveRange               : number;
        moveType                : MoveType;
        maxFuel                 : number;
        fuelConsumptionPerTurn  : number;
        productionCost          : number;
        visionRange             : number;
    }
    export interface DamageChartCfg extends ProtoTypes.IDamageChartCfg {
        attackerType: UnitType;
        armorType   : ArmorType;
        weaponType  : WeaponType;
    }
    export interface MoveCostCfg extends ProtoTypes.IMoveCostCfg {
        tileType    : TileType;
        moveType    : MoveType;
    }
    export interface UnitPromotionCfg extends ProtoTypes.IUnitPromotionCfg {
        promotion   : number;
        attackBonus : number;
        defenseBonus: number;
    }
    export interface VisionBonusCfg extends ProtoTypes.IVisionBonusCfg {
        unitType    : UnitType;
        tileType    : TileType;
        visionBonus : number;
    }
    export interface BuildableTileCfg extends ProtoTypes.IBuildableTileCfg {
        unitType    : UnitType;
        srcTileType : TileType;
        dstTileType : TileType;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Serialization data types.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export interface SerializedMcAction extends ProtoTypes.IActionContainer {
    }
    export interface SerializedMcTile extends ProtoTypes.ISerializedMcTile {
        gridX           : number;
        gridY           : number;
        baseViewId      : number;
        objectViewId    : number;
    };
    export interface SerializedMcUnit extends ProtoTypes.ISerializedMcUnit {
        gridX   : number;
        gridY   : number;
        unitId  : number;
        viewId  : number;
    }
    export interface SerializedMcTileMap extends ProtoTypes.ISerializedMcTileMap {
        tiles?: SerializedMcTile[];
    }
    export interface SerializedMcUnitMap extends ProtoTypes.ISerializedMcUnitMap {
        units?      : SerializedMcUnit[];
        nextUnitId  : number;
    }
    export interface SerializedMcPlayer extends ProtoTypes.ISerializedMcPlayer {
        fund            : number;
        hasVotedForDraw : boolean;
        isAlive         : boolean;
        playerIndex     : number;
        teamIndex       : number;
        userId?         : number;
    }
    export interface SerializedMcFogMap extends ProtoTypes.ISerializedMcFogMap {
        mapsForPath?: SerializedMcFogMapForPath[];
    }
    export interface SerializedMcFogMapForPath extends ProtoTypes.ISerializedMcFogMapForPath {
        playerIndex : number;
        encodedMap  : string;
    }
    export interface SerializedMcField extends ProtoTypes.ISerializedMcField {
        fogMap  : SerializedMcFogMap;
        unitMap?: SerializedMcUnitMap;
        tileMap?: SerializedMcTileMap;
    }
    export interface SerializedMcTurn extends ProtoTypes.ISerializedMcTurn {
        turnIndex       : number;
        playerIndex     : number;
        turnPhaseCode   : TurnPhaseCode;
    }
    export interface SerializedMcWar extends ProtoTypes.ISerializedMcWar {
        warId           : number;
        configVersion   : number;
        mapName         : string;
        mapDesigner     : string;
        mapVersion      : number;
        warName         : string;
        warPassword     : string;
        warComment      : string;

        hasFogByDefault     : boolean;
        timeLimit           : number;
        initialFund         : number;
        incomeModifier      : number;
        initialEnergy       : number;
        energyGrowthModifier: number;
        moveRangeModifier   : number;
        attackPowerModifier : number;
        visionRangeModifier : number;

        remainingVotesForDraw?  : number;
        enterTurnTime           : number;
        executedActions         : SerializedMcAction[];
        players                 : SerializedMcPlayer[];
        turn                    : SerializedMcTurn;
        field                   : SerializedMcField;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Types.
    ////////////////////////////////////////////////////////////////////////////////
    export type Size = {
        width : number;
        height: number;
    }

    export type GridIndex = {
        x: number;
        y: number;
    }

    export type MapSize = {
        width   : number;
        height  : number;
    }

    export type Point = {
        x: number;
        y: number;
    }

    export type TouchEvents = {
        [touchId: number]: egret.TouchEvent;
    }

    export type TouchPoints = {
        [touchId: number]: Point;
    }

    export type MoveCosts = {
        [moveType: number]: number | undefined;
    }

    export type MovePath = {
        nodes           : GridIndex[];
        fuelConsumption : number;
        isBlocked       : boolean;
    }

    export type RepairHpAndCost = {
        hp  : number;
        cost: number;
    }

    export type VisibilityFromPaths = 0 | 1 | 2;
    export type VisibilityFromTiles = 0 | 1;
    export type VisibilityFromUnits = 0 | 1;
    export type Visibility          = {
        fromPaths   : VisibilityFromPaths,
        fromTiles   : VisibilityFromTiles,
        fromUnits   : VisibilityFromUnits,
    }

    export type MapIndexKey = {
        mapDesigner : string;
        mapName     : string;
        mapVersion  : number;
    }

    export type TemplateMap = {
        mapDesigner : string;
        mapName     : string;
        mapVersion  : number;
        mapWidth    : number;
        mapHeight   : number;
        playersCount: number;
        tileBases   : number[];
        tileObjects : number[];
        units       : number[];
    }

    export type UnitViewData = {
        configVersion: number;

        gridX: number;
        gridY: number;

        viewId: number;

        unitId: number;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Enums.
    ////////////////////////////////////////////////////////////////////////////////
    export const enum LayerType {
        Top,
        Notify,
        Hud3,
        Hud2,
        Hud1,
        Hud0,
        Scene,
        Bottom,
    }

    export const enum ColorType {
        Origin,
        Gray,
        Dark,
        Red,
        Green,
        Blue,
        White,
    }

    export const UiState = {
        Up  : "up",
        Down: "down",
    }

    export const enum LogoutType {
        SelfRequest,
        LoginCollision,
        NetworkFailure,
    }

    export const enum MoveType {
        Infantry,  /* 0 */            Mech,      /* 1 */            TireA,     /* 2 */            TireB,     /* 3 */
        Tank,      /* 4 */            Air,       /* 5 */            Ship,      /* 6 */            Transport, /* 7 */
    }

    export const enum TileBaseType {
        Empty,  /* 0 */            Plain,  /* 1 */            River,  /* 2 */            Sea,    /* 3 */
        Beach,  /* 4 */
    }

    export const enum TileObjectType {
        Empty,        /* 0 */             Road,         /* 1 */             Bridge,       /* 2 */             Wood,         /* 3 */
        Mountain,     /* 4 */             Wasteland,    /* 5 */             Ruins,        /* 6 */             Fire,         /* 7 */
        Rough,        /* 8 */             Mist,         /* 9 */             Reef,         /* 10 */            Plasma,       /* 11 */
        Meteor,       /* 12 */            Silo,         /* 13 */            EmptySilo,    /* 14 */            Headquarters, /* 15 */
        City,         /* 16 */            CommandTower, /* 17 */            Radar,        /* 18 */            Factory,      /* 19 */
        Airport,      /* 20 */            Seaport,      /* 21 */            TempAirport,  /* 22 */            TempSeaport,  /* 23 */
        GreenPlasma,  /* 24 */
    }

    export const enum TileType {
        Plain,         /* 0 */      River,         /* 1 */      Sea,           /* 2 */      Beach,         /* 3 */
        Road,          /* 4 */      BridgeOnPlain, /* 5 */      BridgeOnRiver, /* 6 */      BridgeOnBeach, /* 7 */
        BridgeOnSea,   /* 8 */      Wood,          /* 9 */      Mountain,      /* 10 */     Wasteland,     /* 11 */
        Ruins,         /* 12 */     Fire,          /* 13 */     Rough,         /* 14 */     MistOnSea,     /* 15 */
        Reef,          /* 16 */     Plasma,        /* 17 */     GreenPlasma,   /* 18 */     Meteor,        /* 19 */
        Silo,          /* 20 */     EmptySilo,     /* 21 */     Headquarters,  /* 22 */     City,          /* 23 */
        CommandTower,  /* 24 */     Radar,         /* 25 */     Factory,       /* 26 */     Airport,       /* 27 */
        Seaport,       /* 28 */     TempAirport,   /* 29 */     TempSeaport,   /* 30 */     MistOnPlain,   /* 31 */
        MistOnRiver,   /* 32 */     MistOnBeach,   /* 33 */
    }

    export const enum UnitType {
        Infantry,        /* 0 */            Mech,            /* 1 */            Bike,            /* 2 */            Recon,           /* 3 */
        Flare,           /* 4 */            AntiAir,         /* 5 */            Tank,            /* 6 */            MediumTank,      /* 7 */
        WarTank,         /* 8 */            Artillery,       /* 9 */            AntiTank,        /* 10 */           Rockets,         /* 11 */
        Missiles,        /* 12 */           Rig,             /* 13 */           Fighter,         /* 14 */           Bomber,          /* 15 */
        Duster,          /* 16 */           BattleCopter,    /* 17 */           TransportCopter, /* 18 */           Seaplane,        /* 19 */
        Battleship,      /* 20 */           Carrier,         /* 21 */           Submarine,       /* 22 */           Cruiser,         /* 23 */
        Lander,          /* 24 */           Gunboat,         /* 25 */
    }

    export const enum UnitCategory {
        None,          /* 0 */            All,               /* 1 */            Ground,        /* 2 */            Naval,         /* 3 */
        Air,           /* 4 */            GroundOrNaval,     /* 5 */            GroundOrAir,   /* 6 */            Direct,        /* 7 */
        Indirect,      /* 8 */            Foot,              /* 9 */            Infantry,      /* 10 */           Vehicle,       /* 11 */
        DirectMachine, /* 12 */           Transport,         /* 13 */           LargeNaval,    /* 14 */           Copter,        /* 15 */
        Tank,          /* 16 */           AirExceptSeaplane, /* 17 */
    }

    export const enum TileCategory {
        None,              /* 0 */            All,               /* 1 */            LoadableForSeaTransports, /* 2 */
    }

    export const enum ArmorType {
        Infantry,        /* 0 */            Mech,            /* 1 */            Bike,            /* 2 */            Recon,           /* 3 */
        Flare,           /* 4 */            AntiAir,         /* 5 */            Tank,            /* 6 */            MediumTank,      /* 7 */
        WarTank,         /* 8 */            Artillery,       /* 9 */            AntiTank,        /* 10 */           Rockets,         /* 11 */
        Missiles,        /* 12 */           Rig,             /* 13 */           Fighter,         /* 14 */           Bomber,          /* 15 */
        Duster,          /* 16 */           BattleCopter,    /* 17 */           TransportCopter, /* 18 */           Seaplane,        /* 19 */
        Battleship,      /* 20 */           Carrier,         /* 21 */           Submarine,       /* 22 */           Cruiser,         /* 23 */
        Lander,          /* 24 */           Gunboat,         /* 25 */           Meteor,          /* 26 */
    }

    export const enum UnitState {
        Idle,   /* 0 */         Actioned,   /* 1 */
    }

    export const enum WeaponType {
        Primary     = 0,
        Secondary   = 1,
    }

    export const enum ForceFogCode {
        None,
        Clear,
        Fog,
    }

    export const enum Direction {
        Left,
        Right,
        Up,
        Down,
    }

    export const enum TurnPhaseCode {
        RequestBeginTurn,
        GetFund,
        ConsumeFuel,
        RepairUnitByTile,
        DestroyUnitsOutOfFuel,
        RepairUnitByUnit,
        Main,
        ResetUnitState,
        ResetVisionForCurrentPlayer,
        TickTurnAndPlayerIndex,
        ResetSkillState,
        ResetVisionForNextPlayer,
        ResetVotesForDraw,
    }
}
