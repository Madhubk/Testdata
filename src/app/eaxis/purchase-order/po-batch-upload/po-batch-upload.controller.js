(function () {
    "use strict";

    angular
        .module("Application")
        .controller("POBatchUploadController", POBatchUploadController);

    POBatchUploadController.$inject = ["$timeout", "$location", "apiService", "helperService", "poBatchUploadConfig", "toastr"];

    function POBatchUploadController($timeout, $location, apiService, helperService, poBatchUploadConfig, toastr) {
        var POBatchUploadCtrl = this;

        function Init() {
            POBatchUploadCtrl.ePage = {
                "Title": "",
                "Prefix": "Supplier_FollowUP",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": poBatchUploadConfig.Entities
            };

            POBatchUploadCtrl.ePage.Masters.taskName = "POBatchUpload";
            POBatchUploadCtrl.ePage.Masters.dataentryName = "POBatchUpload";
            POBatchUploadCtrl.ePage.Masters.config = POBatchUploadCtrl.ePage.Entities;
            POBatchUploadCtrl.ePage.Entities.Header.Data = {};
            POBatchUploadCtrl.ePage.Masters.TabList = [];
            POBatchUploadCtrl.ePage.Masters.activeTabIndex = 0;

            InitPOUpload();
        }

        function InitPOUpload() {
            POBatchUploadCtrl.ePage.Masters.IsTabClick = false;
            POBatchUploadCtrl.ePage.Masters.IsNewBatchClicked = false;
            POBatchUploadCtrl.ePage.Masters.ShowBackView = false;
            POBatchUploadCtrl.ePage.Masters.Back = Back;
            POBatchUploadCtrl.ePage.Masters.AddTab = AddTab;
            POBatchUploadCtrl.ePage.Masters.AddTab1 = AddTab1;
            // POBatchUploadCtrl.ePage.Entities.AddTab = AddTab;
            POBatchUploadCtrl.ePage.Masters.RemoveTab = RemoveTab;
            POBatchUploadCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            POBatchUploadCtrl.ePage.Masters.Save = Save;
            POBatchUploadCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            POBatchUploadCtrl.ePage.Masters.CreateBatch = CreateBatch;
            POBatchUploadCtrl.ePage.Masters.SaveButtonText = "Save";

            var _Entity = $location.search(),
                _isEmpty = angular.equals({},_Entity);

            if (_Entity){
                if (!_isEmpty) {
                    POBatchUploadCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(_Entity.item));  
                    if (POBatchUploadCtrl.ePage.Masters.Entity.IsCreated === "POBatch Upload" ) {
                        POBatchUploadCtrl.ePage.Masters.ShowBackView = true;
                    }
                    if (POBatchUploadCtrl.ePage.Masters.Entity.BatchUploadNo) {
                        POBatchUploadCtrl.ePage.Masters.AddTab(POBatchUploadCtrl.ePage.Masters.Entity, false, false, 'BatchUploadNo');
                    }
                }
            }
        }
        
        function Back() {
            $location.url('/EA/order-dashboard');
        }

        function CreateBatch() {
            POBatchUploadCtrl.ePage.Masters.IsNewBatchClicked = true;
            helperService.getFullObjectUsingGetById(POBatchUploadCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    var _obj = {
                        entity: response.data.Response.UIOrderBatchUpload,
                        data: response.data.Response
                    };

                    POBatchUploadCtrl.ePage.Masters.AddTab(_obj, true, false, 'BatchUploadNo');
                    // POBatchUploadCtrl.ePage.Masters.AddTab(_obj, true, false, 'BatchUploadNo');
                    POBatchUploadCtrl.ePage.Masters.IsNewBatchClicked = false;
                } else {
                    console.log("Empty New Order response");
                }
            });
        }
        
        function AddTab1($item) {
            AddTab($item, true, true, 'OrderNo');
        }
        
        function AddTab(currentObj, IsNew, IsNewOrder, keyObjNo) {
            POBatchUploadCtrl.ePage.Masters.currentObj = undefined;
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
                if (response.data.Response === "Success") {
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
            POBatchUploadCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity
            } else {
                currentTab = currentTab;
            }
            POBatchUploadCtrl.ePage.Masters.currentObj = currentTab;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                POBatchUploadCtrl.ePage.Masters.AddTab($item.data, false, false, 'BatchUploadNo');
                // POBatchUploadCtrl.ePage.Entities.AddTab($item.data, false, false, 'BatchUploadNo');
            } else {
                CreateBatch();
            }
        }

        function Save($item) {
            POBatchUploadCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            POBatchUploadCtrl.ePage.Masters.IsDisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            // Push addresslist to jobaddress
            var _array = [];
            for (var i in _Data.Header.Data.UIAddressContactList) {
                if (i !== "CfxTypeList") {
                    _array.push(_Data.Header.Data.UIAddressContactList[i]);
                }
            }
            _Data.Header.Data.UIJobAddress = [];
            _array.map(function (value, key) {
                _Data.Header.Data.UIJobAddress.push(value);
            });

            var _isEmpty = angular.equals({}, _Data.Header.Data.UIAddressContactList);
            if (!_isEmpty) {
                _Data.Header.Data.UIPorOrderHeader.ORG_Buyer_FK = _Data.Header.Data.UIAddressContactList.SCP.ORG_FK;
                _Data.Header.Data.UIPorOrderHeader.Buyer = _Data.Header.Data.UIAddressContactList.SCP.ORG_Code;
                _Data.Header.Data.UIPorOrderHeader.ORG_Supplier_FK = _Data.Header.Data.UIAddressContactList.CRA.ORG_FK;
                _Data.Header.Data.UIPorOrderHeader.Supplier = _Data.Header.Data.UIAddressContactList.CRA.ORG_Code;
            }
            if ($item.isNew) {
                _input.UIPorOrderHeader.PK = _input.PK;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
                _input.UICustomEntity.IsNewInsert = true;
            }

            helperService.SaveEntity($item,'Order').then(function (response) {
                if (response.Status === "success") {
                    poBatchUploadConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == POBatchUploadCtrl.ePage.Masters.currentObj) {
                                value.label = POBatchUploadCtrl.ePage.Masters.currentObj;
                                value[POBatchUploadCtrl.ePage.Masters.currentObj] = value.New;

                                delete value.New;
                            }
                        }
                    });
                    var _index = poBatchUploadConfig.TabList.map(function (value, key) {
                        return value.label;
                    }).indexOf(POBatchUploadCtrl.ePage.Masters.currentObj);

                    if (_index !== -1) {
                        poBatchUploadConfig.TabList[_index][poBatchUploadConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        poBatchUploadConfig.TabList[_index].isNew = false;
                    }
                    console.log("Success");
                } else if (response.Status === "failed") {
                    console.log("Failed");
                }
                POBatchUploadCtrl.ePage.Masters.SaveButtonText = "Save";
                POBatchUploadCtrl.ePage.Masters.IsDisableSave = false;
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
