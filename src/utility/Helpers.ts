
namespace TinyWars.Utility.Helpers {
    import ColorType = Types.ColorType;

    const COLOR_MATRIX_FILTERS = {
        [ColorType.Gray]: new egret.ColorMatrixFilter([
            0.3, 0.6, 0, 0, 0,
            0.3, 0.6, 0, 0, 0,
            0.3, 0.6, 0, 0, 0,
            0, 0, 0, 1, 0
        ]),

        [ColorType.Dark]: new egret.ColorMatrixFilter([
            0.625,  0,      0,      0,  0,
            0,      0.625,  0,      0,  0,
            0,      0,      0.625,  0,  0,
            0,      0,      0,      1,  0
        ]),
    };

    export function checkIsWebGl(): boolean {
        return egret.Capabilities.renderMode === "webgl";
    }

    export function checkIsAccountValid(str: string | undefined | null): boolean {
        return (typeof str === "string")
            && (str.length >= 6)
            && (str.length <= 20)
            && (str.search(/\W/) < 0);
    }

    export function checkIsPasswordValid(str: string | undefined | null): boolean {
        return (typeof str === "string")
            && (str.length >= 6)
            && (str.length <= 20)
            && (str.search(/\W/) < 0);
    }

    export function checkIsNicknameValid(str: string | undefined | null): boolean {
        return (typeof str === "string")
            && (str.length >= 4)
            && (str.length <= 20)
            && (str.search(/\W/) < 0);
    }

    export function formatString(...args: (number | string)[]): string {
        let i = 0, a, f = args[i++] as string, o = [], m, p, c, x, s = '';
        while (f) {
            if (m = /^[^\x25]+/.exec(f)) {
                o.push(m[0]);
            } else if (m = /^\x25{2}/.exec(f)) {
                o.push('%');
            } else if (m = /^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(f)) {
                if (((a = args[m[1] || i++]) == null) || (a == undefined)) {
                    throw ('Too few arguments.');
                }
                if (/[^s]/.test(m[7])) {
                    let aa = Number(a);
                    if (isNaN(aa)) {
                        throw ('Expecting number but found ' + typeof (a));
                    } else {
                        a = aa
                    }
                }
                switch (m[7]) {
                    case 'b': a = a.toString(2); break;
                    case 'c': a = String.fromCharCode(a); break;
                    case 'i': a = parseInt(a); break;
                    case 'd': a = parseInt(a); break;
                    case 'e': a = m[6] ? a.toExponential(m[6]) : a.toExponential(); break;
                    case 'f': a = m[6] ? parseFloat(a).toFixed(m[6]) : parseFloat(a); break;
                    case 'o': a = a.toString(8); break;
                    case 's': a = ((a = String(a)) && m[6] ? a.substring(0, m[6]) : a); break;
                    case 'u': a = Math.abs(a); break;
                    case 'x': a = a.toString(16); break;
                    case 'X': a = a.toString(16).toUpperCase(); break;
                }
                a = (/[def]/.test(m[7]) && m[2] && a >= 0 ? '+' + a : a);
                c = m[3] ? m[3] == '0' ? '0' : m[3].charAt(1) : ' ';
                x = m[5] - String(a).length - s.length;
                p = m[5] ? repeatString(c, x) : '';
                o.push(s + (m[4] ? a + p : p + a));
            } else {
                throw ('Huh ?!');
            }
            f = f.substring(m[0].length);
        }
        return o.join('');
    }

    export function repeatString(str: string, times: number): string {
        return (new Array(times + 1)).join(str);
    }

    export function changeColor(obj: egret.DisplayObject, color: Types.ColorType, value = 100): void {
        if (checkIsWebGl()) {
            if ((color === ColorType.Gray) || (color === ColorType.Dark)) {
                obj.filters = [COLOR_MATRIX_FILTERS[color]];
            } else if (color === ColorType.Origin) {
                obj.filters = undefined;
            } else {
                obj.filters = [new egret.ColorMatrixFilter(getColorMatrix(color, value))];
            }
        }
    }

    export function cloneObject(obj: { [key: string]: any }): { [key: string]: any } {
        const o: { [key: string]: any } = {};
        for (const k in obj) {
            o[k] = obj[k];
        }
        return o;
    }

    export function checkIsEmptyObject(obj: { [key: string]: any }): boolean {
        for (const k in obj) {
            return false;
        }
        return true;
    }

    export function getObjectKeysCount(obj: { [key: string]: any }): number {
        let count = 0;
        for (const k in obj) {
            ++count;
        }
        return count;
    }

    export function pickRandomElement<T>(list: T[]): T {
        if (!list) {
            return undefined;
        } else {
            return list[Math.floor(Math.random() * list.length)];
        }
    }

    /** 获取一个整数的位数。不计负数的符号；0-9计为1；10-99计为2；以此类推 */
    export function getDigitsCount(num: number): number {
        num = Math.abs(num);
        let count = 1;
        while (num >= 10) {
            ++count;
            num = Math.floor(num / 10);
        }

        return count;
    }

    export function getNumText(num: number, targetLength = 2): string {
        return repeatString("0", targetLength - getDigitsCount(num)) + num;
    }

    export function getMapFileName(k: Types.MapIndexKey): string {
        return `${k.mapName}_${k.mapDesigner}_${k.mapVersion < 10 ? "0" : ""}${k.mapVersion}`;
    }

    export function getMapUrl(key: Types.MapIndexKey): string {
        return formatString("resource/assets/map/%s_%s_%s.json", key.mapName, key.mapDesigner, getNumText(key.mapVersion));
    }

    export function checkIsGridIndexEqual(gridIndex1: Types.GridIndex, gridIndex2: Types.GridIndex): boolean {
        return (gridIndex1.x === gridIndex2.x) && (gridIndex1.y === gridIndex2.y);
    }

    export function getNormalizedHp(hp: number): number {
        return Math.ceil(hp / 10);
    }

    export function getPointDistance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }

    export function getColorText(playerIndex: number): string {
        switch (playerIndex) {
            case 1  : return Lang.getText(Lang.BigType.B01, Lang.SubType.S04);
            case 2  : return Lang.getText(Lang.BigType.B01, Lang.SubType.S05);
            case 3  : return Lang.getText(Lang.BigType.B01, Lang.SubType.S06);
            case 4  : return Lang.getText(Lang.BigType.B01, Lang.SubType.S07);
            default : return undefined;
        }
    }

    export function getTeamText(teamIndex: number): string {
        switch (teamIndex) {
            case 1  : return Lang.getText(Lang.BigType.B01, Lang.SubType.S08);
            case 2  : return Lang.getText(Lang.BigType.B01, Lang.SubType.S09);
            case 3  : return Lang.getText(Lang.BigType.B01, Lang.SubType.S10);
            case 4  : return Lang.getText(Lang.BigType.B01, Lang.SubType.S11);
            default : return undefined;
        }
    }

    export function getTimeText(totalSeconds: number): string {
        const seconds = totalSeconds % 60;
        const minutes = Math.floor(totalSeconds / 60) % 60;
        const hours   = Math.floor(totalSeconds / (60 * 60)) % 24;
        const days    = Math.floor(totalSeconds / (60 * 60 * 24));

        let text: string = "";
        (days    > 0) && (text = `${text}${days}${Lang.getText(Lang.BigType.B01, Lang.SubType.S14)}`);
        (hours   > 0) && (text = `${text}${hours}${Lang.getText(Lang.BigType.B01, Lang.SubType.S15)}`);
        (minutes > 0) && (text = `${text}${minutes}${Lang.getText(Lang.BigType.B01, Lang.SubType.S16)}`);
        (seconds > 0) && (text = `${text}${seconds}${Lang.getText(Lang.BigType.B01, Lang.SubType.S17)}`);
        return text;
    }

    export function createEmptyMap<T>(mapWidth: number): T[][] {
        const map = new Array<T[]>(mapWidth);
        for (let i = 0; i < mapWidth; ++i) {
            map[i] = [];
        }
        return map;
    }

    function getColorMatrix(color: Types.ColorType, value = 100): number[] {
        switch (color) {
            case Types.ColorType.Blue:
                return [
                    1, 0, 0, 0, 0,
                    0, 1, 0, 0, 0,
                    0, 0, 1, 0, value,
                    0, 0, 0, 1, 0
                ];

            case Types.ColorType.Green:
                return [
                    1, 0, 0, 0, 0,
                    0, 1, 0, 0, value,
                    0, 0, 1, 0, 0,
                    0, 0, 0, 1, 0
                ];

            case Types.ColorType.Red:
                return [
                    1, 0, 0, 0, value,
                    0, 1, 0, 0, 0,
                    0, 0, 1, 0, 0,
                    0, 0, 0, 1, 0
                ];

            case Types.ColorType.White:
                return [
                    1, 0, 0, 0, value,
                    0, 1, 0, 0, value,
                    0, 0, 1, 0, value,
                    0, 0, 0, 1, 0
                ];

            default:
                return undefined;
        }
    }
}
