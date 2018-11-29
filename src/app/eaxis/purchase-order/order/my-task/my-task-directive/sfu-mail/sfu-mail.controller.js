(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SfuMailDirectiveController", SfuMailDirectiveController);

    SfuMailDirectiveController.$inject = ["helperService", "apiService", "appConfig", "toastr"];

    function SfuMailDirectiveController(helperService, apiService, appConfig, toastr) {
        var SfuMailDirectiveCtrl = this;

        function Init() {
            SfuMailDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "SFU_Mail",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            InitPoUpload();
            TaskGetById();
        }

        function InitPoUpload() {
            SfuMailDirectiveCtrl.ePage.Masters.MyTask = SfuMailDirectiveCtrl.taskObj;
            SfuMailDirectiveCtrl.ePage.Masters.OnComplete = OnMailSucces;
            if (SfuMailDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof SfuMailDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    SfuMailDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(SfuMailDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }
        }

        function TaskGetById() {
            if (SfuMailDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", appConfig.Entities.CargoReadiness.API.GetOrdersByGroupId.Url + SfuMailDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        SfuMailDirectiveCtrl.ePage.Masters.FollowupDetails = response.data.Response;
                        if (SfuMailDirectiveCtrl.ePage.Masters.FollowupDetails.length > 0) {
                            EmailOpenInput();
                        }
                    } else {
                        SfuMailDirectiveCtrl.ePage.Masters.FollowupDetails = [];
                    }
                });
            }
        }

        function EmailOpenInput() {
            SfuMailDirectiveCtrl.ePage.Masters.Input = {
                "EntityRefKey": SfuMailDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntitySource": "GFU",
                "EntityRefCode": SfuMailDirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                "Communication": null,
                // Parent Entity
                "ParentEntityRefKey": undefined,
                "ParentEntityRefCode": undefined,
                "ParentEntitySource": undefined,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "RowObj": SfuMailDirectiveCtrl.ePage.Masters.FollowupDetails
            }
            var _subject = "Follow-up for PO's of -" + SfuMailDirectiveCtrl.ePage.Masters.FollowupDetails[0].Buyer + " to " + SfuMailDirectiveCtrl.ePage.Masters.FollowupDetails[0].Supplier;
            SfuMailDirectiveCtrl.ePage.Masters.MailObj = {
                Subject: _subject,
                Template: "OrderSummaryReport",
                TemplateObj: {
                    Key: "OrderSummaryReport",
                    Description: "Order Summary Report"
                }
            };
        }

        function OnMailSucces($item) {
            var _input = [];
            SfuMailDirectiveCtrl.ePage.Masters.FollowupDetails.map(function (value, key) {
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
                    UpdateRecords(SfuMailDirectiveCtrl.ePage.Masters.FollowupDetails);
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
        }

        function Complete() {
            var _input = [];
            SfuMailDirectiveCtrl.ePage.Masters.FollowupDetails.map(function (value, key) {
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
                "GroupEntityRefKey": SfuMailDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "UIVesselPlanningDetails": _input
            }
            apiService.post("eAxisAPI", appConfig.Entities.CargoReadiness.API.CompleteFollowUpTask.Url, _filter).then(function (response) {
                if (response.data.Status === "Success") {
                    toastr.success("Successfully mail sent...");
                } else {
                    toastr.error("Task Completion Failed...!");
                }
            });
        }

        Init();
    }
})();