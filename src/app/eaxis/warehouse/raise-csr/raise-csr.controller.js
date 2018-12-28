(function () {
    "use strict";

    angular
        .module("Application")
        .controller("RaiseCSRController", RaiseCSRController);

    RaiseCSRController.$inject = ["$location", "$scope", "APP_CONSTANT", "authService", "apiService", "helperService", "deliveryConfig", "$timeout", "toastr", "appConfig", "$state", "$uibModal", "$window", "dynamicLookupConfig"];

    function RaiseCSRController($location, $scope, APP_CONSTANT, authService, apiService, helperService, deliveryConfig, $timeout, toastr, appConfig, $state, $uibModal, $window, dynamicLookupConfig) {

        var RaiseCSRCtrl = this;
        function Init() {
            RaiseCSRCtrl.ePage = {
                "Title": "",
                "Prefix": "RaiseCSR",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": deliveryConfig.Entities
            };
            RaiseCSRCtrl.ePage.Masters.TabList = [];
            deliveryConfig.TabList = [];
            RaiseCSRCtrl.ePage.Masters.isNewClicked = false;
            RaiseCSRCtrl.ePage.Masters.IsTabClick = false;
            RaiseCSRCtrl.ePage.Masters.IsShowButton = true;
            RaiseCSRCtrl.ePage.Masters.IsDisableSave = false;
            //functions
            RaiseCSRCtrl.ePage.Masters.AddTab = AddTab;
            RaiseCSRCtrl.ePage.Masters.RemoveTab = RemoveTab;
            RaiseCSRCtrl.ePage.Masters.CreateNewDeliveryRequest = CreateNewDeliveryRequest;
            RaiseCSRCtrl.ePage.Masters.CreateNewDelReq = CreateNewDelReq;
            RaiseCSRCtrl.ePage.Masters.Continue = Continue;
            RaiseCSRCtrl.ePage.Masters.GoToMyTask = GoToMyTask;

            RaiseCSRCtrl.ePage.Masters.Validation = Validation;
            RaiseCSRCtrl.ePage.Masters.Config = deliveryConfig;

            deliveryConfig.ValidationFindall();
            //Left Menu
            CreateNewDelReq();
            GetRelatedLookupList();
        }

        function Continue() {
            RaiseCSRCtrl.ePage.Masters.modalInstance.close('close');
        }

        function CreateNewDeliveryRequest() {
            CreateNewDelReq();
            RaiseCSRCtrl.ePage.Masters.modalInstance.close('close');
        }

        function CreateNewDelReq() {
            RaiseCSRCtrl.ePage.Masters.TabList = [];
            RaiseCSRCtrl.ePage.Masters.isNewClicked = true;
            RaiseCSRCtrl.ePage.Masters.Tab = undefined;
            helperService.getFullObjectUsingGetById(appConfig.Entities.WmsDeliveryList.API.GetById.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    var _obj = {
                        entity: response.data.Response.Response.UIWmsDelivery,
                        data: response.data.Response.Response,
                        Validations: response.data.Response.Validations
                    };
                    RaiseCSRCtrl.ePage.Masters.AddTab(_obj, true);
                    RaiseCSRCtrl.ePage.Masters.isNewClicked = false;

                    if (response.data.Response.Response.UIWmsDeliveryLine.length != 0) {
                        RaiseCSRCtrl.ePage.Entities.Header.TableProperties.UIWmsDeliveryLine = response.data.Response.Response.UIWmsDeliveryLine;
                        RaiseCSRCtrl.ePage.Masters.UserHasValue = true;
                    } else {
                        RaiseCSRCtrl.ePage.Masters.UserHasValue = undefined;
                    }

                } else {
                    console.log("Empty New Inward response");
                }
            });
        }

        function GoToMyTask() {
            $window.open("#/EA/my-tasks", "_self");
        }

        function AddTab(currentDelivery, isNew) {
            RaiseCSRCtrl.ePage.Masters.currentDelivery = undefined;

            var _isExist = RaiseCSRCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    return value.label === currentDelivery.entity.WorkOrderID;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                RaiseCSRCtrl.ePage.Masters.IsTabClick = true;
                var _currentDelivery = undefined;
                if (!isNew) {
                    _currentDelivery = currentDelivery.entity;
                } else {
                    _currentDelivery = currentDelivery;
                }

                deliveryConfig.GetTabDetails(_currentDelivery, isNew).then(function (response) {
                    RaiseCSRCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        RaiseCSRCtrl.ePage.Masters.TabList = response;
                        RaiseCSRCtrl.ePage.Masters.Tab = response[response.length - 1];
                    });
                });
            }
        }

        function RemoveTab(event, index, currentDelivery) {
            event.preventDefault();
            event.stopPropagation();
            var currentDelivery = currentDelivery[currentDelivery.label].ePage.Entities;
            RaiseCSRCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            RaiseCSRCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (RaiseCSRCtrl.ePage.Entities.Header.Validations) {
                RaiseCSRCtrl.ePage.Masters.Config.RemoveApiErrors(RaiseCSRCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Saveonly($item);
            } else {
                RaiseCSRCtrl.ePage.Masters.Config.ShowErrorWarningModal($item);
            }
        }

        function Saveonly($item) {
            RaiseCSRCtrl.ePage.Masters.IsShowButton = false;
            RaiseCSRCtrl.ePage.Masters.IsDisableSave = true;
            RaiseCSRCtrl.ePage.Masters.Loading = true;
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.UIWmsDelivery.PK = _input.PK;
                _input.UIWmsDelivery.CreatedDateTime = new Date();
                _input.UIWmsDelivery.WorkOrderType = 'DEL';
                _input.UIWmsWorkorderReport.AcknowledgementDateTime = new Date();
                _input.UIWmsWorkorderReport.AcknowledgedPerson = authService.getUserInfo().UserId;
                _input.UIWmsWorkorderReport.DeliveryRequestedDateTime = new Date();
                _input.UIWmsWorkorderReport.WOD_FK = _input.PK;
                apiService.post("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.Insert.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        $item.isNew = false;
                        RaiseCSRCtrl.ePage.Entities.Header.Data = response.data.Response;
                        $item[$item.label].ePage.Entities.Header.Data = response.data.Response;
                        RaiseCSRCtrl.ePage.Entities.Header.Data.UIWmsDelivery.Consignee = RaiseCSRCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ConsigneeCode + ' - ' + RaiseCSRCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ConsigneeName;                        
                        var _smsInput = {
                            "MobileNo": "8870242130",
                            "Message": "Delivery Request " + RaiseCSRCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderID + " Acknowledged Successfully."
                        }
                        apiService.post("authAPI", appConfig.Entities.Notification.API.SendSms.Url, _smsInput).then(function (response) {
                            
                        });
                        toastr.success("Saved Successfully...!");
                        openModel().result.then(function (response) { }, function () {
                            console.log("Cancelled");
                        });
                    } else {
                        toastr.error("Save Failed...!");
                    }
                    RaiseCSRCtrl.ePage.Masters.IsShowButton = true;
                    RaiseCSRCtrl.ePage.Masters.IsDisableSave = false;
                    RaiseCSRCtrl.ePage.Masters.Loading = false;
                });
            } else {
                $item = filterObjectUpdate($item, "IsModified");
                apiService.post("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.Update.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        $item[$item.label].ePage.Entities.Header.Data = response.data.Response;
                        RaiseCSRCtrl.ePage.Entities.Header.Data = response.data.Response;
                        RaiseCSRCtrl.ePage.Entities.Header.Data.UIWmsDelivery.Consignee = RaiseCSRCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ConsigneeCode + ' - ' + RaiseCSRCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ConsigneeName;
                        toastr.success("Saved Successfully...!");
                        // openModel().result.then(function (response) { }, function () {
                        //     console.log("Cancelled");
                        // });
                    } else {
                        toastr.error("Save Failed...!");
                    }
                    RaiseCSRCtrl.ePage.Masters.IsShowButton = true;
                    RaiseCSRCtrl.ePage.Masters.IsDisableSave = false;
                    RaiseCSRCtrl.ePage.Masters.Loading = false;
                });
            }
        }

        function openModel() {
            return RaiseCSRCtrl.ePage.Masters.modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "success-popup",
                scope: $scope,
                size: "md",
                templateUrl: "app/eaxis/warehouse/raise-csr/raise-csr-popup.html"
            });
        }

        function GetRelatedLookupList() {
            var _filter = {
                Key: "Customer_3321,Site_3322,Warehouse_3323,Product_2845",
                SAP_FK: authService.getUserInfo().AppPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _isEmpty = angular.equals({}, response.data.Response);

                    if (!_isEmpty) {
                        dynamicLookupConfig.Entities = Object.assign({}, dynamicLookupConfig.Entities, response.data.Response);
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