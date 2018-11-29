(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_one_POBatchUploadController", one_one_POBatchUploadController);

    one_one_POBatchUploadController.$inject = ["$timeout", "$scope", "$location", "$uibModal", "apiService", "helperService", "one_poBatchUploadConfig", "toastr", "appConfig", "confirmation"];

    function one_one_POBatchUploadController($timeout, $scope, $location, $uibModal, apiService, helperService, one_poBatchUploadConfig, toastr, appConfig, confirmation) {
        var one_one_POBatchUploadCtrl = this;

        function Init() {
            one_one_POBatchUploadCtrl.ePage = {
                "Title": "",
                "Prefix": "PO_Batch_Upload",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": one_poBatchUploadConfig.Entities
            };

            one_one_POBatchUploadCtrl.ePage.Masters.taskName = "POBatchUpload_Buyer";
            one_one_POBatchUploadCtrl.ePage.Masters.dataentryName = "POBatchUpload_Buyer";
            one_one_POBatchUploadCtrl.ePage.Masters.Config = one_poBatchUploadConfig;
            one_one_POBatchUploadCtrl.ePage.Entities.Header.Data = {};
            one_one_POBatchUploadCtrl.ePage.Masters.TabList = [];
            one_one_POBatchUploadCtrl.ePage.Masters.activeTabIndex = 0;
            one_poBatchUploadConfig.TabList = [];
            one_one_POBatchUploadCtrl.ePage.Masters.ShowLists = false;
            one_one_POBatchUploadCtrl.ePage.Masters.JsonInput = {}
            one_one_POBatchUploadCtrl.ePage.Masters.JsonEditiorOptions = {
                mode: 'code',
                onEditable: function (node) {
                    return true;
                }
            };
            one_one_POBatchUploadCtrl.ePage.Masters.ChangeJsonView = ChangeJsonView;
            // one_one_POBatchUploadCtrl.ePage.Masters.OnLookupConfigLoad = OnLookupConfigLoad;
            one_one_POBatchUploadCtrl.ePage.Masters.CreateOrder = CreateOrder;
            one_one_POBatchUploadCtrl.ePage.Masters.CreateBatchUplaod = CreateBatchUplaod;
            one_one_POBatchUploadCtrl.ePage.Masters.TemplateDownload = TemplateDownload;
            one_one_POBatchUploadCtrl.ePage.Masters.SubmitOrder = SubmitOrder;
            one_one_POBatchUploadCtrl.ePage.Masters.SubmitOrderDisabled = false;
            one_one_POBatchUploadCtrl.ePage.Masters.DocumentEnable = false;
            one_one_POBatchUploadCtrl.ePage.Masters.SubmitOrderText = "Execute";

            InitPOUpload();
        }

        function OnLookupConfigLoad(instance) {
            instance.expandAll();
        }

        function TemplateDownload() {
            apiService.get("eAxisAPI", appConfig.Entities.DMS.API.DownloadTemplate.Url + "/PO_SystemTemplate").then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response !== "No Records Found!") {
                        var obj = {
                            "Base64str": response.data.Response,
                            "Name": 'PO_SystemTemplate.xlsx'
                        }
                        helperService.DownloadDocument(obj);
                    }
                } else {
                    console.log("Invalid response");
                }
            });
        }

        function SubmitOrder() {
            one_one_POBatchUploadCtrl.ePage.Masters.SubmitOrderDisabled = true;
            one_one_POBatchUploadCtrl.ePage.Masters.SubmitOrderText = "Please wait..";

            one_one_POBatchUploadCtrl.ePage.Masters.JsonInput.UIOrder_Buyer.PK = one_one_POBatchUploadCtrl.ePage.Masters.JsonInputCopy.PK;
            one_one_POBatchUploadCtrl.ePage.Masters.JsonInput.PK = one_one_POBatchUploadCtrl.ePage.Masters.JsonInputCopy.PK;
            one_one_POBatchUploadCtrl.ePage.Masters.JsonInput.UICustomEntity.IsNewInsert = true;
            apiService.post("eAxisAPI", appConfig.Entities.BuyerOrder.API.insert.Url, one_one_POBatchUploadCtrl.ePage.Masters.JsonInput).then(function (response) {
                if (response.data.Response) {
                    var modalOptions = {
                        closeButtonText: 'Back to Dashboard',
                        closeButtonVisible: true,
                        actionButtonText: 'Create Another',
                        headerText: 'Order Created Successfully..',
                        bodyText: response.data.Response.UIOrder_Buyer.OrderNo
                    };

                    confirmation.showModal({}, modalOptions)
                        .then(function (result) {
                            one_one_POBatchUploadCtrl.ePage.Masters.SubmitOrderDisabled = false
                            one_one_POBatchUploadCtrl.ePage.Masters.SubmitOrderText = "Execute"
                            CreateOrder()
                        }, function () {
                            one_one_POBatchUploadCtrl.ePage.Masters.ShowLists = false;
                            one_one_POBatchUploadCtrl.ePage.Masters.APIDataFeed = false;
                        });
                } else {
                    one_one_POBatchUploadCtrl.ePage.Masters.SubmitOrderDisabled = false
                    one_one_POBatchUploadCtrl.ePage.Masters.SubmitOrderText = "Execute"
                }
            });
        }

        function ChangeJsonView() {
            one_one_POBatchUploadCtrl.ePage.Masters.JsonEditiorOptions.mode = one_one_POBatchUploadCtrl.ePage.Masters.JsonEditiorOptions.mode == 'tree' ? 'code' : 'tree';
        }

        function CreateOrder() {
            var _isExist = one_one_POBatchUploadCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if (!_isExist) {
                helperService.getFullObjectUsingGetById(appConfig.Entities.BuyerOrder.API["1_1_listgetbyid"].Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        one_one_POBatchUploadCtrl.ePage.Masters.JsonInputCopy = angular.copy(response.data.Response.Response)
                        delete response.data.Response.Response.PK
                        one_one_POBatchUploadCtrl.ePage.Masters.JsonInput = response.data.Response.Response
                    } else {
                        console.log("Empty New Order response");
                    }
                });
            } else {
                toastr.info("New Order Already Opened...!");
            }
        }

        function InitPOUpload() {
            one_one_POBatchUploadCtrl.ePage.Masters.IsTabClick = false;
            one_one_POBatchUploadCtrl.ePage.Masters.IsNewBatchClicked = false;
            one_one_POBatchUploadCtrl.ePage.Masters.ShowBackView = false;
            one_one_POBatchUploadCtrl.ePage.Masters.Back = Back;
            // one_one_POBatchUploadCtrl.ePage.Masters.AddTab = AddTab;
            // one_one_POBatchUploadCtrl.ePage.Masters.AddTab1 = AddTab1;
            one_one_POBatchUploadCtrl.ePage.Entities.AddTab = AddTab;
            one_one_POBatchUploadCtrl.ePage.Masters.RemoveTab = RemoveTab;
            one_one_POBatchUploadCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            one_one_POBatchUploadCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            one_one_POBatchUploadCtrl.ePage.Masters.CreateBatch = CreateBatch;
            one_one_POBatchUploadCtrl.ePage.Masters.CreatOrderUplaod = CreatOrderUplaod;
            one_one_POBatchUploadCtrl.ePage.Masters.CreateNewOrder = CreateNewOrder;
            one_one_POBatchUploadCtrl.ePage.Masters.Close = Close;
            one_one_POBatchUploadCtrl.ePage.Masters.EmptyTabList = EmptyTabList;
            one_one_POBatchUploadCtrl.ePage.Masters.SaveButtonText = "Save";

            var _Entity = $location.search(),
                _isEmpty = angular.equals({}, _Entity);

            if (_Entity) {
                if (!_isEmpty) {
                    one_one_POBatchUploadCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(_Entity.item));
                    if (one_one_POBatchUploadCtrl.ePage.Masters.Entity.IsCreated === "POBatch Upload") {
                        one_one_POBatchUploadCtrl.ePage.Masters.ShowBackView = true;
                    }
                    if (one_one_POBatchUploadCtrl.ePage.Masters.Entity.BatchUploadNo) {
                        // one_one_POBatchUploadCtrl.ePage.Masters.AddTab(one_one_POBatchUploadCtrl.ePage.Masters.Entity, false, false, 'BatchUploadNo');
                        one_one_POBatchUploadCtrl.ePage.Entities.AddTab(one_one_POBatchUploadCtrl.ePage.Masters.Entity, false, false, 'BatchUploadNo');
                    }
                }
            }
        }

        function Back() {
            $location.url('/EA/order-dashboard');
        }

        function EmptyTabList() {
            one_one_POBatchUploadCtrl.ePage.Masters.TabList = [];
            one_poBatchUploadConfig.TabList = [];
            one_poBatchUploadConfig.GlobalVar.DocType = "";
        }

        function CreateBatchUplaod(docType) {
            one_poBatchUploadConfig.GlobalVar.DocType = docType;
            EmptyTabList();
            CreateBatch(docType);
        }

        function CreatOrderUplaod(docType) {
            one_poBatchUploadConfig.GlobalVar.DocType = docType;
            GetOrderData(docType);
        }

        function GetOrderData(docType) {
            helperService.getFullObjectUsingGetById(appConfig.Entities.BuyerOrderBatchUpload.API.getbyid.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    (docType) ? response.data.Response.UIOrderBatchUpload_Buyer.BatchUploadType = docType: response.data.Response.UIOrderBatchUpload_Buyer.BatchUploadType = one_poBatchUploadConfig.GlobalVar.DocType;
                    var _exports = {
                        "Entities": {
                            "Header": {
                                "Data": {},
                                "API": {
                                    "InsertBatch": {
                                        "IsAPI": "true",
                                        "HttpType": "POST",
                                        "Url": "orderbatchupload/buyer/insert"
                                    },
                                    "UpdateBatch": {
                                        "IsAPI": "true",
                                        "HttpType": "POST",
                                        "Url": "orderbatchupload/buyer/insert"
                                    }
                                },
                            }
                        }
                    };
                    _exports.Entities.Header.Data = response.data.Response;
                    var _obj = {
                        New: {
                            ePage: _exports
                        },
                        label: 'New',
                        code: response.data.Response.BatchUploadNo,
                        isNew: true
                    };
                    BatchModal(docType, _obj);
                } else {
                    console.log("Empty New Order response");
                }
            });
        }

        function CreateNewOrder() {
            var _queryString = {
                PK: "",
                BatchUploadNo: "",
                ConfigName: "one_order_listConfig"
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/po-order/" + _queryString, "_blank");
        }

        function BatchModal(type, data) {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "po-modal right",
                scope: $scope,
                // size : "sm",
                templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order_batch/1_1_batch-upload-modal/batch-upload-modal.html",
                controller: 'PoModalController',
                controllerAs: "PoModalCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "currentBatch": data,
                            "Type": type
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {},
                function (response) {
                    EmptyTabList();
                }
            );
        }

        function CreateBatch(docType) {
            var _isExist = one_one_POBatchUploadCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if (!_isExist) {
                one_one_POBatchUploadCtrl.ePage.Masters.IsNewBatchClicked = true;
                helperService.getFullObjectUsingGetById(appConfig.Entities.BuyerOrderBatchUpload.API.getbyid.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        (docType) ? response.data.Response.UIOrderBatchUpload_Buyer.BatchUploadType = docType: response.data.Response.UIOrderBatchUpload_Buyer.BatchUploadType = one_poBatchUploadConfig.GlobalVar.DocType;
                        var _obj = {
                            entity: response.data.Response.UIOrderBatchUpload_Buyer,
                            data: response.data.Response
                        };

                        // one_one_POBatchUploadCtrl.ePage.Masters.AddTab(_obj, true, false, 'BatchUploadNo');
                        one_one_POBatchUploadCtrl.ePage.Entities.AddTab(_obj, true, false, 'BatchUploadNo');
                        one_one_POBatchUploadCtrl.ePage.Masters.IsNewBatchClicked = false;
                    } else {
                        console.log("Empty New Order response");
                    }
                });
            } else {
                toastr.info("New Batch upload Already Opened...!");
            }
        }

        function AddTab(currentObj, IsNew, IsNewOrder, keyObjNo) {
            one_one_POBatchUploadCtrl.ePage.Masters.currentObj = undefined;
            if (keyObjNo == "OrderNo") {
                one_one_POBatchUploadCtrl.ePage.Masters.CopyOrderHeader = angular.copy(currentObj.entity);
            }
            var _isExist = one_one_POBatchUploadCtrl.ePage.Masters.TabList.some(function (value) {
                if (!IsNew) {
                    return value.label === currentObj.entity[keyObjNo];
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                one_one_POBatchUploadCtrl.ePage.Masters.IsTabClick = true;
                var _currentObj = undefined;
                if (!IsNew) {
                    _currentObj = currentObj.entity;
                } else {
                    _currentObj = currentObj;

                }
                one_poBatchUploadConfig.GetTabDetails(_currentObj, IsNew, IsNewOrder, keyObjNo).then(function (response) {
                    one_one_POBatchUploadCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        one_one_POBatchUploadCtrl.ePage.Masters.activeTabIndex = one_one_POBatchUploadCtrl.ePage.Masters.TabList.length;
                        one_one_POBatchUploadCtrl.ePage.Masters.CurrentActiveTab(currentObj.entity[keyObjNo]);
                        one_one_POBatchUploadCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.warning(keyObjNo + "Already Opened...!");
            }
        }

        function RemoveTab(event, index, currentObj) {
            event.preventDefault();
            event.stopPropagation();
            var _currentObj = currentObj[currentObj.label].ePage.Entities;

            // Close Current Order
            apiService.get("eAxisAPI", appConfig.Entities.BuyerOrderBatchUpload.API.activityclose.Url + _currentObj.Header.Data.PK + '?batchNo=' + _currentObj.Header.Data.UIOrderBatchUpload_Buyer.BatchUploadNo).then(function (response) {
                if (response.data.Response === "Success") {} else {
                    console.log("Tab close Error : " + response);
                }
            });
            one_one_POBatchUploadCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function Close(index, currentObj) {
            var _currentObj = currentObj[currentObj.label].ePage.Entities;

            // Close Current Order
            apiService.get("eAxisAPI", appConfig.Entities.BuyerOrder.API.activityclose.Url + _currentObj.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {} else {
                    console.log("Tab close Error : " + response);
                }
            });
            one_one_POBatchUploadCtrl.ePage.Masters.TabList.splice(index, 1);
            one_one_POBatchUploadCtrl.ePage.Masters.Config.GlobalVar.IsClosed = false;
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity
            } else {
                currentTab = currentTab;
            }
            one_one_POBatchUploadCtrl.ePage.Masters.currentObj = currentTab;
            one_one_POBatchUploadCtrl.ePage.Masters.TabConfig = "BatchUpload";
        }

        function SelectedGridRow($item) {
            if ($item.action === "link") {
                StandardMenuConfig($item.data.entity);
            }
            // if ($item.action === "link" || $item.action === "dblClick") {
            //     one_one_POBatchUploadCtrl.ePage.Entities.AddTab($item.data, false, false, 'BatchUploadNo');
            // } else {
            //     CreateBatch();
            // }
        }

        function StandardMenuConfig(_data) {
            one_one_POBatchUploadCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                // "Entity": _data.Source,
                "EntityRefKey": _data.PK,
                "EntityRefCode": _data.BatchUploadNo,
                "EntitySource": _data.Source,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": undefined,
                "ParentEntityRefCode": undefined,
                "ParentEntitySource": undefined,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "IsDisableParentEntity": true,
                "IsDisableAdditionalEntity": true
            };
            one_one_POBatchUploadCtrl.ePage.Masters.StandardConfigInput = {
                IsDisableRefreshButton: true,
                IsDisableDeleteHistoryButton: true,
                // IsDisableUpload: true,
                // IsDisableGenerate: true,
                IsDisableRelatedDocument: true,
                // IsDisableCount: true,
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

            one_one_POBatchUploadCtrl.ePage.Masters.CommentConfig = {
                IsDisableRefreshButton: true
            };
            one_one_POBatchUploadCtrl.ePage.Masters.DocumentEnable = true;
            DocumentModal();
        }

        function DocumentModal() {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "doc-modal right",
                scope: $scope,
                // size : "sm",
                templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order_batch/doc-upload-modal/doc-upload-modal.html",
                controller: 'DocModalController',
                controllerAs: "DocModalCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Input": one_one_POBatchUploadCtrl.ePage.Masters.StandardMenuInput
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {},
                function (response) {
                    EmptyTabList();
                }
            );
        }

        Init();
    }
})();