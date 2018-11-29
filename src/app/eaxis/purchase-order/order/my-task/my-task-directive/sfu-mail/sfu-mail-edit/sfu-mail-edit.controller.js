(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SfuMailEditDirectiveController", SfuMailEditDirectiveController);

    SfuMailEditDirectiveController.$inject = ["$injector", "helperService", "apiService", "appConfig", "toastr"];

    function SfuMailEditDirectiveController($injector, helperService, apiService, appConfig, toastr) {
        var SfuMailEditDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            SfuMailEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "SFU_Mail_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": SfuMailEditDirectiveCtrl.entityObj
                    }
                }
            };

            SfuMailEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            SFUMailInit();
        }

        function SFUMailInit() {
            SfuMailEditDirectiveCtrl.ePage.Masters.TaskObj = SfuMailEditDirectiveCtrl.taskObj;
            SfuMailEditDirectiveCtrl.ePage.Masters.GridLoad = false;
            SfuMailEditDirectiveCtrl.ePage.Masters.DataChanges = DataChanges;
            SfuMailEditDirectiveCtrl.ePage.Masters.Complete = Complete;
            SfuMailEditDirectiveCtrl.ePage.Masters.OnComplete = OnMailSucces;

            FollowUpOrderGrid();
            FollowUpMailGrid();
        }

        function EmailOpenInput() {
            SfuMailEditDirectiveCtrl.ePage.Masters.Input = {
                "EntityRefKey": SfuMailEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntitySource": "GFU",
                "EntityRefCode": SfuMailEditDirectiveCtrl.ePage.Masters.TaskObj.KeyReference,
                "Communication": null,
                // Parent Entity
                "ParentEntityRefKey": undefined,
                "ParentEntityRefCode": undefined,
                "ParentEntitySource": undefined,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "RowObj": SfuMailEditDirectiveCtrl.ePage.Masters.SelectedOrder
            }
            var _subject = "Follow-up for PO's of -" + SfuMailEditDirectiveCtrl.ePage.Masters.SelectedOrder[0].Buyer + " to " + SfuMailEditDirectiveCtrl.ePage.Masters.SelectedOrder[0].Supplier;
            SfuMailEditDirectiveCtrl.ePage.Masters.MailObj = {
                Subject: _subject,
                Template: "OrderSummaryReport",
                TemplateObj: {
                    Key: "OrderSummaryReport",
                    Description: "Order Summary Report"
                }
            };
        }

        function FollowUpOrderGrid() {
            apiService.get("eAxisAPI", appConfig.Entities.CargoReadiness.API.GetOrdersByGroupId.Url + SfuMailEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    response.data.Response.map(function (value, key) {
                        value.status = true;
                    });
                    SfuMailEditDirectiveCtrl.ePage.Masters.SfuOrderList = response.data.Response;
                    SfuMailEditDirectiveCtrl.ePage.Masters.SelectedOrder = angular.copy(response.data.Response);
                    SfuMailEditDirectiveCtrl.ePage.Masters.GridLoad = true;
                    if (SfuMailEditDirectiveCtrl.ePage.Masters.SelectedOrder.length > 0) {
                        EmailOpenInput();
                    }
                } else {
                    SfuMailEditDirectiveCtrl.ePage.Masters.SfuOrderList = [];
                }
            });
        }

        function DataChanges(_item) {
            if (_item.item.status) {
                SfuMailEditDirectiveCtrl.ePage.Masters.SelectedOrder.push(_item.item);
            } else {
                SfuMailEditDirectiveCtrl.ePage.Masters.SelectedOrder.map(function (value, key) {
                    if (value.POH_FK == _item.item.POH_FK) {
                        SfuMailEditDirectiveCtrl.ePage.Masters.SelectedOrder.splice(key, 1);
                    }
                });
            }
        }

        function FollowUpMailGrid() {
            var _filter = {
                "EntitySource": "GFU",
                "EntityRefKey": SfuMailEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobEmail.API.FindAll.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.JobEmail.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    SfuMailEditDirectiveCtrl.ePage.Masters.MailHistory = response.data.Response;
                } else {
                    SfuMailEditDirectiveCtrl.ePage.Masters.MailHistory = [];
                }
            });
        }

        function Complete() {
            var _input = [];
            SfuMailEditDirectiveCtrl.ePage.Masters.SelectedOrder.map(function (value, key) {
                var _inputData = {
                    "OrderNo": value.OrderNo,
                    "OrderSplitNo": value.OrderSplitNo,
                    "POH_FK": value.POH_FK,
                    "Buyer": value.Buyer,
                    "Supplier": value.Supplier,
                    "FollowUpDetailPK": value.Id
                }
                _input.push(_inputData);
            });
            var _filter = {
                "GroupEntityRefKey": SfuMailEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "UIVesselPlanningDetails": _input
            }
            apiService.post("eAxisAPI", appConfig.Entities.CargoReadiness.API.CompleteFollowUpTask.Url, _filter).then(function (response) {
                if (response.data.Status === "Success") {
                    // toastr.success("Task Completed Successfully...!");
                    // var _data = {
                    //     IsCompleted: true,
                    //     Item: SfuMailEditDirectiveCtrl.ePage.Masters.TaskObj
                    // };

                    // SfuMailEditDirectiveCtrl.onComplete({
                    //     $item: _data
                    // });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
            });
        }

        function OnMailSucces($item) {
            var _input = [];
            SfuMailEditDirectiveCtrl.ePage.Masters.SelectedOrder.map(function (value, key) {
                var _updateInput = {
                    "EntityRefPK": value.Id,
                    "Properties": [{
                        "PropertyName": "SFU_IsFollowUpSent",
                        "PropertyNewValue": true
                    }]
                };
                _input.push(_updateInput);
            });

            apiService.post('eAxisAPI', appConfig.Entities.CargoReadiness.API.UpdateRecords.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Successfully saved...");
                    UpdateRecords(SfuMailEditDirectiveCtrl.ePage.Masters.SelectedOrder);
                } else {
                    toastr.error("Save Failed...")
                }
            });
        }

        function UpdateRecords(_items) {
            var _updateInput = [];
            for (i = 0; i < _items.length; i++) {
                var _tempObj = {
                    "EntityRefPK": _items[i].POH_FK,
                    "Properties": [{
                        "PropertyName": "POH_OrderStatus",
                        "PropertyNewValue": "FLS"
                    }]
                };
                _updateInput.push(_tempObj);
            }
            apiService.post('eAxisAPI', appConfig.Entities.PorOrderHeader.API.UpdateRecords.Url, _updateInput).then(function (response) {
                if (response.data.Response) {
                    // toastr.success("Successfully saved...");
                } else {
                    toastr.error("Save Failed...")
                }
            });
            Complete();
            FollowUpMailGrid();
        }

        Init();
    }
})();