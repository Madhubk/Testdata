(function () {
    "use strict";

    angular
        .module("Application")
        .controller("supplierFollowUpDirectiveController", SupplierFollowUpDirectiveController);

    SupplierFollowUpDirectiveController.$inject = ["$scope", "$injector", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "toastr", "$uibModal", "orderConfig", "$window"];

    function SupplierFollowUpDirectiveController($scope, $injector, $timeout, APP_CONSTANT, authService, apiService, appConfig, helperService, toastr, $uibModal, orderConfig, $window) {
        var SupplierFollowUpDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            SupplierFollowUpDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "SupplierFollowUp",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": orderConfig.Entities
            };

            InitFollowUp();
        }

        function InitFollowUp() {
            SupplierFollowUpDirectiveCtrl.ePage.Masters.ViewType = 1;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.IsDisableSave = false;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.IsDisableSend = false;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.FilterInput = {};
            SupplierFollowUpDirectiveCtrl.ePage.Masters.BulkInput = {};
            SupplierFollowUpDirectiveCtrl.ePage.Masters.ViewPart = false;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.spinner = false;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.NotFollowedUpCount = 0;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.OrderFollowedUpCount = 0;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.IsGroupDisable = false;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.UserProfile = {
                "userName": authService.getUserInfo().UserName,
                "userId": authService.getUserInfo().UserId,
                "partyList": authService.getUserInfo().PartyList
            };
            SupplierFollowUpDirectiveCtrl.ePage.Masters.dynamicPopover = {
                templateUrl: 'app/eaxis/purchase-order/sfu-directive/pop-over-bulk-upload-template.html'
            };

            InitFollowUpFun();
            InitGetDate();
            // InitChart();
            InitFollowUpCall();
            InitDatePicker();
            GetRelatedLookupList();
        }

        function InitFollowUpFun() {
            SupplierFollowUpDirectiveCtrl.ePage.Masters.SaveCargoReadyDate = SaveCargoReadyDate;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.Filter = Filter;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.OpenFilter = OpenFilter;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.CloseFilter = CloseFilter;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.Clear = Clear;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.CargoReadyDateGridReload = CargoReadyDateGridReload;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.SendFollwUpGridReload = SendFollwUpGridReload;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.AllPendingGridReload = AllPendingGridReload;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.DataChanges = DataChanges;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.SingleRecordView = SingleRecordView;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.BulkSave = BulkSave;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectedPages = SelectedPages;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.FollowUpHistoryCall = FollowUpHistoryCall;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.ProcessActiveCall = ProcessActiveCall;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.OnComplete = OnMailSuccess;

            $scope.$watch('SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList', function (newValue, oldValue) {
                SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList = newValue;
                if (SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList.length > 0) {
                    EmailOpenInput();
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.IsDisableSend = true;
                } else {
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.IsDisableSend = false;
                }

            }, true);

            if (SupplierFollowUpDirectiveCtrl.entity) {
                if (SupplierFollowUpDirectiveCtrl.entity === "Cargo Ready Date") {
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.filter = SupplierFollowUpDirectiveCtrl.filter;
                    FolowUpGridDetails(SupplierFollowUpDirectiveCtrl.filter);
                } else if (SupplierFollowUpDirectiveCtrl.entity === "Send FollowUp") {
                    FolowUpGridDetails(SupplierFollowUpDirectiveCtrl.filter);
                }
            }
        }

        function InitGetDate() {
            SupplierFollowUpDirectiveCtrl.ePage.Masters.ThisWeekStart = helperService.DateFilter('@@@ThisWeek_From');
            SupplierFollowUpDirectiveCtrl.ePage.Masters.ThisWeekEnd = helperService.DateFilter('@@@ThisWeek_To');
            SupplierFollowUpDirectiveCtrl.ePage.Masters.LastWeekStart = helperService.DateFilter('@@@LastWeek_From');
            SupplierFollowUpDirectiveCtrl.ePage.Masters.LastWeekEnd = helperService.DateFilter('@@@LastWeek_To');
            SupplierFollowUpDirectiveCtrl.ePage.Masters.ThisMonthStart = helperService.DateFilter('@@@ThisMonth_From');
            SupplierFollowUpDirectiveCtrl.ePage.Masters.ThisMonthEnd = helperService.DateFilter('@@@ThisMonth_To');
            SupplierFollowUpDirectiveCtrl.ePage.Masters.Today = helperService.DateFilter('@@@Today');
        }

        function InitFollowUpCall() {
            NotFollowedUpCountCall();
            AllPendingOrderCountCall();
            OrderFollowedUpCountCall();
        }

        function InitDatePicker() {
            // DatePicker
            SupplierFollowUpDirectiveCtrl.ePage.Masters.DatePicker = {};
            SupplierFollowUpDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            SupplierFollowUpDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            SupplierFollowUpDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function ResetGrid() {
            // var _filter = {
            //     "IsShpCreated": false,
            //     "PartyType_FK" : SupplierFollowUpDirectiveCtrl.ePage.Masters.UserProfile.partyList[0].Party_Pk,
            //     "IsFollowUpIdCreated": true
            // }
            CloseFilter();
            FolowUpGridDetails(SupplierFollowUpDirectiveCtrl.filter);
        }

        function Filter() {
            var _filter = {
                "SortColumn": "POH_CreatedDateTime",
                "SortType": "DESC",
                "PageNumber": "1",
                "PageSize": 25,
                "IsShpCreated": false,
                // "PartyType_FK" : SupplierFollowUpDirectiveCtrl.ePage.Masters.UserProfile.partyList[0].Party_Pk,
                "Buyer": SupplierFollowUpDirectiveCtrl.ePage.Masters.FilterInput.Buyer,
                "Supplier": SupplierFollowUpDirectiveCtrl.ePage.Masters.FilterInput.Supplier,
                "OrderNo": SupplierFollowUpDirectiveCtrl.ePage.Masters.FilterInput.OrderNo,
                "PortOfLoading": SupplierFollowUpDirectiveCtrl.ePage.Masters.FilterInput.PortOfLoading,
                "IsFollowUpSend": SupplierFollowUpDirectiveCtrl.ePage.Masters.FilterInput.IsFollowUpSend
            }

            CloseFilter();
            FolowUpGridDetails(_filter);
        }

        function OpenFilter() {
            $timeout(function () {
                $('#filterSideBar').toggleClass('open');
            });
        }

        function CloseFilter() {
            $('#filterSideBar').removeClass('open');
        }

        function Clear() {
            SupplierFollowUpDirectiveCtrl.ePage.Masters.FilterInput = {};
            ResetGrid();
        }

        function SingleRecordView(obj) {
            var _queryString = {
                PK: obj.PK,
                OrderNo: obj.OrderCumSplitNo
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/order/" + _queryString, "_blank");
        }

        function BulkSave(item) {
            if (SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList.length > 0) {
                SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList.map(function (value, key) {
                    value.CargoReadyDate = item.CargoReadyDate;
                    value.Comments = item.Comments;
                })
                for (i = 0; i < SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList.length; i++) {
                    if (EmptyOrNullCheck(SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList[i].CargoReadyDate)) {
                        toastr.warning("Selected Order(s) must have  manotary for 'Cargo Ready Date'")
                        return false;
                    }
                }
            } else {
                toastr.warning("Selected atleast on Order(s) to Update Cargo Ready Date")
                return false;
            }
            SaveOnly(SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList);
        }

        function SaveOnly(_items) {
            SupplierFollowUpDirectiveCtrl.ePage.Masters.IsDisableSave = true;
            var _updateInput = [];
            for (i = 0; i < _items.length; i++) {
                var _tempObj = {
                    "EntityRefPK": _items[i].PK,
                    "Properties": [{
                        "PropertyName": "POH_CargoReadyDate",
                        "PropertyNewValue": _items[i].CargoReadyDate
                    }, {
                        "PropertyName": "POH_Comments",
                        "PropertyNewValue": _items[i].Comments
                    }, {
                        "PropertyName": "POH_OrderStatus",
                        "PropertyNewValue": "CRD"
                    }]
                };
                _updateInput.push(_tempObj);
            }

            apiService.post('eAxisAPI', appConfig.Entities.PorOrderHeader.API.UpdateRecords.Url, _updateInput).then(function (response) {
                if (response.data.Response) {
                    JobCommentInsert(response.data.Response);
                    CreateVesselGroup(_items);
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.IsDisableSave = false;
                    toastr.success("Successfully saved...");
                } else {
                    toastr.error("Save Failed...")
                }
            });
            SupplierFollowUpDirectiveCtrl.ePage.Masters.BulkInput = {};
            SupplierFollowUpDirectiveCtrl.ePage.Masters.BulkUploadOpen = false;
        }

        function JobCommentInsert(data) {
            var _jobCommentsArray = [];
            for (i = 0; i < data.length; i++) {
                var _jobCommentsInput = {
                    "PK": "",
                    "EntityRefKey": data[i].PK,
                    "EntitySource": "SFU",
                    "Comments": data[i].Comments
                }
                _jobCommentsArray.push(_jobCommentsInput);
            }

            // job comments api call
            if (_jobCommentsArray.length > 0) {
                apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.Insert.Url, _jobCommentsArray).then(function (response) {
                    if (response.data.Response) {

                    } else {
                        toastr.error("Job Comments Save Failed...");
                    }
                });
            }
        }

        function CreateVesselGroup(item) {
            var _vesselPlanning = [];
            SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList.map(function (value, key) {
                var _vesselPlanningInput = {
                    "OrderNo": value.OrderNo,
                    "OrderSplitNo": value.OrderSplitNo,
                    "POH_FK": value.PK,
                    "Buyer": value.Buyer,
                    "Supplier": value.Supplier,
                    "FollowUpDetailPK": ""
                }
                _vesselPlanning.push(_vesselPlanningInput);
            })

            var _input = {
                "GroupPK": "",
                "UIVesselPlanningDetails": _vesselPlanning
            }
            apiService.post("eAxisAPI", appConfig.Entities.VesselPlanning.API.CreateVesselPlanningGroup.Url, _input).then(function (response) {
                if (response.data.Status === "Success") {} else {
                    toastr.error("Vessel group failed...");
                }
            });
        }

        function AllPendingGridReload() {
            SupplierFollowUpDirectiveCtrl.ePage.Masters.Clicked = 'All Pending Orders';
            var _filter = {
                "SortColumn": "POH_CreatedDateTime",
                "SortType": "DESC",
                "PageNumber": "1",
                "PageSize": 25,
                "IsShpCreated": 'false',
                "IsValid": 'true',
                "IsFollowUpSend": ''
            };

            FolowUpGridDetails(_filter);
        }

        function SendFollwUpGridReload() {
            SupplierFollowUpDirectiveCtrl.ePage.Masters.Clicked = 'Orders Not Followed Up';
            var _filter = {
                "SortColumn": "POH_CreatedDateTime",
                "SortType": "DESC",
                "PageNumber": "1",
                "PageSize": 25,
                "IsFollowUpIdCreated": 'false',
                "IsShpCreated": 'false',
                "IsValid": 'true',
                "IsFollowUpSend": 'false'
            };

            FolowUpGridDetails(_filter);
        }

        function CargoReadyDateGridReload() {
            SupplierFollowUpDirectiveCtrl.ePage.Masters.Clicked = 'Orders Followed Up';
            var _filter = {
                "SortColumn": "POH_CreatedDateTime",
                "SortType": "DESC",
                "PageNumber": "1",
                "PageSize": 25,
                "IsFollowUpIdCreated": 'true',
                "CargoReadyDate": 'NULL',
                "IsShpCreated": 'false',
                "IsValid": 'true',
                "IsFollowUpSend": 'true'
            }

            FolowUpGridDetails(_filter);
        }

        function FollowUpHistoryCall() {
            var _filter = {
                "EntitySource": "SFU"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobEmail.API.FindAll.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.JobEmail.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.FollowUpHistory = response.data.Response;
                    FollowUpHistoryModal();
                } else {
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.FollowUpHistory = [];
                    FollowUpHistoryModal();
                }
            });
        }

        function ProcessActiveCall() {
            if (SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList.length > 0) {
                SupplierFollowUpDirectiveCtrl.ePage.Masters.IsGroupDisable = true;
                var _fliterIinput = {
                    "PK": "",
                    "Buyer": SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList[0].Buyer,
                    "Supplier": SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList[0].Supplier,
                    "PortOfLoading": SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList[0].PortOfLoading
                }
                var _followUpInput = [];
                for (i = 0; i < SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList.length; i++) {
                    var _inputCall = {
                        "PK": "",
                        "POH_FK": SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList[i].PK,
                        "OrderNo": SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList[i].OrderCumSplitNo
                    }
                    _followUpInput.push(_inputCall);
                }
                var _filter = {
                    "UIConsignorFollowUpHeader": _fliterIinput,
                    "UIConsignorFollowUp": _followUpInput
                }
                apiService.post('eAxisAPI', appConfig.Entities.CargoReadiness.API.CreateFollowUpGroup.Url, _filter).then(function (response) {
                    if (response.data.Response) {
                        toastr.success("Successfully followup group created..");
                        SupplierFollowUpDirectiveCtrl.ePage.Masters.IsGroupDisable = false;
                    } else {
                        toastr.error("FollowUgroup tack trigger failed ..");
                        SupplierFollowUpDirectiveCtrl.ePage.Masters.IsGroupDisable = false;
                    }
                });
            } else {
                toastr.warning('Select atleast one Orders');
            }
        }

        function FollowUpHistoryModal() {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "right",
                scope: $scope,
                // size : "sm",
                templateUrl: "app/eAxis/purchase-order/sfu-directive/followup-history-modal/followup-history.html",
                controller: 'followUpModalController',
                controllerAs: "FollowUpModalCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "HistoryList": SupplierFollowUpDirectiveCtrl.ePage.Masters.FollowUpHistory
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {},
                function (response) {
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.IsDisableSend = false;
                }
            );
        }

        function OnMailSuccess($item) {
            var _input = [];
            SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList.map(function (value, key) {
                var _inputData = {
                    "OrderNo": value.OrderNo,
                    "OrderSplitNo": value.OrderSplitNo,
                    "POH_FK": value.PK,
                    "Buyer": value.Buyer,
                    "Supplier": value.Supplier,
                    "FollowUpDetailPK": ""
                }
                _input.push(_inputData);
            });
            var _filter = {
                "GroupEntityRefKey": "",
                "UIVesselPlanningDetails": _input
            }
            apiService.post("eAxisAPI", appConfig.Entities.CargoReadiness.API.CompleteFollowUpTask.Url, _filter).then(function (response) {
                if (response.data.Status === "Success") {} else {
                    toastr.error("Task Completion Failed...!");
                }
            });
            UpdateRecords(SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList);
        }

        function SaveCargoReadyDate() {
            for (i = 0; i < SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList.length; i++) {
                if (i != 0) {
                    if ((SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList[i].Buyer != SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList[i - 1].Buyer) || (SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList[i].Supplier != SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList[i - 1].Supplier) || (SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList[i].PortOfLoading != SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList[i - 1].PortOfLoading)) {
                        toastr.warning("Selected Order(s) must have same load port")
                        return false;
                    }
                }
            }
            if (SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList.length > 0) {
                for (i = 0; i < SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList.length; i++) {
                    if (EmptyOrNullCheck(SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList[i].CargoReadyDate)) {
                        toastr.warning("Selected Order(s) must have  manotary for 'Cargo Ready Date'")
                        return false;
                    }
                }
                SaveOnly(SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList);
            } else {
                toastr.warning("Select atlest one order(s)")
            }
        }

        function FolowUpGridDetails(_filterInput) {
            SupplierFollowUpDirectiveCtrl.ePage.Masters.FilterInput = _filterInput;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList = [];
            SupplierFollowUpDirectiveCtrl.ePage.Masters.spinner = true;
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filterInput),
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        response.data.Response.map(function (value, key) {
                            value.status = false;
                        });
                    }
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.SfuOrderList = response.data.Response;
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.TotalCount = response.data.Count;
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.spinner = false;
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.numPerPage = 25;
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.noOfPages = Math.ceil(response.data.Count / SupplierFollowUpDirectiveCtrl.ePage.Masters.numPerPage);
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.currentPage = 1;
                }
            });
        }

        function DataChanges(data) {
            SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList = data;
        }

        function EmailOpenInput() {
            SupplierFollowUpDirectiveCtrl.ePage.Masters.Input = {
                "EntityRefKey": SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList[0].PK,
                "EntitySource": "SFU",
                "EntityRefCode": SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList[0].OrderCumSplitNo,
                "Communication": null,
                // Parent Entity
                "ParentEntityRefKey": undefined,
                "ParentEntityRefCode": undefined,
                "ParentEntitySource": undefined,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "RowObj": SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList
            }
            var _subject = "Follow-up for PO's of -" + SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList[0].Buyer + " to " + SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList[0].Supplier;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.MailObj = {
                Subject: _subject,
                Template: "OrderSummaryReport",
                TemplateObj: {
                    Key: "OrderSummaryReport",
                    Description: "Order Summary Report"
                }
            };
        }

        function UpdateRecords(_items) {
            var _updateInput = [];
            for (i = 0; i < _items.length; i++) {
                var _tempObj = {
                    "EntityRefPK": _items[i].PK,
                    "Properties": [{
                        "PropertyName": "POH_OrderStatus",
                        "PropertyNewValue": "FLS"
                    }]
                };
                _updateInput.push(_tempObj);
            }
            apiService.post('eAxisAPI', appConfig.Entities.PorOrderHeader.API.UpdateRecords.Url, _updateInput).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Successfully saved...");
                } else {
                    toastr.error("Save Failed...")
                }
            });
        }

        function AllPendingOrderCountCall() {
            var _filter = {
                "SortColumn": "POH_CreatedDateTime",
                "SortType": "DESC",
                "PageNumber": "1",
                "PageSize": 25,
                "IsShpCreated": 'false',
                "IsValid": 'true',
                "IsFollowUpSend": ''
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PO.API.GetPendingCargoReadinessCount.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.PO.API.GetPendingCargoReadinessCount.Url, _input).then(function (response) {
                if (response.data.Response) {
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.AllPendingCount = response.data.Response;
                }
            });
        }

        function OrderFollowedUpCountCall() {
            var _filter = {
                "IsFollowUpIdCreated": 'true',
                "CargoReadyDate": 'NULL',
                "IsShpCreated": 'false',
                "IsValid": 'true',
                "IsFollowUpSend": 'true'
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PO.API.GetPendingCargoReadinessCount.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.PO.API.GetPendingCargoReadinessCount.Url, _input).then(function (response) {
                if (response.data.Response) {
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.OrderFollowedUpCount = response.data.Response;
                }
            });
        }

        function NotFollowedUpCountCall() {
            var _filter = {
                "IsFollowUpIdCreated": 'false',
                "IsShpCreated": 'false',
                "IsValid": 'true',
                "IsFollowUpSend": 'false'
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PO.API.GetPendingCargoReadinessCount.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.PO.API.GetPendingCargoReadinessCount.Url, _input).then(function (response) {
                if (response.data.Response) {
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.NotFollowedUpCount = response.data.Response;
                }
            });
        }

        function EmptyOrNullCheck(val) {
            if (val == "" || val == null || val == undefined)
                return true;
            else
                return false;
        }

        function GetRelatedLookupList() {
            var _filter = {
                Key: "OrdSUFBuyerSelection_2998,OrdSUFSupplierSelection_3000,PortOfLoading_3086",
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

        function SelectedPages(_input) {
            SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList = [];
            SupplierFollowUpDirectiveCtrl.ePage.Masters.spinner = true;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.FilterInput.PageNumber = _input.page;

            var _input = {
                "searchInput": helperService.createToArrayOfObject(SupplierFollowUpDirectiveCtrl.ePage.Masters.FilterInput),
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.SfuOrderList = response.data.Response;
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.spinner = false;
                } else {
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.SfuOrderList = [];
                }
            });
        }

        Init();
    }
})();