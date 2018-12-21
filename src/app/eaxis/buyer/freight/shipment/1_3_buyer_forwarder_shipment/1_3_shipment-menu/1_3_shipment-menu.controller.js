(function () {
    "use strict";

    angular
        .module("Application")
        .controller("oneThreeShipmentMenuController", oneThreeShipmentMenuController);

    oneThreeShipmentMenuController.$inject = ["$rootScope", "$injector", "$location", "three_shipmentConfig", "helperService", "appConfig", "authService", "apiService", "errorWarningService", "confirmation", "$ocLazyLoad", "$timeout"];

    function oneThreeShipmentMenuController($rootScope, $injector, $location, three_shipmentConfig, helperService, appConfig, authService, apiService, errorWarningService, confirmation, $ocLazyLoad, $timeout) {
        /* jshint validthis: true */
        var oneThreeShipmentMenuCtrl = this;
        var url = $location.path();

        function Init() {
            var currentShipment = oneThreeShipmentMenuCtrl.currentShipment[oneThreeShipmentMenuCtrl.currentShipment.label].ePage.Entities;
            oneThreeShipmentMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "ShipmentMenu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentShipment
            };
            oneThreeShipmentMenuCtrl.ePage.Masters.ShipmentMenu = {};
            oneThreeShipmentMenuCtrl.ePage.Masters.MyTask = {};
            oneThreeShipmentMenuCtrl.ePage.Masters.TabSelected = TabSelected;
            $rootScope.OnAddressEdit = OnAddressEdit;
            $rootScope.OnAddressEditBack = OnAddressEditBack;
            oneThreeShipmentMenuCtrl.ePage.Masters.OnMenuClick = OnMenuClick;
            oneThreeShipmentMenuCtrl.ePage.Masters.Config = three_shipmentConfig;
            oneThreeShipmentMenuCtrl.ePage.Masters.TableProperty = {
                "status": {
                    "isenabled": true,
                    "position": "5",
                    "width": "120"
                },
                "vessel": {
                    "isenabled": true,
                    "position": "7",
                    "width": "120"
                },
                "voyageflight": {
                    "isenabled": true,
                    "position": "6",
                    "width": "120"
                },
                "etd": {
                    "isenabled": true,
                    "position": "10",
                    "width": "120"
                },
                "eta": {
                    "isenabled": true,
                    "position": "11",
                    "width": "120"
                },
                "atd": {
                    "isenabled": true,
                    "position": "12",
                    "width": "120"
                },
                "ata": {
                    "isenabled": true,
                    "position": "13",
                    "width": "120"
                },
                "legno": {
                    "isenabled": true,
                    "position": "1",
                    "width": "100"
                },
                "islinked": {
                    "isenabled": true,
                    "position": "2",
                    "width": "100"
                },
                "mode": {
                    "isenabled": true,
                    "position": "3",
                    "width": "120"
                },
                "type": {
                    "isenabled": true,
                    "position": "4",
                    "width": "120"
                },
                "pol": {
                    "isenabled": true,
                    "position": "8",
                    "width": "120"
                },
                "pod": {
                    "isenabled": true,
                    "position": "9",
                    "width": "120"
                },
                "definedby": {
                    "isenabled": true,
                    "position": "1",
                    "width": "100"
                },
                "entitysource": {
                    "isenabled": true,
                    "position": "1",
                    "width": "100"
                }
            };
            oneThreeShipmentMenuCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            oneThreeShipmentMenuCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.Shipment.Entity[oneThreeShipmentMenuCtrl.currentShipment.code].GlobalErrorWarningList;
            oneThreeShipmentMenuCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.Shipment.Entity[oneThreeShipmentMenuCtrl.currentShipment.code];
            var _menuList = angular.copy(oneThreeShipmentMenuCtrl.ePage.Entities.Header.Meta.MenuList);
            var _index = _menuList.map(function (value, key) {
                return value.Value;
            }).indexOf("MyTask");

            if (oneThreeShipmentMenuCtrl.currentShipment.isNew) {
                _menuList[_index].IsDisabled = true;

                oneThreeShipmentMenuCtrl.ePage.Masters.ShipmentMenu.ListSource = _menuList;
                OnMenuClick(oneThreeShipmentMenuCtrl.ePage.Masters.ShipmentMenu.ListSource[0]);
            } else {
                if (oneThreeShipmentMenuCtrl.ePage.Entities.Header.Data) {
                    GetMyTaskList(_menuList, _index);
                }
            }
        }

        function GetMyTaskList(menuList, index) {
            var _DocumentConfig = {
                // IsDisableRefreshButton: true,
                // IsDisableDeleteHistoryButton: true,
                // IsDisableUpload: true,
                IsDisableGenerate: true,
                // IsDisableRelatedDocument: true,
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
            var _CommentConfig = {
                // IsDisableRefreshButton: true,
                // IsDisableCommentType: true
            };
            var _menuList = menuList,
                _index = index;
            // var _filter = {
            //     C_Performer: authService.getUserInfo().UserId,
            //     Status: "AVAILABLE,ASSIGNED",
            //     EntityRefKey: oneThreeShipmentMenuCtrl.ePage.Entities.Header.Data.PK,
            //     KeyReference: oneThreeShipmentMenuCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo
            // };
            // var _input = {
            //     "searchInput": helperService.createToArrayOfObject(_filter),
            //     "FilterID": appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.FilterID
            // };

            // apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.Url, _input).then(function (response) {
            //     if (response.data.Response) {
            //         if (response.data.Response.length > 0) {
            //             var _response = response.data.Response;
            //             var _arr = [];
            //             if (_response.length > 0) {
            //                 _response.map(function (value, key) {
            //                     value.AvailableObj = {
            //                         RadioBtnOption: "Me",
            //                         SaveBtnText: "Submit",
            //                         IsDisableSaveBtn: false
            //                     };
            //                     value.AssignedObj = {
            //                         RadioBtnOption: "MoveToQueue",
            //                         SaveBtnText: "Submit",
            //                         IsDisableSaveBtn: false
            //                     };
            //                     value.AdhocObj = {
            //                         AssignTo: ""
            //                     };

            //                     if (value.OtherConfig) {
            //                         if (typeof value.OtherConfig == "string") {
            //                             value.OtherConfig = JSON.parse(value.OtherConfig);
            //                         }
            //                         if (value.OtherConfig) {
            //                             if (value.OtherConfig.Directives) {
            //                                 var _index = value.OtherConfig.Directives.ListPage.indexOf(",");
            //                                 if (_index != -1) {
            //                                     var _split = value.OtherConfig.Directives.ListPage.split(",");

            //                                     if (_split.length > 0) {
            //                                         _split.map(function (value, key) {
            //                                             var _index = _arr.map(function (value1, key1) {
            //                                                 return value1;
            //                                             }).indexOf(value);
            //                                             if (_index == -1) {
            //                                                 _arr.push(value);
            //                                             }
            //                                         });
            //                                     }
            //                                 } else {
            //                                     var _index = _arr.indexOf(value.OtherConfig.Directives.ListPage);
            //                                     if (_index == -1) {
            //                                         _arr.push(value.OtherConfig.Directives.ListPage);
            //                                     }
            //                                 }
            //                             }
            //                         }
            //                     }

            //                     if (value.RelatedProcess) {
            //                         if (typeof value.RelatedProcess == "string") {
            //                             value.RelatedProcess = JSON.parse(value.RelatedProcess);
            //                         }
            //                     }

            //                     var _StandardMenuInput = {
            //                         // Entity
            //                         // "Entity": value.ProcessName,
            //                         "Entity": value.WSI_StepCode,
            //                         "Communication": null,
            //                         "Config": undefined,
            //                         "EntityRefKey": value.EntityRefKey,
            //                         "EntityRefCode": value.KeyReference,
            //                         "EntitySource": value.EntitySource,
            //                         // Parent Entity
            //                         "ParentEntityRefKey": value.PK,
            //                         "ParentEntityRefCode": value.WSI_StepCode,
            //                         "ParentEntitySource": value.EntitySource,
            //                         // Additional Entity
            //                         "AdditionalEntityRefKey": value.ParentEntityRefKey,
            //                         "AdditionalEntityRefCode": value.ParentKeyReference,
            //                         "AdditionalEntitySource": value.ParentEntitySource,
            //                         "IsDisableParentEntity": true,
            //                         "IsDisableAdditionalEntity": true
            //                     };

            //                     value.StandardMenuInput = _StandardMenuInput;
            //                     value.DocumentConfig = _DocumentConfig;
            //                     value.CommentConfig = _CommentConfig;
            //                 });
            //             }

            //             if (_arr.length > 0) {
            //                 _arr = _arr.filter(function (e) {
            //                     return e;
            //                 });
            //                 $ocLazyLoad.load(_arr).then(function () {
            //                     oneThreeShipmentMenuCtrl.ePage.Masters.MyTask.ListSource = response.data.Response;
            //                 });
            //             } else {
            //                 oneThreeShipmentMenuCtrl.ePage.Masters.MyTask.ListSource = response.data.Response;
            //             }
            //         } else {
            //             if (_index != -1) {
            //                 _menuList[_index].IsDisabled = true;
            //             }
            //         }
            //     } else {
            oneThreeShipmentMenuCtrl.ePage.Masters.MyTask.ListSource = [];
            if (_index != -1) {
                _menuList[_index].IsDisabled = true;
            }
            //}

            oneThreeShipmentMenuCtrl.ePage.Masters.ShipmentMenu.ListSource = _menuList;

            var _isEnabledFirestTab = false;
            oneThreeShipmentMenuCtrl.ePage.Masters.ShipmentMenu.ListSource.map(function (value, key) {
                if (!_isEnabledFirestTab && !value.IsDisabled) {
                    OnMenuClick(value);
                    _isEnabledFirestTab = true;
                }
            });
            // });
        }

        function OnAddressEdit(selectedItem, addressType, type) {
            $rootScope.OnAddressEditNavType(selectedItem, addressType, type);
            oneThreeShipmentMenuCtrl.ePage.Masters.TabIndex = 10;
        }

        function OnAddressEditBack(selectedItem, addressType, type) {
            oneThreeShipmentMenuCtrl.ePage.Masters.TabIndex = 2;
        }

        function OnMenuClick($item) {
            oneThreeShipmentMenuCtrl.activeTab = $item;
        }

        function TabSelected(tab, $index, $event) {
            var Config = undefined;
            Config = $injector.get("three_shipmentConfig");

            var _index = Config.TabList.map(function (value, key) {
                return value[value.label].ePage.Entities.Header.Data.PK
            }).indexOf(oneThreeShipmentMenuCtrl.currentShipment[oneThreeShipmentMenuCtrl.currentShipment.label].ePage.Entities.Header.Data.PK);

            if (_index !== -1) {
                if (Config.TabList[_index].isNew) {
                    if ($index > 0) {
                        $event.preventDefault();
                        var modalOptions = {
                            closeButtonText: 'No',
                            actionButtonText: 'Yes',
                            headerText: 'Save before tab change..',
                            bodyText: 'Do you want to save?'
                        };
                        confirmation.showModal({}, modalOptions).then(function (result) {
                            three_shipmentConfig.GeneralValidation(oneThreeShipmentMenuCtrl.currentShipment).then(function (response) {
                                var _errorcount = errorWarningService.Modules.Shipment.Entity[oneThreeShipmentMenuCtrl.currentShipment.code].GlobalErrorWarningList;
                                oneThreeShipmentMenuCtrl.ePage.Masters.GlobalErrorWarningList = errorWarningService.Modules.Shipment.Entity[oneThreeShipmentMenuCtrl.currentShipment.code].GlobalErrorWarningList;
                                if (_errorcount.length == 0) {
                                    SaveOnly(oneThreeShipmentMenuCtrl.currentShipment);
                                } else {
                                    helperService.scrollElement('top')
                                    three_shipmentConfig.ShowErrorWarningModal(oneThreeShipmentMenuCtrl.currentShipment);
                                }
                            });
                        }, function () {
                            console.log("Cancelled");
                        });
                    }
                }
            }
        }

        function SaveOnly($item) {


            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

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
                _Data.Header.Data.UIShipmentHeader.ORG_PickupAgent_FK = _Data.Header.Data.UIAddressContactList.PAG.ORG_FK;
                _Data.Header.Data.UIShipmentHeader.ORG_PickupAgent_Code = _Data.Header.Data.UIAddressContactList.PAG.ORG_Code;

                _Data.Header.Data.UIShipmentHeader.PickupFrom_FK = _Data.Header.Data.UIAddressContactList.CRG.ORG_FK;
                _Data.Header.Data.UIShipmentHeader.PickupFromCode = _Data.Header.Data.UIAddressContactList.CRG.ORG_Code;
                _Data.Header.Data.UIShipmentHeader.PickupFromAddress_FK = _Data.Header.Data.UIAddressContactList.CRG.OAD_Address_FK;

                // _Data.Header.Data.UIShipmentHeader.ORG_Shipper_FK = _Data.Header.Data.UIAddressContactList.CRD.ORG_FK;
                // _Data.Header.Data.UIShipmentHeader.ORG_Shipper_Code = _Data.Header.Data.UIAddressContactList.CRD.ORG_Code;

                // _Data.Header.Data.UIShipmentHeader.ORG_Consignee_FK = _Data.Header.Data.UIAddressContactList.CED.ORG_FK;
                // _Data.Header.Data.UIShipmentHeader.ORG_Consignee_Code = _Data.Header.Data.UIAddressContactList.CED.ORG_Code;

                _Data.Header.Data.UIShipmentHeader.DeliveryTo_FK = _Data.Header.Data.UIAddressContactList.CEG.ORG_FK;
                _Data.Header.Data.UIShipmentHeader.DeliveryToCode = _Data.Header.Data.UIAddressContactList.CEG.ORG_Code;
                _Data.Header.Data.UIShipmentHeader.DeliveryToAddress_FK = _Data.Header.Data.UIAddressContactList.CEG.OAD_Address_FK;
            }

            if ($item.isNew) {
                _input.UIShipmentHeader.PK = _input.PK;
                _Data.Header.Data.UIJobEntryNumsObj["EntityRefKey"] = _Data.Header.Data.PK;
                _Data.Header.Data.UIJobEntryNumsObj["EntitySource"] = "SHP";
                _Data.Header.Data.UIJobEntryNumsObj["Category"] = "CUS";
                _Data.Header.Data.UIJobEntryNumsObj["RN_NKCountryCode"] = authService.getUserInfo().CountryCode;
                _Data.Header.Data.UIJobEntryNumsObj["EntryIsSystemGenerated"] = false;
                _Data.Header.Data.UIJobEntryNumsObj["IsValid"] = true;
                _Data.Header.Data.UIJobEntryNums.push(_Data.Header.Data.UIJobEntryNumsObj)
            }
            helperService.SaveEntity($item, 'ShipmentBuyerForwarder').then(function (response) {
                if (response.Status === "success") {
                    three_shipmentConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == oneThreeShipmentMenuCtrl.currentShipment.code) {
                                value.label = oneThreeShipmentMenuCtrl.currentShipment.code;
                                value[oneThreeShipmentMenuCtrl.currentShipment.code] = value.New;

                                delete value.New;
                            }
                        }
                    });

                    var _index = three_shipmentConfig.TabList.map(function (value, key) {
                        return value.label;
                    }).indexOf(oneThreeShipmentMenuCtrl.currentShipment.code);

                    if (_index !== -1) {
                        three_shipmentConfig.TabList[_index][three_shipmentConfig.TabList[_index].label].ePage.Entities.Header.Data.UICustomEntity = response.Data.UICustomEntity;
                        three_shipmentConfig.TabList[_index][three_shipmentConfig.TabList[_index].label].ePage.Entities.Header.Data.UIJobPickupAndDelivery = response.Data.UIJobPickupAndDelivery;
                        three_shipmentConfig.TabList[_index][three_shipmentConfig.TabList[_index].label].ePage.Entities.Header.Data.UIShipmentHeader = response.Data.UIShipmentHeader;
                        three_shipmentConfig.TabList[_index][three_shipmentConfig.TabList[_index].label].ePage.Entities.Header.Data.UIShipmentHeader.CMN_SharedRoleCode = '1_3';
                        three_shipmentConfig.TabList[_index][three_shipmentConfig.TabList[_index].label].ePage.Entities.Header.Data.UIShpExtendedInfo = response.Data.UIShpExtendedInfo;
                        three_shipmentConfig.TabList[_index][three_shipmentConfig.TabList[_index].label].ePage.Entities.Header.Data.UIPorOrderItem = response.Data.UIPorOrderItem;
                        response.Data.UIJobAddress.map(function (val, key) {
                            three_shipmentConfig.TabList[_index][three_shipmentConfig.TabList[_index].label].ePage.Entities.Header.Data.UIAddressContactList[val.AddressType] = val;
                        });
                        response.Data.UIJobEntryNums.map(function (value, key) {
                            if (value.Category === "CUS") {
                                three_shipmentConfig.TabList[_index][three_shipmentConfig.TabList[_index].label].ePage.Entities.Header.Data.UIJobEntryNumsObj = value;
                            }
                        });
                        three_shipmentConfig.TabList[_index].isNew = false;
                        helperService.refreshGrid();
                    }

                } else if (response.Status === "failed") {
                    console.log("Failed");
                }

            });
        }

        Init();
    }
})();