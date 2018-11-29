(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ReceiveAsnVnmDirectiveController", ReceiveAsnVnmDirectiveController);

    ReceiveAsnVnmDirectiveController.$inject = ["helperService", "apiService", "appConfig", "freightApiConfig", "toastr", "confirmation"];

    function ReceiveAsnVnmDirectiveController(helperService, apiService, appConfig, freightApiConfig, toastr, confirmation) {
        var ReceiveAsnVnmDirectiveCtrl = this;

        function Init() {
            ReceiveAsnVnmDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Receive_Asn_Vnm",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            InitPoUpload();
        }

        function InitPoUpload() {
            ReceiveAsnVnmDirectiveCtrl.ePage.Masters.IsMisMatchBtn = "Stock MisMatch";
            ReceiveAsnVnmDirectiveCtrl.ePage.Masters.IsMisMatch = false;
            ReceiveAsnVnmDirectiveCtrl.ePage.Masters.IsNoMisMatchBtn = "No MisMatch";
            ReceiveAsnVnmDirectiveCtrl.ePage.Masters.IsNoMisMatch = false;
            ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask = ReceiveAsnVnmDirectiveCtrl.taskObj;
            ReceiveAsnVnmDirectiveCtrl.ePage.Masters.Approval = Approval;
            ReceiveAsnVnmDirectiveCtrl.ePage.Masters.IsUploaded = IsUploaded;

            if (ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }

            TaskGetById();
            StandardMenuConfig();
        }

        function TaskGetById() {
            if (ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", freightApiConfig.Entities.shipmentlistbuyer.API.getbyid.Url + ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ReceiveAsnVnmDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                    }
                });
            }
        }

        function IsUploaded(_item) {
            if (_item) {
                ReceiveAsnVnmDirectiveCtrl.ePage.Masters.IsDocumentUploaded = true;
            }
        }

        function Approval(type) {
            if (type != undefined || type != "") {
                if (type == "Yes") {
                    var modalOptions = {
                        closeButtonText: 'Cancel',
                        actionButtonText: 'Ok',
                        headerText: 'Close?',
                        bodyText: 'Do you want to modified these document(s)?'
                    };
                    confirmation.showModal({}, modalOptions)
                        .then(function (result) {
                            // Complete("IsMisMatch", "Stock MisMatch");
                        }, function () {
                            console.log("Cancelled");
                        });
                } else {
                    Complete("IsNoMisMatch", "No MisMatch");
                }
            }
        }

        function Complete(btnTxt, btn) {
            ReceiveAsnVnmDirectiveCtrl.ePage.Masters[btnTxt + "Btn"] = "Please wait..";
            ReceiveAsnVnmDirectiveCtrl.ePage.Masters[btnTxt] = true;
            var _input = InputData(ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask, 3);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Task completed succesfully...");
                    ReceiveAsnVnmDirectiveCtrl.ePage.Masters[btnTxt + "Btn"] = btn;
                    ReceiveAsnVnmDirectiveCtrl.ePage.Masters[btnTxt] = false;
                    var _data = {
                        IsRefreshTask: true,
                        IsRefreshStatusCount: true,
                        Item: ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask
                    };
                    ReceiveAsnVnmDirectiveCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task completion failed...");
                }
            });
        }

        function StandardMenuConfig() {
            ReceiveAsnVnmDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "EntityRefKey": ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntityRefCode": ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                "EntitySource": ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.PK,
                "ParentEntityRefCode": ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "ParentEntitySource": ReceiveAsnVnmDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "IsDisableParentEntity": true,
                "IsDisableAdditionalEntity": true
            };
            ReceiveAsnVnmDirectiveCtrl.ePage.Masters.StandardConfigInput = {
                IsDisableRefreshButton: true,
                IsDisableDeleteHistoryButton: true,
                // IsDisableUpload: true,
                IsDisableGenerate: true,
                IsDisableRelatedDocument: true,
                IsDisableCount: true,
                // IsDisableDownloadCount: true,
                // IsDisableAmendCount: true,
                // IsDisableFileName: true,
                // IsDisableEditFileName: true,
                // IsDisableDocumentType: true,
                // IsDisableOwner: true,
                // IsDisableCreatedOn: true,
                // IsDisableShare: true,
                // IsDisableVerticalMenu: true,
                // IsDisableVerticalMenuDownload: true,
                // IsDisableVerticalMenuAmend: true,
                // IsDisableVerticalMenuEmailAttachment: true,
                // IsDisableVerticalMenuRemove: true
            };

            ReceiveAsnVnmDirectiveCtrl.ePage.Masters.CommentConfig = {
                IsDisableRefreshButton: true
            };
        }

        function InputData(_data, CompleteStepNo) {
            var _filterInput = {
                "ProcessName": _data.ProcessName,
                "EntitySource": _data.EntitySource,
                "EntityRefKey": _data.EntityRefKey,
                "KeyReference": _data.KeyReference,
                "CompleteInstanceNo": _data.PSI_InstanceNo,
                "CompleteStepNo": CompleteStepNo,
                "IsModified": true
            };
            return _filterInput;
        }

        Init();
    }
})();