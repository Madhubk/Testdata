(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AsnrequestController", AsnrequestController);

    AsnrequestController.$inject = ["$location", "$scope", "APP_CONSTANT", "authService", "apiService", "helperService", "asnrequestConfig", "$timeout", "toastr", "appConfig", "$state", "$uibModal", "$window"];

    function AsnrequestController($location, $scope, APP_CONSTANT, authService, apiService, helperService, asnrequestConfig, $timeout, toastr, appConfig, $state, $uibModal, $window) {

        var AsnrequestCtrl = this;
        function Init() {
            AsnrequestCtrl.ePage = {
                "Title": "",
                "Prefix": "Asnrequest ",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": asnrequestConfig.Entities
            };
            AsnrequestCtrl.ePage.Masters.TabList = [];
            AsnrequestCtrl.ePage.Masters.isNewClicked = false;
            AsnrequestCtrl.ePage.Masters.IsTabClick = false;
            AsnrequestCtrl.ePage.Masters.SaveButtonText = "Save";
            AsnrequestCtrl.ePage.Masters.IsDisableSave = false;
            //functions
            AsnrequestCtrl.ePage.Masters.AddTab = AddTab;
            AsnrequestCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            AsnrequestCtrl.ePage.Masters.RemoveTab = RemoveTab;
            AsnrequestCtrl.ePage.Masters.CreateNewAsnRequest = CreateNewAsnRequest;
            AsnrequestCtrl.ePage.Masters.CreateNewAsnrequest = CreateNewAsnrequest;
            AsnrequestCtrl.ePage.Masters.GoToMyTask = GoToMyTask;

            AsnrequestCtrl.ePage.Masters.StandardMenuInput = appConfig.Entities.standardMenuConfigList.WarehouseInward;
            AsnrequestCtrl.ePage.Masters.StandardMenuInput.obj = AsnrequestCtrl.currentAsnrequest;
            AsnrequestCtrl.ePage.Masters.Validation = Validation;
            AsnrequestCtrl.ePage.Masters.Config = asnrequestConfig;

            asnrequestConfig.ValidationFindall();
            //Left Menu
            CreateNewAsnrequest();
        }

        function CreateNewAsnRequest() {
            AsnrequestCtrl.ePage.Masters.modalInstance.close('close');
            CreateNewAsnrequest();
        }


        function CreateNewAsnrequest() {
            AsnrequestCtrl.ePage.Masters.isNewClicked = true;
            helperService.getFullObjectUsingGetById(AsnrequestCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    var _obj = {
                        entity: response.data.Response.Response.UIWmsInwardHeader,
                        data: response.data.Response.Response,
                        Validations: response.data.Response.Validations
                    };
                    AsnrequestCtrl.ePage.Masters.AddTab(_obj, true);
                    AsnrequestCtrl.ePage.Masters.isNewClicked = false;
                } else {
                    console.log("Empty New Inward response");
                }
            });
        }

        function GoToMyTask() {
            $window.open("#/EA/home/my-task", "_self");
        }

        function AddTab(currentAsnrequest, isNew) {
            AsnrequestCtrl.ePage.Masters.currentAsnrequest = undefined;

            var _isExist = AsnrequestCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    return value.label === currentAsnrequest.entity.WorkOrderID;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                AsnrequestCtrl.ePage.Masters.IsTabClick = true;
                var _currentAsnrequest = undefined;
                if (!isNew) {
                    _currentAsnrequest = currentAsnrequest.entity;
                } else {
                    _currentAsnrequest = currentAsnrequest;
                }

                asnrequestConfig.GetTabDetails(_currentAsnrequest, isNew).then(function (response) {
                    AsnrequestCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        AsnrequestCtrl.ePage.Masters.activeTabIndex = AsnrequestCtrl.ePage.Masters.TabList.length - 1;
                        AsnrequestCtrl.ePage.Masters.CurrentActiveTab(currentAsnrequest.entity.WorkOrderID);
                        AsnrequestCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            }
        }

        function CurrentActiveTab(currentTab) {

            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity;
            } else {
                currentTab = currentTab;
            }
            AsnrequestCtrl.ePage.Masters.currentAsnrequest = currentTab;

            //  Standard Menu Configuration and Data
            AsnrequestCtrl.ePage.Masters.TabList.map(function (value, key) {
                if (value.label === AsnrequestCtrl.ePage.Masters.currentAsnrequest) {
                    AsnrequestCtrl.ePage.Masters.StandardMenuInput = appConfig.Entities.standardMenuConfigList.WarehouseInward;
                    AsnrequestCtrl.ePage.Masters.StandardMenuInput.obj = value;
                }
            });
        }


        function RemoveTab(event, index, currentAsnrequest) {
            event.preventDefault();
            event.stopPropagation();
            var currentAsnrequest = currentAsnrequest[currentAsnrequest.label].ePage.Entities;
            AsnrequestCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            AsnrequestCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (AsnrequestCtrl.ePage.Entities.Header.Validations) {
                AsnrequestCtrl.ePage.Masters.Config.RemoveApiErrors(AsnrequestCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Saveonly($item);
            } else {
                AsnrequestCtrl.ePage.Masters.Config.ShowErrorWarningModal($item);
            }
        }

        function Saveonly($item) {

            AsnrequestCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            AsnrequestCtrl.ePage.Masters.IsDisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.UIWmsInwardHeader.PK = _input.PK;
                _input.UIWmsInwardHeader.CreatedDateTime = new Date();
                _input.UIWmsInwardHeader.WorkOrderStatus = 'ENT';
                _input.UIWmsInwardHeader.WorkOrderStatusDesc = 'Entered';
                _input.UIWmsInwardHeader.WorkOrderSubType = 'REC';
                _input.UIWmsInwardHeader.WorkOrderType = 'INW';
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }
            var _inputObj = {
                "PK": _input.UIWmsInwardHeader.PK,
                "UIWmsInwardHeader": _input.UIWmsInwardHeader,
                "ProcessName": "ASN Inward Request",
                "InstanceNo": "",
                "InstanceStatus": "",
                "InstanceStepNo": "1",
                "Action": "Initiate"
            }

            apiService.post("eAxisAPI", AsnrequestCtrl.ePage.Entities.Header.API.UpdateInwardProcess.Url, _inputObj).then(function (response) {
                if (response.data.Status === "Success") {
                    AsnrequestCtrl.ePage.Masters.ProcessInfo = response.data.Response;
                    $item.isNew = false;
                    openModel().result.then(function (response) { }, function () {
                        console.log("Cancelled");
                    });
                } else {
                    toastr.error("ASN Inward Request Initiation Failed.")
                }
            });
            AsnrequestCtrl.ePage.Masters.SaveButtonText = "Save";
            AsnrequestCtrl.ePage.Masters.IsDisableSave = false;
        }
        function openModel() {
            return AsnrequestCtrl.ePage.Masters.modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "success-popup",
                scope: $scope,
                size: "md",
                templateUrl: "app/eaxis/warehouse/asn-request/asnrequest-popup.html"
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