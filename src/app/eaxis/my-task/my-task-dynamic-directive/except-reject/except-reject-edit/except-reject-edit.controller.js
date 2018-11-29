(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExceptRejectEditDirectiveController", ExceptRejectEditDirectiveController);

    ExceptRejectEditDirectiveController.$inject = ["$q", "$scope", "$uibModal", "$injector", "helperService", "apiService", "appConfig", "toastr", "APP_CONSTANT"];

    function ExceptRejectEditDirectiveController($q, $scope, $uibModal, $injector, helperService, apiService, appConfig, toastr, APP_CONSTANT) {
        var ExceptRejectEditDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            ExceptRejectEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Exception_Reject_Edit_Task",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": ExceptRejectEditDirectiveCtrl.entityObj
                    }
                }
            };

            ExceptRejectEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            ExceptionRejectInit();
        }

        function ExceptionRejectInit() {
            ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj = ExceptRejectEditDirectiveCtrl.taskObj;
            ExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData = {};
            ExceptRejectEditDirectiveCtrl.ePage.Masters.Exception = {};
            ExceptRejectEditDirectiveCtrl.ePage.Masters.SendForApproval = SendForApproval;
            ExceptRejectEditDirectiveCtrl.ePage.Masters.CommentHistory = CommentHistory;
            ExceptRejectEditDirectiveCtrl.ePage.Masters.IsApproval = false;
            ExceptRejectEditDirectiveCtrl.ePage.Masters.IsApprovalTxt = "Send for Approval";
            // DatePicker
            ExceptRejectEditDirectiveCtrl.ePage.Masters.DatePicker = {};
            ExceptRejectEditDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ExceptRejectEditDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            ExceptRejectEditDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            if (ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj) {
                TaskGetById();
            }
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ExceptRejectEditDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function TaskGetById() {
            apiService.get("eAxisAPI", appConfig.Entities.JobException.API.GetById.Url + ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData = response.data.Response;
                    if (typeof response.data.Response.RelatedDetails == "string") {
                        ExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails = JSON.parse(ExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails);
                    } else {
                        ExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails = {};
                    }
                    GetDetails(response.data.Response);
                    GetConfigDetails(response.data.Response);
                } else {
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails = {};
                }
            });
        }

        function GetDetails(_inputData) {
            if (_inputData.EntitySource) {
                switch (_inputData.EntitySource) {
                    case "POH":
                        GetOrderDetails(_inputData);
                        break;
                    case "SHP":
                        GetShipmentDetails(_inputData);
                        break;
                    case "CNT":
                        GetContainerDetails(_inputData);
                        break;
                    case "BKG":
                        GetShipmentDetails(_inputData);
                        break;
                    default:
                        break;
                }
            }
        }

        function GetOrderDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.OrderList.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.UIPorOrderHeader = response.data.Response.UIPorOrderHeader;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.SourceNo = response.data.Response.UIPorOrderHeader.OrderNo;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.ContainerMode = response.data.Response.UIPorOrderHeader.ContainerMode;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Buyer = response.data.Response.UIPorOrderHeader.BuyerName;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Shipper = response.data.Response.UIPorOrderHeader.SupplierName;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.TransportMode = response.data.Response.UIPorOrderHeader.TransportMode;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.IncoTerm = response.data.Response.UIPorOrderHeader.IncoTerm;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Origin = response.data.Response.UIPorOrderHeader.PortOfLoading;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Destination = response.data.Response.UIPorOrderHeader.PortOfDischarge;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Carrier = response.data.Response.UIPorOrderHeader.PlannedCarrier;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Voyage = response.data.Response.UIPorOrderHeader.PlannedVoyage;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Vessel = response.data.Response.UIPorOrderHeader.PlannedVessel;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.ETD = response.data.Response.UIPorOrderHeader.PlannedETD;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.ETA = response.data.Response.UIPorOrderHeader.PlannedETA;
                }
            });
        }

        function GetShipmentDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.UIShipmentHeader = response.data.Response.UIShipmentHeader;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.SourceNo = response.data.Response.UIShipmentHeader.ShipmentNo;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.ContainerMode = response.data.Response.UIShipmentHeader.ContainerMode;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Buyer = response.data.Response.UIShipmentHeader.ConsigneeName;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Shipper = response.data.Response.UIShipmentHeader.ShipperName;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.TransportMode = response.data.Response.UIShipmentHeader.TransportMode;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.IncoTerm = response.data.Response.UIShipmentHeader.IncoTerm;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Origin = response.data.Response.UIShipmentHeader.Origin;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Destination = response.data.Response.UIShipmentHeader.Destination;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Carrier = response.data.Response.UIShipmentHeader.PlannedCarrier;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Voyage = response.data.Response.UIShipmentHeader.PlannedVoyage;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Vessel = response.data.Response.UIShipmentHeader.PlannedVessel;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.ETD = response.data.Response.UIShipmentHeader.PlannedETD;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.ETA = response.data.Response.UIShipmentHeader.PlannedETA;
                }
            });
        }

        function GetContainerDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.CntContainerList.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.UICntContainer = response.data.Response.UICntContainer;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.SourceNo = response.data.Response.UICntContainer.ContainerNo;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.ContainerMode = response.data.Response.UICntContainer.ContainerMode;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Buyer = response.data.Response.UICntContainer.ORG_Consignee_Code;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Shipper = response.data.Response.UICntContainer.ORG_Consignor_Code;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.TransportMode = response.data.Response.UICntContainer.TransportMode;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.IncoTerm = response.data.Response.UICntContainer.IncoTerm;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Origin = response.data.Response.UICntContainer.Origin;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Destination = response.data.Response.UICntContainer.Destination;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Carrier = response.data.Response.UICntContainer.Carrier;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Voyage = response.data.Response.UICntContainer.Voyage;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Vessel = response.data.Response.UICntContainer.Vessel;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.ETD = response.data.Response.UICntContainer.ETD;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.ETA = response.data.Response.UICntContainer.ETA;
                }
            });
        }

        function SendForApproval() {
            ExceptRejectEditDirectiveCtrl.ePage.Masters.IsApproval = true;
            ExceptRejectEditDirectiveCtrl.ePage.Masters.IsApprovalTxt = "Please wait...";
            var _input = {
                "PK": ExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.PK,
                "EntityRefKey": ExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefKey,
                "EntitySource": ExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.EntitySource,
                "EntityRefCode": ExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefCode,
                "RelatedDetails": JSON.stringify(ExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails),
                "IsModified": true
            };

            apiService.post('eAxisAPI', appConfig.Entities.JobException.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (ExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionComments) {
                        JobCommentInsert().then(function (response) {
                            if (response.data.Status == "Success") {
                                Complete();
                            } else {
                                toastr.error("Failed...");
                                ExceptRejectEditDirectiveCtrl.ePage.Masters.IsApproval = false;
                                ExceptRejectEditDirectiveCtrl.ePage.Masters.IsApprovalTxt = "Send for Approval";
                            }
                        });
                    } else {
                        Complete();
                    }
                } else {
                    toastr.error("Exception approval failed...");
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.IsApproval = false;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.IsApprovalTxt = "Send for Approval";
                }
            });
        }

        function JobCommentInsert() {
            var deferred = $q.defer();
            var _jobCommentsInput = {
                "PK": "",
                "EntityRefKey": ExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefKey,
                "EntitySource": ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                "Comments": ExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionComments
            }
            // job comments api call
            apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.Insert.Url, [_jobCommentsInput]).then(function (response) {
                if (response.data.Response) {
                    deferred.resolve(response);
                } else {
                    toastr.error("Save Failed...");
                    deferred.reject('failed');
                }
            });
            return deferred.promise;
        }

        function Complete() {
            var _input = InputData(ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj, 4);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.IsApproval = false;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.IsApprovalTxt = "Send for Approval";
                    var _data = {
                        IsCompleted: true,
                        Item: ExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj
                    };
                    toastr.success("Exception approved succesfully...");
                    ExceptRejectEditDirectiveCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.IsApproval = false;
                    ExceptRejectEditDirectiveCtrl.ePage.Masters.IsApprovalTxt = "Send for Approval";
                    toastr.error("Exception approval failed...");
                }
            });
        }

        function CommentHistory() {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "comments-template",
                scope: $scope,
                // size : "sm",
                templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/except-reject/except-reject-comments-modal/except-reject-comments-modal.html",
                controller: 'CommentsHisModalController',
                controllerAs: "CommentsHisModalCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "BulkInput": ExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {},
                function (response) {}
            );
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

        function GetConfigDetails(_dataConfig) {
            var _filter = {
                "DataEntryName": _dataConfig.CustomFormName
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEntry.API.FindConfig.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.DataEntry.API.FindConfig.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (typeof response.data.Response == "object") {
                        var _isEmpty = angular.equals({}, response.data.Response);
                        if (!_isEmpty) {
                            ExceptRejectEditDirectiveCtrl.ePage.Masters.Exception.DataConfigResponseTemp = angular.copy(response.data.Response);
                            ExceptRejectEditDirectiveCtrl.ePage.Masters.Exception.DataConfigResponse = response.data.Response;
                            if (_dataConfig.RelatedDetails) {
                                ExceptRejectEditDirectiveCtrl.ePage.Masters.Exception.DataConfigResponse.Entities = JSON.parse(_dataConfig.RelatedDetails);
                            }
                        }
                    }
                }
            });
        }

        Init();
    }
})();
