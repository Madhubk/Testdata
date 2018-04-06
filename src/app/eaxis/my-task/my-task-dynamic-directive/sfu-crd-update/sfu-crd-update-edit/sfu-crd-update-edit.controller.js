(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SfuCRDUpdateEditDirectiveController", SfuCRDUpdateEditDirectiveController);

    SfuCRDUpdateEditDirectiveController.$inject = ["$injector", "helperService"];

    function SfuCRDUpdateEditDirectiveController($injector, helperService) {
        var SfuCRDUpdateEditDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");;

        function Init() {
            SfuCRDUpdateEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "SFU_CRD_Update_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": SfuCRDUpdateEditDirectiveCtrl.entityObj
                    }
                }
            };

            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;
            
            SFUCRDInit();
        }

        function SFUCRDInit() {
            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.TaskObj = SfuCRDUpdateEditDirectiveCtrl.taskObj;
            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.GridLoad = false;
            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.DataChanges = DataChanges;
            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.Complete = Complete;
            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.CRDUpdate = CRDUpdate;
            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.BulkSave = BulkSave;
            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.BulkInput = {};
            // DatePicker
            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.DatePicker = {};
            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            FollowUpOrderGrid();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        

        function FollowUpOrderGrid() {
            apiService.get("eAxisAPI", appConfig.Entities.CargoReadiness.API.GetOrdersByGroupId.Url + SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    response.data.Response.map(function (value, key) {
                        value.status = true;
                    })
                    SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.SfuOrderList = response.data.Response;
                    SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.SelectedOrder = angular.copy(response.data.Response);
                    SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.GridLoad = true;
                } else {
                    SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.SfuOrderList = [];
                }
            });
        }

        function DataChanges(_item) {
            if (_item.item.status) {
                if (SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.SelectedOrder.length > 0) {
                    SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.SelectedOrder.map(function (value, key) {
                        if (value.POH_FK == _item.item.POH_FK) {
                            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.SelectedOrder.push(_item.item);
                        }
                    });
                } else {
                    SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.SelectedOrder.push(_item.item);
                }
            } else {
                SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.SelectedOrder.map(function (value, key) {
                    if (value.POH_FK == _item.item.POH_FK) {
                        SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.SelectedOrder.splice(key, 1);
                    }
                });
            }
        }

        function CRDUpdate() {
            
        }

        function BulkSave() {

        }
        
        function Complete() {
            var _input = [];
            SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.SelectedOrder.map(function (value, key) {
                var _inputData = {
                    "OrderNo": value.OrderNo,
                    "OrderSplitNo": value.OrderSplitNo,
                    "POH_FK": value.POH_FK,
                    "Buyer": value.Buyer,
                    "Supplier": value.Supplier,
                    "FollowUpDetailPK": value.FK
                }
                _input.push(_inputData);
            })
            var _filter = {
                "GroupPK": SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.TaskObj.PK,
                "GroupEntityRefKey": SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "GroupEntitySource": SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                "GroupEntityRefCode": SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.TaskObj.KeyReference,
                "UIVesselPlanningDetails": _input
            }
            apiService.post("eAxisAPI", appConfig.Entities.CargoReadiness.API.CompleteFollowUpTask.Url, _filter).then(function (response) {
                if (response.data.Status === "Success") {
                    toastr.success("Task Completed Successfully...!");
                    var _data = {
                        IsCompleted: true,
                        Item: SfuCRDUpdateEditDirectiveCtrl.ePage.Masters.TaskObj
                    };

                    SfuCRDUpdateEditDirectiveCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
            });
        }

        Init();
    }
})();
