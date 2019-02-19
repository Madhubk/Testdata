(function () {
    "use strict";

    angular
        .module("Application")
        .controller("bkgBuyerWarehouseProviderDirectiveController", bkgBuyerWarehouseProviderDirectiveController);

    bkgBuyerWarehouseProviderDirectiveController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "$filter", "three_BookingConfig", "toastr", "dynamicLookupConfig", "$injector", "confirmation", "$uibModal", "errorWarningService", "orderApiConfig"];

    function bkgBuyerWarehouseProviderDirectiveController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, helperService, appConfig, $filter, three_BookingConfig, toastr, dynamicLookupConfig, $injector, confirmation, $uibModal, errorWarningService, orderApiConfig) {
        /* jshint validthis: true */
        var bkgBuyerWarehouseProviderDirectiveCtrl = this;

        function Init() {
            var currentBooking;
            (bkgBuyerWarehouseProviderDirectiveCtrl.currentBooking) ? currentBooking = bkgBuyerWarehouseProviderDirectiveCtrl.currentBooking[bkgBuyerWarehouseProviderDirectiveCtrl.currentBooking.label].ePage.Entities: currentBooking = bkgBuyerWarehouseProviderDirectiveCtrl.obj[bkgBuyerWarehouseProviderDirectiveCtrl.obj.label].ePage.Entities;
            bkgBuyerWarehouseProviderDirectiveCtrl.currentBooking = currentBooking;
            bkgBuyerWarehouseProviderDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Booking_Directive",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentBooking,
            };
            // DatePicker
            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.DatePicker = {};
            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.Booking.Entity[bkgBuyerWarehouseProviderDirectiveCtrl.obj.code].GlobalErrorWarningList;
            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.Booking.Entity[bkgBuyerWarehouseProviderDirectiveCtrl.obj.code];
            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.modeChange = ModeChange;
            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.addRemoveServiceType = AddRemoveServiceType;
            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.DropDownMasterList = three_BookingConfig.Entities.Header.Meta;
            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.addLineItem = AddLineItem;
            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.singleRecordView = SingleRecordView;
            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.deAttachOrder = DeAttachOrder;

            // Callback
            // var _isEmpty = angular.equals({}, bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.DropDownMasterList);
            // if (_isEmpty) {
            GetMastersList();
            // }
            GetGridConfig();
            getOpenOrders();
            getAttachedOrders();
            InitShipmentHeader();
            getServices();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetMastersList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["INCOTERM", "FREIGHTTERMS"];
            var dynamicFindAllInput = [];

            typeCodeList.map(function (value, key) {
                dynamicFindAllInput[key] = {
                    "FieldName": "TypeCode",
                    "value": value
                }
            });
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": appConfig.Entities.CfxTypes.API.DynamicFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.DynamicFindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    typeCodeList.map(function (value, key) {
                        bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });

            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.cfxTypeList = {}
            var _inputObj = {
                "TypeCode": "CNTTYPE",
            };
            var _input = {
                "FilterID": appConfig.Entities.CfxTypes.API.FindAllWithParent.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_inputObj)
            }
            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.FindAllWithParent.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.cfxTypeList.CNTTYPE = response.data.Response
                    var obj = _.filter(bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.cfxTypeList.CNTTYPE, {
                        'Key': bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode
                    })[0];
                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.selectedMode = obj;
                }
            });


        }

        function ModeChange(obj) {
            if (obj) {
                bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = obj.Key
                bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = obj.PARENT_Key
            } else {
                bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = null
                bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = null
            }
            TransportModeChangesMdm();
        }


        // ===================== Shipment Header Begin =====================

        function InitShipmentHeader() {
            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.Address = {};
            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.OnAddressChange = OnAddressChange;
            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.OnContactChange = OnContactChange;
            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.OnAddressEdit = OnAddressEdit;
            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.AddressContactBinding = AddressContactBinding;


        }

        function SelectedLookupData($item, model, type, addressType) {
            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK = bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_FK;
            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK = bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_FK;
            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader[model] = $item.data.entity.Code;
            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader[model.split('_')[1] + 'Name'] = $item.data.entity.FullName;
            // bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("Booking", bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo, model, code, IsArray);
            if (type === "address") {
                AddressContactList($item.data.entity, addressType);
            }
            if (addressType == 'CRD' && bkgBuyerWarehouseProviderDirectiveCtrl.obj.isNew) {
                getOrgBuyerSupplierMapping()
            }
        }

        function AutoCompleteOnSelect($item, IsArray, code, model, type, addressType) {
            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK = bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_FK;
            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK = bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_FK;
            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader[model] = $item.Code;
            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader[model.split('_')[1] + 'Name'] = $item.FullName;
            // bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("Booking", bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo, model, code, IsArray);
            if (type === "address") {
                AddressContactList($item, addressType);
            }
            if (addressType == 'CRD' && bkgBuyerWarehouseProviderDirectiveCtrl.obj.isNew) {
                getOrgBuyerSupplierMapping()
            }
        }

        function getOpenOrders() {
            if (bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code && bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code) {
                bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.paginationOptions = {
                    "IsShpCreated": "false",
                    "SortColumn": "POH_CreatedDateTime",
                    "SortType": "DESC",
                    "Buyer": bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code,
                    "Supplier": bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code,
                    "SendingAgentCode": bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_Code
                };
                getDataAsynPage(bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.paginationOptions)
            }

        }

        function GetGridConfig() {
            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.column = [

                {
                    "field": "OrderNo",
                    "displayName": "Open POs",
                    "width": 100,
                },
                {
                    "field": "OrderDate",
                    "displayName": "PO Date",
                    "width": 65,
                    cellTemplate: "<div class='padding-5'><span  title='{{row.entity.OrderDate}}' >{{row.entity.OrderDate | date:'dd-MMM-yy'}}</span></div>"
                },

                {
                    "field": "GoodsAvailableAt",
                    "displayName": "Origin",
                    "width": 60,
                    // cellTemplate: "<div class='gridCellStyle'><span  title='{{row.entity.GoodsOrigin}}' >{{row.entity.GoodsOrigin}}</span></div>"
                },
                {
                    "field": "GoodsDeliveredTo",
                    "displayName": "Dstn.",
                    "width": 60,
                    // cellTemplate: "<div class='gridCellStyle'><span  title='{{row.entity.GoodsDestination}}' >{{row.entity.GoodsDestination}}</span></div>"
                },
                {
                    "field": "GoodsDeliveredTo",
                    "displayName": "Attach.",
                    "width": 50,
                    cellTemplate: "<div class='padding-5' style='height:30px;'><a href='' ng-click='grid.appScope.bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.addLineItem(row.entity,rowRenderIndex)'><i style='font-size: 16px;' class='fa fa-arrow-circle-right'></i></a></div>"
                }
            ];
            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.gridOptions = {
                enableSorting: true,
                enableGridMenu: false,
                enableColumnMenus: true,
                useExternalSorting: true,
                headerRowHeight: 30,
                rowHeight: 30,
                cellTooltip: true,
                enableColumnResizing: true,
                columnDefs: bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.column,
                data: bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.data,
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (sortColumns.length == 0) {
                            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.paginationOptions.sortType = null;
                        } else {
                            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.paginationOptions.sortType = sortColumns[0].sort.direction;
                            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.paginationOptions.sortColumn = "POH_" + sortColumns[0].field;
                        }
                        bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.IsLoading = true
                        getDataAsynPage(bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.paginationOptions);
                    });
                }
            };
        }

        function getDataAsynPage(obj) {

            var _input = {
                "FilterID": orderApiConfig.Entities.BuyerForwarderOrder.API.findall.FilterID,
                "SearchInput": helperService.createToArrayOfObject(obj)
            }
            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.gridOptions.data = [];
            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.IsLoading = true;
            apiService.post("eAxisAPI", orderApiConfig.Entities.BuyerForwarderOrder.API.findall.Url, _input).then(function (response) {
                if (response.data) {
                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.data = response.data.Response;
                    if (bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.data.length === 0) {
                        bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.IsNoRecords = true;
                    } else {
                        bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.IsNoRecords = false;
                    }
                } else {
                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.data = [];
                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.IsNoRecords = true;
                }
                bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.IsLoading = false;
                GetGridConfig()
            });


        }

        function getAttachedOrders() {
            var _inputObj = {
                "SHP_FK": bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.PK,
                "SortColumn": "POH_OrderNo",
                "SortType": "ASC",
                "PageNumber": "1",
                "PageSize": 100,
            };
            var _input = {
                "FilterID": orderApiConfig.Entities.BuyerForwarderOrder.API.findall.FilterID,
                "searchInput": helperService.createToArrayOfObject(_inputObj)
            };
            apiService.post('eAxisAPI', orderApiConfig.Entities.BuyerForwarderOrder.API.findall.Url, _input).then(function (response) {
                if (response.data.Response) {
                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIOrderHeaders = response.data.Response;
                }
            });
        }

        function AddLineItem(row, index, bool) {
            var paramObj = {
                "row": row,
                "index": index,
                "shipment": bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data,
                "order": bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.data,
                "edit": bool
            };
            var modalInstance = $uibModal.open({
                animation: true,
                keyboard: false,
                backdrop: 'static',
                windowClass: 'orderLineItem',
                templateUrl: 'app/eaxis/buyer/freight/booking/1_3_buyer_warehouse_provider_booking/1_3_booking-default/1_3_booking-directive/tabs/orderline-popup.html',
                controller: 'OrderLinePopupController',
                controllerAs: 'OrderLinePopupCtrl',
                resolve: {
                    items: function () {
                        return paramObj;
                    }
                }
            });

            modalInstance.result.then(function () {

            }, function () {

            });

        }

        function DeAttachOrder(row, index) {
            var _index = bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIOrderHeaders.map(function (value, key) {
                return value.PK;
            }).indexOf(row.PK);
            if (row.SHP_FK != null || row.SHP_FK != '00000000-0000-0000-0000-000000000000') {
                bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.data.push(row)
                bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIOrderHeaders[_index].IsDeleted = true;
            } else {
                bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.data.push(row)
                bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIOrderHeaders.splice(index, 1)
            }
            if (bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.data.length > 0) {
                bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.IsNoRecords = false;
            } else {
                bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.IsNoRecords = true;
            }
        }

        function SingleRecordView(obj) {
            var _queryString = {
                PK: obj.PK,
                OrderNo: obj.OrderCumSplitNo
            };
            _queryString = helperService.encryptData(_queryString);
            if (obj.OrderType == 'POR') {
                $window.open("#/EA/single-record-view/order-view?q=" + _queryString, "_blank");
            } else if (obj.OrderType == 'DOR') {
                $window.open("#/EA/single-record-view/delivery-order-view?q=" + _queryString, "_blank");
            }
        }

        function AddressContactBinding($item, type) {
            var str = "";
            if ($item != undefined && type == "Address") {
                str = $item.Address1 + " " + $item.Address2;;
                return str
            } else if ($item != undefined && type == "Contact") {
                str = $item.ContactName + " " + $item.Email + " " + $item.Phone;
                return str
            } else {
                return str
            }
        }

        function AddressContactList($item, addressType) {
            getMDMDefaulvalues();
            var AddressList = GetAddressContactList($item, "OrgAddress", "AddressList", "PK", addressType, bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList);
            var ContactList = GetAddressContactList($item, "OrgContact", "ContactList", "PK", addressType, bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList);
            // default main address list find
            AddressList.then(function (value) {
                value.map(function (val, key) {
                    var IsMain = val.AddressCapability.some(function (valu, key) {
                        return valu.IsMainAddress == true;
                    });
                    if (IsMain) {
                        OnAddressChange(val, addressType, "Address");
                    }
                });
            });
            // default main contact list find
            ContactList.then(function (value) {
                value.map(function (val, key) {
                    OnContactChange(val, addressType, "Contact")
                });
            });
        }

        function GetAddressContactList(GetSelectedRow, api, listSource, keyName, addressType, obj) {
            obj[addressType][listSource] = undefined;
            obj[addressType].IsModified = true;

            var _filter = {
                ORG_FK: GetSelectedRow[keyName]
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities[api].API.FindAll.FilterID
            };

            return apiService.post("eAxisAPI", appConfig.Entities[api].API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    obj[addressType][listSource] = response.data.Response;
                    return response.data.Response;
                } else {
                    console.log("Empty Response");
                }
            });
        }

        function OnAddressChange(selectedItem, addressType, type) {
            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters["Is" + addressType + "AddressOpen"] = false
            if (type === "Address") {
                if (selectedItem) {
                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OAD_Address_FK = selectedItem.PK;
                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OAD_Code = selectedItem.Code;
                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].CompanyName = selectedItem.CompanyNameOverride;
                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Address1 = selectedItem.Address1;
                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Address2 = selectedItem.Address2;
                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].PostCode = selectedItem.PostCode;
                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].City = selectedItem.City;
                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].State = selectedItem.State;
                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Country = selectedItem.RelatedPortCode.substring(0, 2);
                }
            }
        }

        function OnAddressEdit(selectedItem, addressType, type) {
            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters["Is" + addressType + "AddressOpen"] = false
        }

        function OnContactChange(selectedItem, addressType, type) {
            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters["Is" + addressType + "ContactOpen"] = false
            if (type === "Contact") {
                if (selectedItem) {
                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OCT_FK = selectedItem.PK;
                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].ContactName = selectedItem.ContactName;
                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Phone = selectedItem.Phone;
                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Mobile = selectedItem.Mobile;
                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Email = selectedItem.Email;
                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Fax = selectedItem.Fax;
                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].PhoneExtension = selectedItem.PhoneExtension;
                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].HomePhone = selectedItem.HomePhone;
                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OtherPhone = selectedItem.OtherPhone;
                }
            }
        }


        // ===================== Shipment Header End =====================
        function getServices() {
            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.serviceTypes = {
                "Pickup": "PIC",
                "Delivery": "DLV",
                "FactoryStuffing": "FAS",
                "ExportClearance": "EXC",
                "ImportClearance": "IMC",
                "CargoInsurance": "CAI"
            }

            var _input = {
                "EntityRefKey": bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PK,
            };

            var inputObj = {
                "FilterID": appConfig.Entities.JobService.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_input)
            }
            if (!bkgBuyerWarehouseProviderDirectiveCtrl.obj.isNew) {
                apiService.post('eAxisAPI', appConfig.Entities.JobService.API.FindAll.Url, inputObj).then(function (response) {
                    if (response.data.Response) {
                        bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices = response.data.Response
                        if (bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.length != 0) {
                            for (var i in bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.serviceTypes) {
                                var tempObj = _.filter(bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices, {
                                    'ServiceCode': bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.serviceTypes[i]
                                })[0];
                                if (tempObj == undefined) {
                                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.serviceTypes[i] = 'false'
                                } else {
                                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.serviceTypes[i] = tempObj.ServiceCode
                                }
                            }
                        } else {
                            for (var i in bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.serviceTypes) {
                                bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.serviceTypes[i] = "false"
                            }
                        }
                    }
                });
            } else {
                for (var i in bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.serviceTypes) {
                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.serviceTypes[i] = "false"
                }
            }

        }

        function AddRemoveServiceType(type, model) {
            var tempObj = _.filter(bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices, {
                'ServiceCode': type
            })[0];
            var _index = bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.indexOf(tempObj);
            if (model == 'false') {
                if (tempObj.PK == undefined) {
                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.splice(_index, 1);
                } else {
                    tempObj.IsDeleted = true;
                }
            } else {
                if (tempObj == undefined) {
                    var obj = {
                        'ServiceCode': type
                    }
                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.push(obj);
                }
            }
        }

        function getMDMDefaulvalues() {
            if (bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK && bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK) {
                apiService.get("eAxisAPI", appConfig.Entities.OrgBuyerSupplierMapping.API.GetMDMDfaultFields.Url + bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK + '/' + bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.UIOrgBuySupMappingTrnMode) {
                            bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.UIOrgBuySupMappingTrnMode = response.data.Response.UIOrgBuySupMappingTrnMode
                            if (bkgBuyerWarehouseProviderDirectiveCtrl.obj.isNew) {
                                if (response.data.Response.UIOrgBuySupMappingTrnMode.length > 0) {
                                    var obj = _.filter(bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.cfxTypeList.CNTTYPE, {
                                        'Key': response.data.Response.UIOrgBuySupMappingTrnMode[0].ContainerMode
                                    })[0];
                                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.selectedMode = obj;
                                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = obj.PARENT_Key;
                                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = obj.Key;
                                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IncoTerm = response.data.Response.UIOrgBuySupMappingTrnMode[0].IncoTerm;
                                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfLoading = response.data.Response.UIOrgBuySupMappingTrnMode[0].LoadPort;
                                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfDischarge = response.data.Response.UIOrgBuySupMappingTrnMode[0].DischargePort;
                                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin = response.data.Response.UIOrgBuySupMappingTrnMode[0].LoadPort;
                                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination = response.data.Response.UIOrgBuySupMappingTrnMode[0].DischargePort;
                                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_Code = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_SendingAgentCode;
                                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_FK = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_SendingAgentPK;
                                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_Code = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_ReceivingAgentCode;
                                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_FK = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_ReceivingAgentPK;
                                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_ControlCustomCode = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_ControllingCustomerCode;
                                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_ControlCustom_FK = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_ControllingCustomerFK;
                                    getOpenOrders();
                                    OnFieldValueChange();
                                }
                            }
                        }
                    }
                });
            }
        }

        function TransportModeChangesMdm() {
            if (bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.UIOrgBuySupMappingTrnMode.length > 0) {
                var obj = _.filter(bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.UIOrgBuySupMappingTrnMode, {
                    'ContainerMode': bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode
                })[0];
                if (obj) {
                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IncoTerm = obj.IncoTerm;
                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfLoading = obj.LoadPort;
                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfDischarge = obj.DischargePort;
                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin = obj.LoadPort;
                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination = obj.DischargePort;
                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_Code = obj.ORG_SendingAgentCode;
                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_FK = obj.ORG_SendingAgentPK;
                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_Code = obj.ORG_ReceivingAgentCode;
                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_FK = obj.ORG_ReceivingAgentPK;

                }
            }
            OnFieldValueChange();
        }

        function OnFieldValueChange() {
            var _obj = {
                ModuleName: ["Booking"],
                Code: [bkgBuyerWarehouseProviderDirectiveCtrl.obj.code],
                API: "Group", // Validation/Group
                FilterInput: {
                    ModuleCode: "BKG",
                    SubModuleCode: "BKG",
                    // Code: "E0013"
                },
                GroupCode: "BUY_FWD_BKG_TRANS",
                // RelatedBasicDetails: [{
                //     "UIField": "TEST",
                //     "DbField": "TEST",
                //     "Value": "TEST"
                // }],
                EntityObject: bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data,
                // ErrorCode: []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function getOrgBuyerSupplierMapping() {
            var _inputObj = {
                "SupplierCode": bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code
            }
            var _input = {
                "FilterID": appConfig.Entities.OrgBuyerSupplierMapping.API.FindAll.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_inputObj)
            }
            apiService.post("eAxisAPI", appConfig.Entities.OrgBuyerSupplierMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.OrgBuyerDetails = response.data.Response;
                    if (bkgBuyerWarehouseProviderDirectiveCtrl.obj.isNew) {
                        var tempBuyObj = bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Masters.OrgBuyerDetails[0];
                        OnSelectSupplier(tempBuyObj);
                    }
                }
            });
        }

        function OnSelectSupplier($item) {
            if ($item) {
                apiService.get("eAxisAPI", appConfig.Entities.OrgHeader.API.GetById.Url + $item.ORG_Buyer).then(function (response) {
                    if (response.data.Response) {
                        bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code = response.data.Response.Code;
                        bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK = response.data.Response.PK;
                        bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ConsigneeName = response.data.Response.FullName;
                        bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_FK = response.data.Response.PK;
                        bkgBuyerWarehouseProviderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_Code = response.data.Response.Code;
                        AddressContactList(response.data.Response, 'CED');
                    }
                });
            }
        }



        Init();
    }

    "use strict";

    angular
        .module("Application")
        .controller("OrderLinePopupController", OrderLinePopupController);

    OrderLinePopupController.$inject = ["$uibModalInstance", "apiService", "items", "orderApiConfig", "appConfig"];

    function OrderLinePopupController($uibModalInstance, apiService, items, orderApiConfig, appConfig) {
        var OrderLinePopupCtrl = this;

        function init() {
            OrderLinePopupCtrl.ePage = {
                "Masters": {}
            }
            OrderLinePopupCtrl.ePage.Masters.row = items.row;
            OrderLinePopupCtrl.ePage.Masters.index = items.index;
            OrderLinePopupCtrl.ePage.Masters.shipment = items.shipment;
            OrderLinePopupCtrl.ePage.Masters.order = items.order;
            OrderLinePopupCtrl.ePage.Masters.edit = items.edit;
            OrderLinePopupCtrl.ePage.Masters.attachOrder = AttachOrder;
            OrderLinePopupCtrl.ePage.Masters.attachOrderCancel = AttachOrderCancel;
            OrderLinePopupCtrl.ePage.Masters.attachBtn = "Attach";
            OrderLinePopupCtrl.ePage.Masters.attachBtnDisable = false;
            initLineItem();
        }

        function initLineItem() {
            apiService.get("eAxisAPI", orderApiConfig.Entities.BuyerForwarderOrder.API["1_3_listgetbyid"].Url + OrderLinePopupCtrl.ePage.Masters.row.PK).then(function (res) {
                if (res.data.Response) {
                    console.log(res.data.Response);
                    OrderLinePopupCtrl.ePage.Masters.UIOrderLine_Buyer_Forwarder = res.data.Response.UIOrderLine_Buyer_Forwarder;
                    OrderLinePopupCtrl.ePage.Masters.UIOrder_Buyer_Forwarder = res.data.Response.UIOrder_Buyer_Forwarder;
                }
            });
        }

        function AttachOrder() {
            OrderLinePopupCtrl.ePage.Masters.attachBtn = "Please wait...";
            OrderLinePopupCtrl.ePage.Masters.attachBtnDisable = true;
            var updateOrderLine = [];
            OrderLinePopupCtrl.ePage.Masters.UIOrderLine_Buyer_Forwarder.map(function (value, key) {
                var obj = {
                    "EntityRefPK": value.PK,
                    "Properties": [{
                        "PropertyName": "POL_InvoicedQuantity",
                        "PropertyNewValue": parseInt(value.InvoicedQuantity),
                    }]
                };
                updateOrderLine.push(obj);
            });
            apiService.post("eAxisAPI", appConfig.Entities.PorOrderLine.API.UpdateRecords.Url, updateOrderLine).then(function (res) {
                if (res.data.Response) {
                    if (OrderLinePopupCtrl.ePage.Masters.edit == undefined) {
                        orderAttachUpdate();
                    } else {
                        $uibModalInstance.dismiss('cancel');
                    }
                }
            });

        }

        function orderAttachUpdate() {
            var orderAttach = [{
                "EntityRefPK": OrderLinePopupCtrl.ePage.Masters.row.PK,
                "Properties": [{
                    "PropertyName": "POH_SHP_FK",
                    "PropertyNewValue": OrderLinePopupCtrl.ePage.Masters.shipment.PK,
                }, {
                    "PropertyName": "POH_ShipmentNo",
                    "PropertyNewValue": OrderLinePopupCtrl.ePage.Masters.shipment.UIShipmentHeader.ShipmentNo,
                }]
            }];

            var _index = OrderLinePopupCtrl.ePage.Masters.shipment.UIOrderHeaders.map(function (value, key) {
                return value.PK;
            }).indexOf(OrderLinePopupCtrl.ePage.Masters.row.PK);
            if (_index !== -1) {
                OrderLinePopupCtrl.ePage.Masters.shipment.UIOrderHeaders[_index].IsDeleted = false;
            } else {
                OrderLinePopupCtrl.ePage.Masters.UIOrder_Buyer_Forwarder.IsDeleted = false;
                OrderLinePopupCtrl.ePage.Masters.shipment.UIOrderHeaders.push(OrderLinePopupCtrl.ePage.Masters.UIOrder_Buyer_Forwarder)
            }
            // OrderLinePopupCtrl.ePage.Masters.shipment.UIOrderHeaders.push(OrderLinePopupCtrl.ePage.Masters.UIOrder_Buyer_Forwarder);
            OrderLinePopupCtrl.ePage.Masters.order.splice(OrderLinePopupCtrl.ePage.Masters.index, 1);
            $uibModalInstance.dismiss('cancel');

            console.log(OrderLinePopupCtrl.ePage.Masters.shipment.UIOrderHeaders);

        }

        function AttachOrderCancel() {
            $uibModalInstance.dismiss('cancel');
        }

        init();
    }
})();