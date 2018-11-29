(function () {
    "use strict";

    angular
        .module("Application")
        .controller("POBatchUploadController", POBatchUploadController);

    POBatchUploadController.$inject = ["$timeout", "$location", "apiService", "helperService", "poBatchUploadConfig", "toastr", "appConfig", "confirmation"];

    function POBatchUploadController($timeout, $location, apiService, helperService, poBatchUploadConfig, toastr, appConfig, confirmation) {
        var POBatchUploadCtrl = this;

        function Init() {
            POBatchUploadCtrl.ePage = {
                "Title": "",
                "Prefix": "PO_Batch_Upload",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": poBatchUploadConfig.Entities
            };

            POBatchUploadCtrl.ePage.Masters.taskName = "POBatchUpload";
            POBatchUploadCtrl.ePage.Masters.dataentryName = "POBatchUpload";
            POBatchUploadCtrl.ePage.Masters.Config = poBatchUploadConfig;
            POBatchUploadCtrl.ePage.Entities.Header.Data = {};
            POBatchUploadCtrl.ePage.Masters.TabList = [];
            POBatchUploadCtrl.ePage.Masters.activeTabIndex = 0;
            poBatchUploadConfig.TabList = [];
            POBatchUploadCtrl.ePage.Masters.ShowLists = false;
            POBatchUploadCtrl.ePage.Masters.JsonInput = {}
            POBatchUploadCtrl.ePage.Masters.JsonEditiorOptions = {
                mode: 'code',
                onEditable: function (node) {
                    return true;
                }
            };
            POBatchUploadCtrl.ePage.Masters.ChangeJsonView = ChangeJsonView;
            // POBatchUploadCtrl.ePage.Masters.OnLookupConfigLoad = OnLookupConfigLoad;
            POBatchUploadCtrl.ePage.Masters.CreateOrder = CreateOrder;
            POBatchUploadCtrl.ePage.Masters.CreateBatchUplaod = CreateBatchUplaod;
            POBatchUploadCtrl.ePage.Masters.SubmitOrder = SubmitOrder;
            POBatchUploadCtrl.ePage.Masters.SubmitOrderDisabled = false;
            POBatchUploadCtrl.ePage.Masters.SubmitOrderText = "Execute";

            InitPOUpload();
        }

        function OnLookupConfigLoad(instance) {
            instance.expandAll();
        }

        function SubmitOrder() {
            POBatchUploadCtrl.ePage.Masters.SubmitOrderDisabled = true;
            POBatchUploadCtrl.ePage.Masters.SubmitOrderText = "Please wait..";

            POBatchUploadCtrl.ePage.Masters.JsonInput.UIPorOrderHeader.PK = POBatchUploadCtrl.ePage.Masters.JsonInputCopy.PK;
            POBatchUploadCtrl.ePage.Masters.JsonInput.PK = POBatchUploadCtrl.ePage.Masters.JsonInputCopy.PK;
            POBatchUploadCtrl.ePage.Masters.JsonInput.UICustomEntity.IsNewInsert = true;
            apiService.post("eAxisAPI", appConfig.Entities.OrderList.API.Insert.Url, POBatchUploadCtrl.ePage.Masters.JsonInput).then(function (response) {
                if (response.data.Response) {
                    var modalOptions = {
                        closeButtonText: 'Back to Dashboard',
                        closeButtonVisible: true,
                        actionButtonText: 'Create Another',
                        headerText: 'Order Created Successfully..',
                        bodyText: response.data.Response.UIPorOrderHeader.OrderNo
                    };

                    confirmation.showModal({}, modalOptions)
                        .then(function (result) {
                            POBatchUploadCtrl.ePage.Masters.SubmitOrderDisabled = false
                            POBatchUploadCtrl.ePage.Masters.SubmitOrderText = "Execute"
                            CreateOrder()
                        }, function () {
                            POBatchUploadCtrl.ePage.Masters.ShowLists = false;
                            POBatchUploadCtrl.ePage.Masters.APIDataFeed = false;
                        });
                } else {
                    POBatchUploadCtrl.ePage.Masters.SubmitOrderDisabled = false
                    POBatchUploadCtrl.ePage.Masters.SubmitOrderText = "Execute"
                }
            });
        }

        function ChangeJsonView() {
            POBatchUploadCtrl.ePage.Masters.JsonEditiorOptions.mode = POBatchUploadCtrl.ePage.Masters.JsonEditiorOptions.mode == 'tree' ? 'code' : 'tree';
        }

        function CreateOrder() {
            var _isExist = POBatchUploadCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if (!_isExist) {
                helperService.getFullObjectUsingGetById(appConfig.Entities.OrderList.API.GetById.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        POBatchUploadCtrl.ePage.Masters.JsonInputCopy = angular.copy(response.data.Response.Response)
                        delete response.data.Response.Response.PK
                        POBatchUploadCtrl.ePage.Masters.JsonInput = response.data.Response.Response
                    } else {
                        console.log("Empty New Order response");
                    }
                });
            } else {
                toastr.info("New Order Already Opened...!");
            }
        }

        function InitPOUpload() {
            POBatchUploadCtrl.ePage.Masters.IsTabClick = false;
            POBatchUploadCtrl.ePage.Masters.IsNewBatchClicked = false;
            POBatchUploadCtrl.ePage.Masters.ShowBackView = false;
            POBatchUploadCtrl.ePage.Masters.Back = Back;
            // POBatchUploadCtrl.ePage.Masters.AddTab = AddTab;
            // POBatchUploadCtrl.ePage.Masters.AddTab1 = AddTab1;
            POBatchUploadCtrl.ePage.Entities.AddTab = AddTab;
            POBatchUploadCtrl.ePage.Masters.RemoveTab = RemoveTab;
            POBatchUploadCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            POBatchUploadCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            POBatchUploadCtrl.ePage.Masters.CreateBatch = CreateBatch;
            POBatchUploadCtrl.ePage.Masters.Close = Close;
            POBatchUploadCtrl.ePage.Masters.SaveButtonText = "Save";

            var _Entity = $location.search(),
                _isEmpty = angular.equals({}, _Entity);

            if (_Entity) {
                if (!_isEmpty) {
                    POBatchUploadCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(_Entity.item));
                    if (POBatchUploadCtrl.ePage.Masters.Entity.IsCreated === "POBatch Upload") {
                        POBatchUploadCtrl.ePage.Masters.ShowBackView = true;
                    }
                    if (POBatchUploadCtrl.ePage.Masters.Entity.BatchUploadNo) {
                        // POBatchUploadCtrl.ePage.Masters.AddTab(POBatchUploadCtrl.ePage.Masters.Entity, false, false, 'BatchUploadNo');
                        POBatchUploadCtrl.ePage.Entities.AddTab(POBatchUploadCtrl.ePage.Masters.Entity, false, false, 'BatchUploadNo');
                    }
                }
            }
        }

        function Back() {
            $location.url('/EA/order-dashboard');
        }

        function CreateBatchUplaod(docType) {
            POBatchUploadCtrl.ePage.Masters.TabList = [];
            poBatchUploadConfig.TabList = [];
            poBatchUploadConfig.GlobalVar.DocType = docType;
            CreateBatch(docType);
        }

        function CreateBatch(docType) {
            var _isExist = POBatchUploadCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if (!_isExist) {
                POBatchUploadCtrl.ePage.Masters.IsNewBatchClicked = true;
                helperService.getFullObjectUsingGetById(POBatchUploadCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        (docType) ? response.data.Response.UIOrderBatchUpload.BatchUploadType = docType: response.data.Response.UIOrderBatchUpload.BatchUploadType = poBatchUploadConfig.GlobalVar.DocType;
                        var _obj = {
                            entity: response.data.Response.UIOrderBatchUpload,
                            data: response.data.Response
                        };

                        // POBatchUploadCtrl.ePage.Masters.AddTab(_obj, true, false, 'BatchUploadNo');
                        POBatchUploadCtrl.ePage.Entities.AddTab(_obj, true, false, 'BatchUploadNo');
                        POBatchUploadCtrl.ePage.Masters.IsNewBatchClicked = false;
                    } else {
                        console.log("Empty New Order response");
                    }
                });
            } else {
                toastr.info("New Batch upload Already Opened...!");
            }
        }

        // function AddTab1($item) {
        //     AddTab($item, true, true, 'OrderNo');
        // }

        function AddTab(currentObj, IsNew, IsNewOrder, keyObjNo) {
            POBatchUploadCtrl.ePage.Masters.currentObj = undefined;
            if (keyObjNo == "OrderNo") {
                POBatchUploadCtrl.ePage.Masters.CopyOrderHeader = angular.copy(currentObj.entity);
            }
            var _isExist = POBatchUploadCtrl.ePage.Masters.TabList.some(function (value) {
                if (!IsNew) {
                    return value.label === currentObj.entity[keyObjNo];
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                POBatchUploadCtrl.ePage.Masters.IsTabClick = true;
                var _currentObj = undefined;
                if (!IsNew) {
                    _currentObj = currentObj.entity;
                } else {
                    _currentObj = currentObj;

                }
                poBatchUploadConfig.GetTabDetails(_currentObj, IsNew, IsNewOrder, keyObjNo).then(function (response) {
                    POBatchUploadCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        POBatchUploadCtrl.ePage.Masters.activeTabIndex = POBatchUploadCtrl.ePage.Masters.TabList.length;
                        POBatchUploadCtrl.ePage.Masters.CurrentActiveTab(currentObj.entity[keyObjNo]);
                        POBatchUploadCtrl.ePage.Masters.IsTabClick = false;
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
            apiService.get("eAxisAPI", POBatchUploadCtrl.ePage.Entities.Header.API.OrderHeaderActivityClose.Url + _currentObj.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {} else {
                    console.log("Tab close Error : " + response);
                }
            });
            POBatchUploadCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function Close(index, currentObj) {
            var _currentObj = currentObj[currentObj.label].ePage.Entities;

            // Close Current Order
            apiService.get("eAxisAPI", POBatchUploadCtrl.ePage.Entities.Header.API.OrderHeaderActivityClose.Url + _currentObj.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {} else {
                    console.log("Tab close Error : " + response);
                }
            });
            POBatchUploadCtrl.ePage.Masters.TabList.splice(index, 1);
            POBatchUploadCtrl.ePage.Masters.Config.GlobalVar.IsClosed = false;
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity
            } else {
                currentTab = currentTab;
            }
            POBatchUploadCtrl.ePage.Masters.currentObj = currentTab;
            POBatchUploadCtrl.ePage.Masters.TabConfig = "BatchUpload";
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                // POBatchUploadCtrl.ePage.Masters.AddTab($item.data, false, false, 'BatchUploadNo');
                POBatchUploadCtrl.ePage.Entities.AddTab($item.data, false, false, 'BatchUploadNo');
            } else {
                CreateBatch();
            }
        }

        Init();
    }
})();