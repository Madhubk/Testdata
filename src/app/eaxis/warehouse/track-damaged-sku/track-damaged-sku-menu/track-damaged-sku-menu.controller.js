(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TrackDamagedMenuController", TrackDamagedMenuController);

    TrackDamagedMenuController.$inject = ["$scope", "apiService", "trackDamageSkuConfig", "helperService", "toastr"];

    function TrackDamagedMenuController($scope, apiService, trackDamageSkuConfig, helperService, toastr) {

        var TrackDamagedMenuCtrl = this

        function Init() {

            var currentTrackDamage = TrackDamagedMenuCtrl.currentTrackDamage[TrackDamagedMenuCtrl.currentTrackDamage.label].ePage.Entities;

            TrackDamagedMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "PickUp_Line_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentTrackDamage
            };

            TrackDamagedMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            TrackDamagedMenuCtrl.ePage.Masters.Validation = Validation;
            TrackDamagedMenuCtrl.ePage.Masters.Config = trackDamageSkuConfig;
        }

        // #region - saving PickUp
        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;
            Saveonly($item);
        }

        function Saveonly($item) {
            TrackDamagedMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            TrackDamagedMenuCtrl.ePage.Masters.DisableSave = true;
            TrackDamagedMenuCtrl.ePage.Masters.Loading = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            $item = filterObjectUpdate($item, "IsModified");

            helperService.SaveEntity($item, 'PickUpReport').then(function (response) {
                TrackDamagedMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                TrackDamagedMenuCtrl.ePage.Masters.DisableSave = false;
                TrackDamagedMenuCtrl.ePage.Masters.Loading = false;

                if (response.Status === "success") {
                    trackDamageSkuConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == TrackDamagedMenuCtrl.ePage.Entities.Header.Data.PickupLineRefNo) {
                                value.label = TrackDamagedMenuCtrl.ePage.Entities.Header.Data.PickupLineRefNo;
                                value[TrackDamagedMenuCtrl.ePage.Entities.Header.Data.PickupLineRefNo] = value.New;
                                delete value.New;
                            }
                        }
                    });
                    var _index = trackDamageSkuConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK
                    }).indexOf(TrackDamagedMenuCtrl.currentTrackDamage[TrackDamagedMenuCtrl.currentTrackDamage.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        if (response.Data.Response)
                            trackDamageSkuConfig.TabList[_index][trackDamageSkuConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data.Response;
                        else if (response.Data)
                            trackDamageSkuConfig.TabList[_index][trackDamageSkuConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;

                        helperService.refreshGrid();
                    }
                    if (TrackDamagedMenuCtrl.ePage.Masters.SaveAndClose) {
                        TrackDamagedMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                        TrackDamagedMenuCtrl.ePage.Masters.SaveAndClose = false;
                        TrackDamagedMenuCtrl.ePage.Masters.DisableSave = true;
                    }
                    toastr.success("Saved Successfully");

                } else if (response.Status === "failed") {
                    console.log("Failed");
                    toastr.error("Could not Save...!");
                    TrackDamagedMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        TrackDamagedMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, TrackDamagedMenuCtrl.currentTrackDamage.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
                    });
                    if (TrackDamagedMenuCtrl.ePage.Entities.Header.Validations != null) {
                        TrackDamagedMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(TrackDamagedMenuCtrl.currentTrackDamage);
                    }
                }
            });
        }

        function filterObjectUpdate(obj, key) {
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    filterObjectUpdate(obj[i], key);
                } else if (i == key) {
                    obj[key] = true;
                }
            }
            return obj;
        }
        // #endregion     
        Init();
    }

})();