
namespace TinyWars.Login {
    import Notify   = Utility.Notify;
    import Lang     = Utility.Lang;
    import Types    = Utility.Types;
    import Helpers  = Utility.Helpers;

    export class LoginBackgroundPanel extends GameUi.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Bottom;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: LoginBackgroundPanel;

        private _imgBackground      : GameUi.UiImage;
        private _labelVersion       : GameUi.UiLabel;
        private _btnLanguage01      : GameUi.UiButton;
        private _btnLanguage02      : GameUi.UiButton;
        private _groupCopyright     : eui.Group;
        private _groupUnits         : eui.Group;

        public static show(): void {
            if (!LoginBackgroundPanel._instance) {
                LoginBackgroundPanel._instance = new LoginBackgroundPanel();
            }
            LoginBackgroundPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (LoginBackgroundPanel._instance) {
                await LoginBackgroundPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/login/LoginBackgroundPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.UnitAnimationTick,              callback: this._onNotifyUnitAnimationTick },
                { type: Notify.Type.MsgCommonLatestConfigVersion,   callback: this._onMsgCommonLatestConfigVersion },
            ]);
            this._setUiListenerArray([
                { ui: this,                 callback: this._onTouchedSelf },
                { ui: this._btnLanguage01,  callback: this._onTouchedBtnLanguage01 },
                { ui: this._btnLanguage02,  callback: this._onTouchedBtnLanguage02 },
            ]);

            this._showOpenAnimation();

            this._imgBackground.touchEnabled = true;
            this._btnLanguage01.setImgDisplaySource("login_button_language_003");
            this._btnLanguage01.setImgExtraSource("login_button_language_001");

            this._labelVersion.text = `v.${window.CLIENT_VERSION}`;
            this._updateBtnLanguages();

            if (Utility.ConfigManager.getLatestFormalVersion()) {
                // this._initGroupUnits();
            }
        }

        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();

            this._clearGroupUnits();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateBtnLanguages();
        }
        private _onNotifyUnitAnimationTick(e: egret.Event): void {
            const group = this._groupUnits;
            const tick  = Time.TimeModel.getUnitAnimationTickCount();
            for (let i = group.numChildren - 1; i >= 0; --i) {
                ((group.getChildAt(i) as eui.Component).getChildAt(0) as WarMap.WarMapUnitView).updateOnAnimationTick(tick);
            }
        }
        private _onMsgCommonLatestConfigVersion(e: egret.Event): void {
            // this._initGroupUnits();
        }
        private _onTouchedSelf(e: egret.TouchEvent): void {
            Utility.SoundManager.init();
        }
        private _onTouchedBtnLanguage01(e: egret.TouchEvent): void {
            if (Lang.getCurrentLanguageType() !== Types.LanguageType.Chinese) {
                Lang.setLanguageType(Types.LanguageType.Chinese);
                Notify.dispatch(Notify.Type.LanguageChanged);
            }
        }
        private _onTouchedBtnLanguage02(e: egret.TouchEvent): void {
            if (Lang.getCurrentLanguageType() !== Types.LanguageType.English) {
                Lang.setLanguageType(Types.LanguageType.English);
                Notify.dispatch(Notify.Type.LanguageChanged);
            }
        }

        private _updateBtnLanguages(): void {
            const languageType = Lang.getCurrentLanguageType();
            this._btnLanguage01.setImgDisplaySource(languageType === Types.LanguageType.Chinese
                ? "login_button_language_001"
                : "login_button_language_003"
            );
            this._btnLanguage02.setImgDisplaySource(languageType === Types.LanguageType.English
                ? "login_button_language_002"
                : "login_button_language_004"
            );
        }

        private _showOpenAnimation(): void {
            Helpers.resetTween({
                obj         : this._imgBackground,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._btnLanguage01,
                waitTime    : 1400,
                beginProps  : { left: -40, alpha: 0 },
                endProps    : { left: 0, alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._btnLanguage02,
                waitTime    : 1500,
                beginProps  : { left: -40, alpha: 0 },
                endProps    : { left: 0, alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._labelVersion,
                waitTime    : 1600,
                beginProps  : { right: -20, alpha: 0 },
                endProps    : { right: 20, alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._groupCopyright,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
                waitTime    : 1700,
            });
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>(resolve => {
                Helpers.resetTween({
                    obj         : this._imgBackground,
                    beginProps  : { alpha: 1 },
                    endProps    : { alpha: 0 },
                    callback    : resolve,
                });
                Helpers.resetTween({
                    obj         : this._btnLanguage01,
                    beginProps  : { left: 0, alpha: 1 },
                    endProps    : { left: -40, alpha: 0 },
                });
                Helpers.resetTween({
                    obj         : this._btnLanguage02,
                    beginProps  : { left: 0, alpha: 1 },
                    endProps    : { left: -40, alpha: 0 },
                });
                Helpers.resetTween({
                    obj         : this._labelVersion,
                    beginProps  : { right: 20, alpha: 1 },
                    endProps    : { right: -20, alpha: 0 },
                });
                Helpers.resetTween({
                    obj         : this._groupCopyright,
                    beginProps  : { alpha: 1 },
                    endProps    : { alpha: 0 },
                });
            });
        }

        // private _initGroupUnits(): void {
        //     this._clearGroupUnits();

        //     const group     = this._groupUnits;
        //     const gridWidth = Utility.ConfigManager.getGridSize().width;
        //     const count     = Math.ceil(group.width / gridWidth);
        //     for (let i = 0; i < count; ++i) {
        //         group.addChild(_createRandomUnitView());
        //     }

        //     group.x = 0;
        //     egret.Tween.get(group, { loop: true })
        //         .to({ x: -gridWidth / 4 }, 500)
        //         .call(() => {
        //             group.x = 0;
        //             group.removeChildAt(0);
        //             group.addChild(_createRandomUnitView());
        //         });
        // }
        private _clearGroupUnits(): void {
            this._groupUnits.removeChildren();
            egret.Tween.removeTweens(this._groupUnits);
        }
    }

    // function _createRandomUnitView(): eui.Component {
    //     const view = new WarMap.WarMapUnitView();
    //     view.update({
    //         configVersion: Utility.ConfigManager.getNewestConfigVersion(),

    //         gridX: 0,
    //         gridY: 0,

    //         viewId: Utility.ConfigManager.getUnitViewId(Math.floor(Math.random() * 26), Math.floor(Math.random() * 4) + 1),
    //     });

    //     const container     = new eui.Component();
    //     container.width     = Utility.ConfigManager.getGridSize().width;
    //     container.height    = Utility.ConfigManager.getGridSize().height;
    //     container.addChild(view);
    //     return container;
    // }
}
