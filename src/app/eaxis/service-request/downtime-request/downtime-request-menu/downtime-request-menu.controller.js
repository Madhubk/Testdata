(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DowntimeRequestMenuController", DowntimeRequestMenuController);

    DowntimeRequestMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "downtimeRequestConfig", "helperService", "appConfig", "authService", "$location", "$state", "toastr", "confirmation", "$uibModal","$filter"];

    function DowntimeRequestMenuController($scope, $timeout, APP_CONSTANT, apiService, downtimeRequestConfig, helperService, appConfig, authService, $location, $state, toastr, confirmation, $uibModal, $filter) {

        var DowntimeRequestMenuCtrl = this

        function Init() {

            var currentDowntimeRequest = DowntimeRequestMenuCtrl.currentDowntimeRequest[DowntimeRequestMenuCtrl.currentDowntimeRequest.label].ePage.Entities;
            console.log(currentDowntimeRequest);

            DowntimeRequestMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "DowntimeRequest_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentDowntimeRequest

            };

            DowntimeRequestMenuCtrl.ePage.Masters.DowntimeRequestMenu = {};
            // Menu list from configuration
            DowntimeRequestMenuCtrl.ePage.Masters.DowntimeRequestMenu.ListSource = DowntimeRequestMenuCtrl.ePage.Entities.Header.Meta.MenuList;
            DowntimeRequestMenuCtrl.ePage.Masters.Validation = Validation;
            DowntimeRequestMenuCtrl.ePage.Masters.GenerateDocuments = GenerateDocuments;
            DowntimeRequestMenuCtrl.ePage.Masters.Config = downtimeRequestConfig;
            DowntimeRequestMenuCtrl.ePage.Masters.Finalize = Finalize;
            DowntimeRequestMenuCtrl.ePage.Masters.CancelDowntimeRequest = CancelDowntimeRequest;


            if (DowntimeRequestMenuCtrl.ePage.Entities.Header.Data.UIDowntimeRequestHeader.WorkOrderStatus == 'FIN' || DowntimeRequestMenuCtrl.ePage.Entities.Header.Data.UIDowntimeRequestHeader.WorkOrderStatus == 'CAN') {
                DowntimeRequestMenuCtrl.ePage.Entities.Header.GlobalVariables.NonEditable = true;
                DowntimeRequestMenuCtrl.ePage.Masters.DisableSave = true;
            }

            DonwloadDocument();
        }

        function Finalize($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;


            if (_errorcount.length == 0) {
                var modalOptions = {
                    closeButtonText: 'No',
                    actionButtonText: 'YES',
                    headerText: 'Once Finalized DowntimeRequest Can Not Be Edited..',
                    bodyText: 'Do You Want To Finalize?'
                };
                confirmation.showModal({}, modalOptions)
                    .then(function (result) {
                        if (_input.UIWmsWorkOrderLine.length > 0) {
                            var mydate = _input.UIWmsWorkOrderLine.some(function (value, key) {
                                if (!value.PK)
                                    return true;
                            })
                            if (mydate) {
                                toastr.info("Please Save Before Finalizing DowntimeRequest");
                            } else {
                                DowntimeRequestMenuCtrl.ePage.Masters.Finalisesave = true;
                                Validation($item);
                            }

                        } else {
                            toastr.info("DowntimeRequest Cannot be finalized without DowntimeRequest Line")
                        }
                    }, function () {
                        console.log("Cancelled");
                    });
            } else {
                DowntimeRequestMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(DowntimeRequestMenuCtrl.currentDowntimeRequest);
            }

        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            DowntimeRequestMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (DowntimeRequestMenuCtrl.ePage.Entities.Header.Validations) {
                DowntimeRequestMenuCtrl.ePage.Masters.Config.RemoveApiErrors(DowntimeRequestMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                DowntimeRequestMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(DowntimeRequestMenuCtrl.currentDowntimeRequest);
                Save($item);
            } else {
                DowntimeRequestMenuCtrl.ePage.Masters.Finalisesave = false;
                DowntimeRequestMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(DowntimeRequestMenuCtrl.currentDowntimeRequest);
            }
        }

        function Save($item) {
            DowntimeRequestMenuCtrl.ePage.Masters.DisableSave = true;
            DowntimeRequestMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;
            //_input.UIDowntimeRequestHeader.PK = _input.PK;
            _input.UIDowntimeRequestHeader.ExternalReference = DowntimeRequestMenuCtrl.ePage.Entities.Header.Data.UIDowntimeRequestHeader.WorkOrderID;
            if ($item.isNew) {
                _input.UIDowntimeRequestHeader.PK = _input.PK;
                _input.UIDowntimeRequestHeader.CreatedDateTime = new Date();
                _input.UIDowntimeRequestHeader.WorkOrderStatus = 'ENT';
                _input.UIDowntimeRequestHeader.WorkOrderStatusDesc = 'Entered';
                _input.UIDowntimeRequestHeader.WorkOrderType = 'ADJ';

            } else {
                if (DowntimeRequestMenuCtrl.ePage.Masters.Finalisesave) {
                    _input.UIDowntimeRequestHeader.FinalisedDate = new Date();
                    _input.UIDowntimeRequestHeader.WorkOrderStatus = 'FIN';
                    _input.UIDowntimeRequestHeader.WorkOrderStatusDesc = 'Finalized';

                    // Line Status
                    angular.forEach(_input.UIWmsWorkOrderLine, function (value, key) {
                        value.WorkOrderLineStatus = 'FIN';
                        value.WorkOrderLineStatusDesc = 'Finalized';
                    });
                }
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'DowntimeRequest').then(function (response) {

                DowntimeRequestMenuCtrl.ePage.Masters.DisableSave = false;
                DowntimeRequestMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;

                if (response.Status === "success") {

                    downtimeRequestConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == DowntimeRequestMenuCtrl.ePage.Entities.Header.Data.UIDowntimeRequestHeader.WorkOrderID) {
                                value.label = DowntimeRequestMenuCtrl.ePage.Entities.Header.Data.UIDowntimeRequestHeader.WorkOrderID;
                                value[DowntimeRequestMenuCtrl.ePage.Entities.Header.Data.UIDowntimeRequestHeader.WorkOrderID] = value.New;
                                delete value.New;
                            }
                        }
                    });

                    var _index = downtimeRequestConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK
                    }).indexOf(DowntimeRequestMenuCtrl.currentDowntimeRequest[DowntimeRequestMenuCtrl.currentDowntimeRequest.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        downtimeRequestConfig.TabList[_index][downtimeRequestConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        downtimeRequestConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/DowntimeRequest") {
                            helperService.refreshGrid();
                        }
                    }
                    console.log("Success");
                    if (DowntimeRequestMenuCtrl.ePage.Entities.Header.Data.UIDowntimeRequestHeader.WorkOrderStatus == 'CAN') {
                        toastr.success("Cancelled Successfully...!")
                    } else {
                        toastr.success("Saved Successfully...!");
                    }

                    if (DowntimeRequestMenuCtrl.ePage.Masters.SaveAndClose) {
                        DowntimeRequestMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                        DowntimeRequestMenuCtrl.ePage.Masters.SaveAndClose = false;
                    }
                    if (DowntimeRequestMenuCtrl.ePage.Masters.Finalisesave || DowntimeRequestMenuCtrl.ePage.Entities.Header.Data.UIDowntimeRequestHeader.WorkOrderStatus == "CAN") {
                        DowntimeRequestMenuCtrl.ePage.Entities.Header.GlobalVariables.NonEditable = true;
                        DowntimeRequestMenuCtrl.ePage.Masters.DisableSave = true;
                    }
                } else if (response.Status === "failed") {
                    DowntimeRequestMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    console.log("Failed");
                    toastr.error("Could not Save...!");
                    angular.forEach(response.Validations, function (value, key) {
                        if (value.RowIndex > 0) {
                            DowntimeRequestMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, DowntimeRequestMenuCtrl.currentDowntimeRequest.label, true, value.RowIndex - 1, value.ColIndex, undefined, undefined, undefined);
                        } else {
                            DowntimeRequestMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, DowntimeRequestMenuCtrl.currentDowntimeRequest.label, false, undefined, undefined, undefined, undefined, undefined);
                        }
                    });
                    angular.forEach(response.Messages, function (value, key) {
                        if (value.Type == "NotUpdated") {
                            toastr.error(value.MessageDesc);
                        }
                    });
                    if (DowntimeRequestMenuCtrl.ePage.Entities.Header.Validations != null) {
                        DowntimeRequestMenuCtrl.ePage.Masters.Finalisesave = false;
                        DowntimeRequestMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(DowntimeRequestMenuCtrl.currentDowntimeRequest);
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

        function CancelDowntimeRequest($item) {
            $uibModal.open({
                templateUrl: 'myModalContent.html',
                controller: function ($scope, $uibModalInstance) {

                    $scope.close = function () {
                        $uibModalInstance.dismiss('cancel');
                    };

                    $scope.ok = function () {
                        var InsertCommentObject = [];
                        var obj = {
                            "Description": "General",
                            "Comments": $scope.comment,
                            "EntityRefKey": DowntimeRequestMenuCtrl.ePage.Entities.Header.Data.UIDowntimeRequestHeader.PK,
                            "EntityRefCode": DowntimeRequestMenuCtrl.ePage.Entities.Header.Data.UIDowntimeRequestHeader.WorkOrderID,
                            "CommentsType": "GEN"
                        }
                        InsertCommentObject.push(obj);
                        apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.Insert.Url, InsertCommentObject).then(function (response) {

                            DowntimeRequestMenuCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.map(function (value, key) {
                                value.TotalUnits = 0;
                            });
                            DowntimeRequestMenuCtrl.ePage.Entities.Header.Data.UIDowntimeRequestHeader.CancelledDate = new Date();
                            DowntimeRequestMenuCtrl.ePage.Entities.Header.Data.UIDowntimeRequestHeader.WorkOrderStatus = 'CAN';
                            DowntimeRequestMenuCtrl.ePage.Entities.Header.Data.UIDowntimeRequestHeader.WorkOrderStatusDesc = 'Cancelled';
                            Validation($item);

                            $uibModalInstance.dismiss('cancel');
                        });
                    }
                }
            });
        }

        function DonwloadDocument(){
            var _filter = {
                "SAP_FK": "c0b3b8d9-2248-44cd-a425-99c85c6c36d8",
                "PageType": "Document",
                "ModuleCode": "WMS",
                "SubModuleCode": "ADJ"
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxMenus.API.MasterFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxMenus.API.MasterFindAll.Url, _input).then(function (response) {
                DowntimeRequestMenuCtrl.ePage.Masters.AllDocumentValues = $filter('orderBy')(response.data.Response,'DisplayOrder');
                DowntimeRequestMenuCtrl.ePage.Masters.AllDocumentValues.map(function(value,key){
                    value.OtherConfig = JSON.parse(value.OtherConfig);
                });
            });
        }

        function GenerateDocuments(item, format) {
            DowntimeRequestMenuCtrl.ePage.Masters.DisableReport = true;

            var obj = item.OtherConfig.ReportTemplate;

            obj.FileType = format;
            obj.JobDocs.EntityRefKey = item.Id;
            obj.JobDocs.EntitySource = 'WMS';
            obj.JobDocs.EntityRefCode = item.Description;
            obj.DataObjs[0].ApiName = obj.DataObjs[0].ApiName + DowntimeRequestMenuCtrl.ePage.Entities.Header.Data.PK;

            apiService.post("eAxisAPI", appConfig.Entities.Export.API.Excel.Url, obj).then(function(response){
                if(response.data.Response.Status=='Success'){
                 apiService.get("eAxisAPI", appConfig.Entities.Communication.API.JobDocument.Url + response.data.Response.PK +"/"+ authService.getUserInfo().AppPK).then(function(response){
                     if (response.data.Response) {
                         if (response.data.Response !== "No Records Found!") {
                             helperService.DownloadDocument(response.data.Response);
                             DowntimeRequestMenuCtrl.ePage.Masters.DisableReport = false;
                         }
                     } else {
                         console.log("Invalid response");
                     }
                 })
                }
             })
        }

        Init();

    }

})();