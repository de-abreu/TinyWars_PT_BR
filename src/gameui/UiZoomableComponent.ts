
namespace GameUi {
    import Types        = Utility.Types;
    import Helpers      = Utility.Helpers;
    import StageManager = Utility.StageManager;
    import Size         = Types.Size;
    import Point        = Types.Point;

    const ORIGIN: Point = {
        x: 0,
        y: 0
    };
    type TouchEvents = { [toucheId: number]: egret.TouchEvent };
    type TouchPoints = { [toucheId: number]: Point };

    export class UiZoomableComponent extends eui.Component {
        private _maskForContents: UiImage;

        private _contents        : egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
        private _contentWidth    : number = 0;
        private _contentHeight   : number = 0;
        private _spacingForTop   : number = 0;
        private _spacingForBottom: number = 0;
        private _spacingForLeft  : number = 0;
        private _spacingForRight : number = 0;

        public constructor() {
            super();

            this.addEventListener(egret.Event.RESIZE, this._onResize, this);

            this._resetMask();
            this.addChild(this._contents);
        }

        public addContent(content: egret.DisplayObject): void {
            this._contents.addChild(content);
        }
        public removeContent(content: egret.DisplayObject): void {
            this._contents.removeChild(content);
        }
        public removeAllContents(): void {
            this._contents.removeChildren();
        }

        public setContentWidth(width: number): void {
            this._contentWidth = width;

            this._reviseContentScaleAndPosition();
        }
        public getContentWidth(): number {
            return this._contentWidth;
        }
        public setContentHeight(height: number): void {
            this._contentHeight = height;

            this._reviseContentScaleAndPosition();
        }
        public getContentHeight(): number {
            return this._contentHeight;
        }

        public setBoundarySpacings(left = 0, right = 0, top = 0, bottom = 0): void {
            this._spacingForTop    = top;
            this._spacingForBottom = bottom;
            this._spacingForLeft   = left;
            this._spacingForRight  = right;

            this._reviseContentScaleAndPosition();
        }

        public setContentX(x: number, needRevise: boolean): void {
            this._contents.x = x;
            (needRevise) && (this._reviseContentX());
        }
        public getContentX(): number {
            return this._contents.x;
        }
        public setContentY(y: number, needRevise: boolean): void {
            this._contents.y = y;
            (needRevise) && (this._reviseContentY());
        }
        public getContentY(): number {
            return this._contents.y;
        }

        public setContentScale(scale: number, needRevise: boolean): void {
            this._contents.scaleX = scale;
            this._contents.scaleY = scale;

            (needRevise) && (this._reviseContentScaleAndPosition());
        }
        public getContentScale(): number {
            return this._contents.scaleX;
        }

        public setZoomByScroll(stageX: number, stageY: number, scrollValue: number): void {
            const point = (stageX != null) && (stageY != null) ? this._contents.globalToLocal(stageX, stageY) : undefined;
            if (this._checkIsInsideContents(point)) {
                this._setZoom(point, this._getScaleModifierByScrollValue(scrollValue));
            }
        }

        public setZoomByTouches(touches: TouchEvents, prevPoints: TouchPoints): void {
            const point = this._getCenterPoint(touches);
            if (this._checkIsInsideContents(point)) {
                this._setZoom(point, this._getScaleModifierByTouches(touches, prevPoints));
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onResize(e: egret.Event): void {
            this._reviseContentScaleAndPosition();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _getScaleModifierByScrollValue(value: number): number {
            return Math.max(0.01, 1 + value / 1000);
        }
        private _getScaleModifierByTouches(touches: TouchEvents, prevPoints: TouchPoints): number {
            const distances: number[] = [];
            for (const id in touches) {
                const touch     = touches[id];
                const prevPoint = prevPoints[id];
                if (!prevPoint) {
                    distances.push(0);
                } else {
                    distances.push(Helpers.getPointDistance(touch.localX, touch.localY, prevPoint.x, prevPoint.y));
                }

                if (distances.length >= 2) {
                    break;
                }
            }

            if ((distances.length <= 1) || (distances[0] === 0) || (distances[1] === 0)) {
                return 1;
            } else {
                return distances[1] / distances[0];
            }
        }

        private _getCenterPoint(touches: TouchEvents): Point {
            const points: Point[] = [];
            for (const id in touches) {
                points.push({x: touches[id].localX, y: touches[id].localY});
                if (points.length >= 2) {
                    break;
                }
            }

            if (points.length === 0) {
                return {x: 0, y: 0};
            } else if (points.length === 1) {
                return points[0];
            } else {
                return {
                    x: (points[0].x + points[1].x) / 2,
                    y: (points[0].y + points[1].y) / 2,
                }
            }
        }

        private _checkIsInsideContents(point: Point): boolean {
            return (point != null)
                && (point.x >= 0)
                && (point.y >= 0)
                && (point.x <= this.getContentWidth())
                && (point.y <= this.getContentHeight());
        }

        private _setZoom(focusPoint: Point, scaleModifier: number): void {
            const currentScale = this.getContentScale();
            let newScale = currentScale * scaleModifier;
            newScale = Math.max(newScale, this._getMinContentScale());
            newScale = Math.min(newScale, this._getMaxContentScale());

            if (newScale !== currentScale) {
                const oldGlobalPoint = this._contents.localToGlobal(focusPoint.x, focusPoint.y);
                this.setContentScale(newScale, false);

                const newGlobalPoint = this._contents.localToGlobal(focusPoint.x, focusPoint.y);
                this.setContentX(this.getContentX() - newGlobalPoint.x + oldGlobalPoint.x, false);
                this.setContentY(this.getContentY() - newGlobalPoint.y + oldGlobalPoint.y, false);

                this._reviseContentScaleAndPosition();
            }
        }

        private _getMaxContentScale(): number {
            return Math.max(2, this._getMinContentScale());
        }
        private _getMinContentScale(): number {
            const boundaryWidth  = this._getBoundaryWidth();
            const boundaryHeight = this._getBoundaryHeight();
            const contentWidth   = this.getContentWidth();
            const contentHeight  = this.getContentHeight();
            if ((!boundaryWidth) || (!boundaryHeight) || (!contentWidth) || (!contentHeight)) {
                return 1;
            } else {
                return Math.min(boundaryWidth / contentWidth, boundaryHeight / contentHeight);
            }
        }

        private _getBoundaryWidth(): number {
            return this.width - this._spacingForLeft - this._spacingForRight;
        }
        private _getBoundaryHeight(): number {
            return this.height - this._spacingForTop - this._spacingForBottom;
        }

        private _getMinContentX(): number {
            const boundaryWidth = this._getBoundaryWidth();
            const contentWidth  = this.getContentWidth() * this.getContentScale();
            if (contentWidth <= boundaryWidth) {
                return this._spacingForLeft + (boundaryWidth - contentWidth) / 2;
            } else {
                return this._spacingForLeft - (contentWidth - boundaryWidth);
            }
        }
        private _getMaxContentX(): number {
            const boundaryWidth = this._getBoundaryWidth();
            const contentWidth  = this.getContentWidth() * this.getContentScale();
            if (contentWidth <= boundaryWidth) {
                return this._spacingForLeft + (boundaryWidth - contentWidth) / 2;
            } else {
                return this._spacingForLeft;
            }
        }
        private _getMinContentY(): number {
            const boundaryHeight = this._getBoundaryHeight();
            const contentHeight  = this.getContentHeight() * this.getContentScale();
            if (contentHeight <= boundaryHeight) {
                return this._spacingForTop + (boundaryHeight - contentHeight) / 2;
            } else {
                return this._spacingForTop - (contentHeight - boundaryHeight);
            }
        }
        private _getMaxContentY(): number {
            const boundaryHeight = this._getBoundaryHeight();
            const contentHeight  = this.getContentHeight() * this.getContentScale();
            if (contentHeight <= boundaryHeight) {
                return this._spacingForTop + (boundaryHeight - contentHeight) / 2;
            } else {
                return this._spacingForTop;
            }
        }

        private _reviseContentX(): void {
            let x = this.getContentX();
            x = Math.max(x, this._getMinContentX());
            x = Math.min(x, this._getMaxContentX());
            this.setContentX(x, false);
        }
        private _reviseContentY(): void {
            let y = this.getContentY();
            y = Math.max(y, this._getMinContentY());
            y = Math.min(y, this._getMaxContentY());
            this.setContentY(y, false);
        }
        private _reviseContentScaleAndPosition(): void {
            let scale = this.getContentScale();
            scale = Math.max(scale, this._getMinContentScale());
            scale = Math.min(scale, this._getMaxContentScale());
            this.setContentScale(scale, false);

            this._reviseContentX();
            this._reviseContentY();
        }

        private _resetMask(): void {
            if (!this._maskForContents) {
                const mask  = new UiImage("c04_t06_s01_f01_png");
                mask.left   = 0;
                mask.right  = 0;
                mask.top    = 0;
                mask.bottom = 0;

                this._maskForContents = mask;
                this._contents.mask   = mask;
                this.addChildAt(mask, 0);
            }
        }
    }
}
