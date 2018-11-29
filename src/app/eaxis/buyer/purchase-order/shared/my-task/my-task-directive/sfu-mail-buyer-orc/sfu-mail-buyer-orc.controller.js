(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SfuMailBuyerOrcDirectiveController", SfuMailBuyerOrcDirectiveController);

    SfuMailBuyerOrcDirectiveController.$inject = ["$q", "helperService", "apiService", "appConfig", "toastr"];

    function SfuMailBuyerOrcDirectiveController($q, helperService, apiService, appConfig, toastr) {
        var SfuMailBuyerOrcDirectiveCtrl = this;

        function Init() {
            SfuMailBuyerOrcDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "SFU_Mail",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {
                            "UIOrderList": []
                        }
                    }
                }
            };

            InitPoUpload();
            TaskGetById();
        }

        function InitPoUpload() {
            SfuMailBuyerOrcDirectiveCtrl.ePage.Masters.MyTask = SfuMailBuyerOrcDirectiveCtrl.taskObj;
            SfuMailBuyerOrcDirectiveCtrl.ePage.Masters.OnComplete = UpdateRecords;
            if (SfuMailBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof SfuMailBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    SfuMailBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(SfuMailBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }
        }

        function TaskGetById() {
            if (SfuMailBuyerOrcDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", appConfig.Entities.BuyerOrder.API["1_1_listgetbyid"].Url + SfuMailBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        response.data.Response.UIOrderList = SfuMailBuyerOrcDirectiveCtrl.ePage.Entities.Header.Data.UIOrderList;
                        response.data.Response.UIOrderList.push(response.data.Response.UIOrder_Buyer);
                        SfuMailBuyerOrcDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                        if (SfuMailBuyerOrcDirectiveCtrl.ePage.Entities.Header.Data.UIOrderList.length > 0) {
                            EmailOpenInput();
                        }
                    }
                });
            }
        }

        function EmailOpenInput() {
            SfuMailBuyerOrcDirectiveCtrl.ePage.Masters.Input = {
                "EntityRefKey": SfuMailBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntitySource": "SFU",
                "EntityRefCode": SfuMailBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                "Communication": null,
                // Parent Entity
                "ParentEntityRefKey": undefined,
                "ParentEntityRefCode": undefined,
                "ParentEntitySource": undefined,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "RowObj": SfuMailBuyerOrcDirectiveCtrl.ePage.Entities.Header.Data.UIOrderList
            }
            var _subject = "Follow-up for PO's of -" + SfuMailBuyerOrcDirectiveCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.Buyer + " to " + SfuMailBuyerOrcDirectiveCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.Supplier;
            SfuMailBuyerOrcDirectiveCtrl.ePage.Masters.MailObj = {
                Subject: _subject,
                Template: "OrderSummaryReport",
                TemplateObj: {
                    Key: "OrderSummaryReport",
                    Description: "Order Summary Report"
                }
            };
        }

        function UpdateRecords() {
            var _updateInput = [];
            var _tempObj = {
                "EntityRefPK": SfuMailBuyerOrcDirectiveCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.PK,
                "Properties": [{
                        "PropertyName": "POH_FollowUpSentDate",
                        "PropertyNewValue": new Date()
                    },
                    {
                        "PropertyName": "POH_IsFollowUpMailSent",
                        "PropertyNewValue": true
                    }, {
                        "PropertyName": "POH_OrderStatus",
                        "PropertyNewValue": "FLS"
                    }
                ]
            };
            _updateInput.push(_tempObj);
            apiService.post('eAxisAPI', appConfig.Entities.BuyerOrder.API.updaterecords.Url, _updateInput).then(function (response) {
                if (response.data.Response) {
                    CrdTaskActive(response.data.Response).then(function (response) {
                        if (response.data.Status == "Success") {
                            toastr.success("Mail sent successfully...");
                        } else {
                            toastr.error("Save failed...");
                        }
                    });
                } else {
                    toastr.error("Save Failed...");
                }
            });
        }

        function CrdTaskActive() {
            var deferred = $q.defer();
            var _inputObj = {
                "EntityRefCode": SfuMailBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.EntityRefCode,
                "EntityRefKey": SfuMailBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                // "EntitySource": SfuMailBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                // "CompleteInstanceNo": SfuMailBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo,
                // "CompleteStepNo": SfuMailBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.WSI_StepNo
            }
            apiService.post('eAxisAPI', appConfig.Entities.BuyerOrder.API.activatecrd.Url, _inputObj).then(function (response) {
                if (response.data.Response) {
                    deferred.resolve(response);
                } else {
                    deferred.reject('failed');
                }
            });
            return deferred.promise;
        }

        Init();
    }
})();