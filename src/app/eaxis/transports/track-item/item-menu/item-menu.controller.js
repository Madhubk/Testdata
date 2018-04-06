(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ItemMenuController", ItemMenuController);

    ItemMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "itemConfig", "helperService", "appConfig", "authService", "$location", "$state", "toastr", "confirmation"];

    function ItemMenuController($scope, $timeout, APP_CONSTANT, apiService, itemConfig, helperService, appConfig, authService, $location, $state, toastr, confirmation) {

        var ItemMenuCtrl = this

        function Init() {

            var currentItem = ItemMenuCtrl.currentItem[ItemMenuCtrl.currentItem.label].ePage.Entities;

            ItemMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Item_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentItem
            };

            ItemMenuCtrl.ePage.Masters.ItemMenu = {};
            // Menu list from configuration
            ItemMenuCtrl.ePage.Masters.ItemMenu.ListSource = ItemMenuCtrl.ePage.Entities.Header.Meta.MenuList;
            ItemMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            ItemMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Save & Close";
            ItemMenuCtrl.ePage.Masters.FinaliseSaveText = "Finalise";
            ItemMenuCtrl.ePage.Masters.Config = itemConfig;

            // Standard Menu Configuration and Data
            ItemMenuCtrl.ePage.Masters.StandardMenuInput = appConfig.Entities.standardMenuConfigList.TransportItem;
            ItemMenuCtrl.ePage.Masters.StandardMenuInput.obj = ItemMenuCtrl.currentItem;
            ItemMenuCtrl.ePage.Masters.Validation = Validation;
            ItemMenuCtrl.ePage.Masters.SaveClose = SaveClose;
            ItemMenuCtrl.ePage.Masters.tabSelected = tabSelected;
        }

        function tabSelected(tab, $index, $event) {
            var _index = itemConfig.TabList.map(function (value, key) {
                return value[value.label].ePage.Entities.Header.Data.PK
            }).indexOf(ItemMenuCtrl.currentItem[ItemMenuCtrl.currentItem.label].ePage.Entities.Header.Data.PK);

            if (_index !== -1) {
                if (itemConfig.TabList[_index].isNew) {
                    if ($index > 0) {
                        $event.preventDefault();
                        var modalOptions = {
                            closeButtonText: 'No',
                            actionButtonText: 'YES',
                            headerText: 'Save Before Tab Change..',
                            bodyText: 'Do You Want To Save?'
                        };
                        confirmation.showModal({}, modalOptions)
                            .then(function (result) {
                                ItemMenuCtrl.ePage.Masters.Validation(ItemMenuCtrl.currentItem);
                            }, function () {
                                console.log("Cancelled");
                            });
                    }
                }
                else {
                    if ($index == 1 || $index == 2) {
                        var mydata = ItemMenuCtrl.currentItem[ItemMenuCtrl.currentItem.label].ePage.Entities.Header.Data;
                        if (mydata.TmsItemHeader.ItemCode && mydata.TmsItemHeader.Sender_ORG_FK) {
                            //It opens line page         
                        } else {
                            if (ItemMenuCtrl.ePage.Masters.active == 1) {
                                $event.preventDefault();
                            }
                            ItemMenuCtrl.ePage.Masters.active = 1;
                            Validation(ItemMenuCtrl.currentItem);
                        }
                    }
                }
            }
        }

        function SaveClose($item) {
            ItemMenuCtrl.ePage.Masters.SaveAndClose = true;
            Validation($item);
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            ItemMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (ItemMenuCtrl.ePage.Entities.Header.Validations) {
                ItemMenuCtrl.ePage.Masters.Config.RemoveApiErrors(ItemMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Saveonly($item);
            } else {
                ItemMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(ItemMenuCtrl.currentItem);
            }
        }

        function Saveonly($item) {
            if (ItemMenuCtrl.ePage.Masters.SaveAndClose) {
                ItemMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Please Wait...";
            } else {
                ItemMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            }
            ItemMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            _input.TmsConsignmentItem.map(function (value, key) {
                value.TIT_FK = _input.TmsItemHeader.PK;
            });

            if ($item.isNew) {
                _input.TmsItemHeader.PK = _input.PK;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }
            _input.TmsItemHeader.ItemRefType = "MHU";
            helperService.SaveEntity($item, 'Item').then(function (response) {
                ItemMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;
                if (ItemMenuCtrl.ePage.Masters.SaveAndClose) {
                    ItemMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Save & Close";
                } else {
                    ItemMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                }
                if (response.Status === "success") {
                    var _index = itemConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK
                    }).indexOf(ItemMenuCtrl.currentItem[ItemMenuCtrl.currentItem.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        if (response.Data.Response) {
                            itemConfig.TabList[_index][itemConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data.Response;
                        }
                        else {
                            itemConfig.TabList[_index][itemConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        }
                        if (ItemMenuCtrl.ePage.Masters.SaveAndClose) {
                            ItemMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                            ItemMenuCtrl.ePage.Masters.SaveAndClose = false;
                        }
                        itemConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/item") {
                            helperService.refreshGrid();
                        }
                    }
                    console.log("Success");
                    ItemMenuCtrl.ePage.Entities.Header.CheckPoints.Receiveline = false;
                } else if (response.Status === "failed") {
                    console.log("Failed");
                    ItemMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        ItemMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), ItemMenuCtrl.currentItem.label, false, undefined, undefined, undefined, undefined, undefined);
                    });
                    if (ItemMenuCtrl.ePage.Entities.Header.Validations != null) {
                        ItemMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(ItemMenuCtrl.currentItem);
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

        Init();
    }

})();