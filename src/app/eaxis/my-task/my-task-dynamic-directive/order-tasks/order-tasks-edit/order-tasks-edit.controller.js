(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrderTasksEditDirectiveController", OrderTasksEditDirectiveController);

    OrderTasksEditDirectiveController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr"];

    function OrderTasksEditDirectiveController($scope, $timeout, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr) {
        var OrderTasksEditDirectiveCtrl = this;

        function Init() {
            OrderTasksEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "MyTask_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            OrderTasksEditDirectiveCtrl.ePage.Masters.TaskObj = OrderTasksEditDirectiveCtrl.taskObj;
            OrderTasksEditDirectiveCtrl.ePage.Masters.EntityObj = OrderTasksEditDirectiveCtrl.entityObj;
            OrderTasksEditDirectiveCtrl.ePage.Masters.Save = Save;
            OrderTasksEditDirectiveCtrl.ePage.Masters.Complete = Complete;

            OrderTasksEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
            OrderTasksEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
            OrderTasksEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            OrderTasksEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Complete";

            if (!OrderTasksEditDirectiveCtrl.ePage.Masters.EntityObj) {
                GetEntityObj();
            } else {
                StandardMenuConfig();
                GetMasterDropdownList();
            }
        }

        function StandardMenuConfig() {
            OrderTasksEditDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                "keyObject": "UIShipmentHeader",
                "keyObjectNo": "ShipmentNo",
                "entity": "Shipment",
                "entitySource": "SHP",
                "obj": {
                    [OrderTasksEditDirectiveCtrl.ePage.Masters.TaskObj.KeyReference]: {
                        ePage: {
                            Entities: {
                                Header: {
                                    Data: OrderTasksEditDirectiveCtrl.ePage.Masters.EntityObj
                                }
                            }
                        }
                    },
                    label: OrderTasksEditDirectiveCtrl.ePage.Masters.TaskObj.KeyReference
                }
            };
        }

        function GetEntityObj() {
            if (OrderTasksEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey && OrderTasksEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource == "SHP") {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + OrderTasksEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        OrderTasksEditDirectiveCtrl.ePage.Masters.EntityObj = response.data.Response;

                        StandardMenuConfig();
                        GetMasterDropdownList();
                    } else {
                        console.log("Empty New Shipment response");
                    }
                });
            }
        }

        function GetMasterDropdownList() {
            var typeCodeList = ["TRANSTYPE", "CNTTYPE"];
            var dynamicFindAllInput = [];
            OrderTasksEditDirectiveCtrl.ePage.Masters.DropDownMasterList = {};

            typeCodeList.map(function (value, key) {
                dynamicFindAllInput[key] = {
                    "FieldName": "TypeCode",
                    "value": value
                }
            });
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": appConfig.Entities.CfxTypes.API.DynamicFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.DynamicFindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    typeCodeList.map(function (value, key) {
                        OrderTasksEditDirectiveCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        OrderTasksEditDirectiveCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function Save() {
            OrderTasksEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = true;
            OrderTasksEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            var _input = angular.copy(OrderTasksEditDirectiveCtrl.ePage.Masters.EntityObj);
            _input.UIShipmentHeader.IsModified = true;

            apiService.post("eAxisAPI", appConfig.Entities.ShipmentList.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }

                OrderTasksEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
                OrderTasksEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
            });
        }

        function Complete() {
            OrderTasksEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            OrderTasksEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";

            // var _input = angular.copy(OrderTasksEditDirectiveCtrl.ePage.Masters.EntityObj);
            // _input.UIShipmentHeader.IsModified = true;

            // apiService.post("eAxisAPI", appConfig.Entities.ShipmentList.API.Update.Url, _input).then(function (response) {
            //     if (response.data.Response) {
            //         toastr.success("Saved Successfully...!");
            //     } else {
            //         toastr.error("Save Failed...!");
            //     }

            //     OrderTasksEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            //     OrderTasksEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Complete";
            // });
        }

        Init();
    }
})();
