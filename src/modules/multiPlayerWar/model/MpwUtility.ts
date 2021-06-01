
namespace TinyWars.MultiPlayerWar.MpwUtility {
    import Types                = Utility.Types;
    import Logger               = Utility.Logger;
    import Helpers              = Utility.Helpers;
    import GridIndexHelpers     = Utility.GridIndexHelpers;
    import VisibilityHelpers    = Utility.VisibilityHelpers;
    import DestructionHelpers   = Utility.DestructionHelpers;
    import CommonConstants      = Utility.CommonConstants;
    import BwWar                = BaseWar.BwWar;
    import GridIndex            = Types.GridIndex;
    import MovableArea          = Types.MovableArea;
    import AttackableArea       = Types.AttackableArea;
    import MapSize              = Types.MapSize;
    import MovePathNode         = Types.MovePathNode;

    type AvailableMovableGrid = {
        currGridIndex   : GridIndex;
        prevGridIndex   : GridIndex | undefined;
        totalMoveCost   : number;
    }

    export function createAttackableArea(movableArea: MovableArea, mapSize: MapSize, minAttackRange: number, maxAttackRange: number, checkCanAttack: (destination: GridIndex, target: GridIndex) => boolean): AttackableArea {
        const area = [] as AttackableArea;
        const { width, height } = mapSize;
        for (let moveX = 0; moveX < width; ++moveX) {
            if (movableArea[moveX]) {
                for (let moveY = 0; moveY < height; ++moveY) {
                    const movableGrid = movableArea[moveX][moveY];
                    if (movableGrid) {
                        const moveGridIndex = { x: moveX, y: moveY };
                        for (const attackGridIndex of GridIndexHelpers.getGridsWithinDistance(moveGridIndex, minAttackRange, maxAttackRange, mapSize)) {
                            const { x: attackX, y: attackY } = attackGridIndex;
                            if (checkCanAttack(moveGridIndex, attackGridIndex)) {
                                area[attackX] = area[attackX] || [];
                                const attackableGrid = area[attackX][attackY];
                                if ((!attackableGrid)                                                                                                               ||
                                    (movableGrid.totalMoveCost < movableArea[attackableGrid.movePathDestination.x][attackableGrid.movePathDestination.y].totalMoveCost)
                                ) {
                                    area[attackX][attackY] = {
                                        movePathDestination: { x: moveX, y: moveY },
                                    };
                                }
                            }
                        }
                    }
                }
            }
        }
        return area;
    }

    export function createShortestMovePath(area: MovableArea, destination: GridIndex): MovePathNode[] {
        const reversedPath = [] as MovePathNode[];
        let gridIndex   = destination;
        let movableNode = area[gridIndex.x][gridIndex.y];

        while (true) {
            reversedPath.push({
                x               : gridIndex.x,
                y               : gridIndex.y,
                totalMoveCost   : movableNode.totalMoveCost,
            });

            gridIndex = movableNode.prevGridIndex;
            if (!gridIndex) {
                return reversedPath.reverse();
            }
            movableNode = area[gridIndex.x][gridIndex.y];
        }
    }

    export function updateTilesAndUnitsOnVisibilityChanged(war: BwWar): void {
        const watcherTeamIndexes    = war.getPlayerManager().getAliveWatcherTeamIndexesForSelf();
        const visibleUnitsOnMap     = VisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, watcherTeamIndexes);
        war.getUnitMap().forEachUnitOnMap(unit => {
            if (visibleUnitsOnMap.has(unit)) {
                unit.setViewVisible(true);
            } else {
                DestructionHelpers.removeUnitOnMap(war, unit.getGridIndex());
            }
        });
        DestructionHelpers.removeInvisibleLoadedUnits(war, watcherTeamIndexes);

        const visibleTiles  = VisibilityHelpers.getAllTilesVisibleToTeams(war, watcherTeamIndexes);
        const tileMap       = war.getTileMap();
        tileMap.forEachTile(tile => {
            if (visibleTiles.has(tile)) {
                tile.setHasFog(false);
            } else {
                if (!tile.getHasFog()) {
                    resetTileDataAsHasFog(tile);
                }
            }
            tile.flushDataToView();
        });
        tileMap.getView().updateCoZone();
    }

    export function resetTileDataAsHasFog(tile: BaseWar.BwTile): void {
        tile.setHasFog(true);

        tile.deserialize({
            gridIndex       : tile.getGridIndex(),
            baseType        : tile.getBaseType(),
            objectType      : tile.getObjectType(),
            playerIndex     : tile.getType() === Types.TileType.Headquarters ? tile.getPlayerIndex() : CommonConstants.WarNeutralPlayerIndex,
            baseShapeId     : tile.getBaseShapeId(),
            objectShapeId   : tile.getObjectShapeId(),
            currentHp       : tile.getCurrentHp(),
        }, tile.getConfigVersion());
    }

    function _pushToAvailableMovableGrids(grids: AvailableMovableGrid[], gridIndex: GridIndex, prev: GridIndex, totalMoveCost: number): void {
        grids.push({
            currGridIndex: gridIndex,
            prevGridIndex: prev ? { x: prev.x, y: prev.y } : undefined,
            totalMoveCost,
        });
    }
    function _checkAndUpdateMovableArea(area: MovableArea, gridIndex: GridIndex, prev: GridIndex, totalMoveCost: number): boolean {
        const { x, y } = gridIndex;
        area[x] = area[x] || [];

        if ((area[x][y]) && (area[x][y].totalMoveCost <= totalMoveCost)) {
            return false;
        } else {
            area[x][y] = {
                prevGridIndex: prev ? { x: prev.x, y: prev.y } : undefined,
                totalMoveCost,
            };
            return true;
        }
    }
}
