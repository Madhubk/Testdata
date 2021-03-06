(function () {
    "use strict";

    angular
        .module("Application")
        .factory('dmsManifestConfig', ManifestConfig);

    ManifestConfig.$inject = ["$location", "$q", "helperService", "apiService", "toastr", "errorWarningService"];

    function ManifestConfig($location, $q, helperService, apiService, toastr, errorWarningService) {

        var exports = {
            "Entities": {
                "Header": {
                    "RowIndex": -1,
                    "API": {
                        "FindConfig": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "DataEntry/Dynamic/FindConfig",
                            "FilterID": "DYNDAT"
                        },
                        "DataEntry": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "DataEntryMaster/FindAll",
                            "FilterID": "DYNDAT"
                        },
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "TmsManifestList/GetById/"
                        },
                        "Validationapi": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "Validation/FindAll",
                            "FilterID": "VALIDAT"
                        },
                        "OrgHeader": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "OrgHeader/FindAll",
                            "FilterID": "ORGHEAD"
                        },
                        "MstContainer": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "MstContainer/FindAll",
                            "FilterID": "MSTCONT"
                        },
                        "OrgHeaderWarehouse": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "OrgHeaderWarehouse/FindAll",
                            "FilterID": "TMSORGWAREH"
                        },
                        "InsertManifest": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "TmsManifestList/Insert"
                        },
                        "UpdateManifest": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "TmsManifestList/Update"
                        },
                        "UpdateOrgAddress": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "OrgAddress/Update"
                        },
                        "CfxMenus": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "CfxMenus/FindAll",
                            "FilterID": "CFXMENU"
                        },
                        "PickList": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsPickReleaseLine/FindAll",
                            "FilterID": "WMSPICREL"
                        },
                        "CountryState": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "CountryState/FindAll",
                            "FilterID": "MSTCSTE"
                        },
                        "CountryList": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "MstCountry/FindAll",
                            "FilterID": "MSTCOUN"
                        },
                        "InsertAddress": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "OrgAddress/Insert",
                            "FilterID": "ORGADDR"
                        }
                    },
                    "Meta": {


                    }
                }

            },

            "TabList": [],
            "GetTabDetails": GetTabDetails,
            "ValidationValues": "",

            "TempConsignmentNumber": "",
            "activeTabIndex": 0,
            "SelectedValue": "",
            "TransporterTypeValue": "",
            // "GeneralValidation": GeneralValidation,
            // "RemoveApiErrors": RemoveApiErrors,
            // "PushErrorWarning": PushErrorWarning,
            // "RemoveErrorWarning": RemoveErrorWarning,
            // "GetErrorWarningCountParent": GetErrorWarningCountParent,
            "ShowErrorWarningModal": ShowErrorWarningModal,
            // "ValidationFindall": ValidationFindall,
        };

        return exports;

        function GetTabDetails(currentManifest, isNew) {
            // Set configuration object to individual Consolidation
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "RowIndex": -1,
                        "API": {
                            "InsertManifest": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "TmsManifestList/Insert"
                            },
                            "UpdateManifest": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "TmsManifestList/Update"
                            },
                            "CfxTypes": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CfxTypes/FindAll/",
                                "FilterID": "CFXTYPE"
                            },
                            "OrgAddress": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgAddress/FindAll",
                                "FilterID": "ORGADDR"
                            },
                            "GetOrderList": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "TmsConsignmentWithOrders/FindAll",
                                "FilterID": "TMSCONWO"
                            },
                            "GetOrderLineList": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsPickLineSummary/FindAll",
                                "FilterID": "WMSPLS"
                            },
                            "ConsignmentGetByID": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "TmsConsignmentList/GetById/",
                            },
                            "GetConsignmentItem": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "TmsConsignmentItem/FindAll"
                            },
                            "GetConsignmentList": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "TmsConsignment/FindAll",
                                "FilterID": "TMSCON"
                            },
                            "OrgHeader": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgHeader/FindAll",
                                "FilterID": "ORGHEAD"
                            },
                            "GenerateReport": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "Communication/GenerateReport",
                            },
                            "ManifestSummary": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "TmsSingleManifestSummary/GetById/",
                            },
                            "MstContainer": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "MstContainer/FindAll",
                                "FilterID": "MSTCONT"
                            },
                            "OrgHeaderWarehouse": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgHeaderWarehouse/FindAll",
                                "FilterID": "TMSORGWAREH"
                            },
                            "TMSGatepass": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "TMSGatepass/FindAll",
                                "FilterID": "TMSGATP"
                            },
                            "OrgUserAcess": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgUserAcess/FindAll",
                                "FilterID": "ORGUACC"
                            },
                            "TmsGeoRoute": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "TmsGeoRoute/FindAll",
                                "FilterID": "TMSGEOJ"
                            },
                            "CfxMenus": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CfxMenus/FindAll",
                                "FilterID": "CFXMENU"
                            },
                            "PickList": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsPickReleaseLine/FindAll",
                                "FilterID": "WMSPICREL"
                            },
                            "CountryState": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CountryState/FindAll",
                                "FilterID": "MSTCSTE"
                            },
                            "CountryList": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "MstCountry/FindAll",
                                "FilterID": "MSTCOUN"
                            },
                            "InsertAddress": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgAddress/Insert",
                                "FilterID": "ORGADDR"
                            },
                            "CmpDepartment": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CmpDepartment/FindAll",
                                "FilterID": "CMPDEPT"
                            },
                            "TrackingStatusFindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "TmsStatusHistory/FindAll",
                                "FilterID": "TMSSH"
                            },
                        },

                        "Meta": {
                            "MenuList": {
                                "UnloadMenu": [{
                                    "DisplayName": "Create Manifest",
                                    "Value": "CreateManifest",
                                    "Icon": "fa fa-truck",
                                    "GParentRef": "manifestgeneral"
                                }, {
                                    "DisplayName": "Attach Consignment",
                                    "Value": "AttachOrders",
                                    "Icon": "fa fa-plane",
                                    "GParentRef": "manifestorders"
                                },
                                // {
                                //     "DisplayName": "Add Items",
                                //     "Value": "AttachLines",
                                //     "Icon": "fa fa-plane",
                                //     "GParentRef": "manifestitem"
                                // },
                                {
                                    "DisplayName": "Confirm Manifest",
                                    "Value": "ConfirmManifest",
                                    "Icon": "fa fa-plane",
                                    "GParentRef": "approvemanifest"
                                },
                                // {
                                //     "DisplayName": "Approve Manifest",
                                //     "Value": "ApproveManifest",
                                //     "Icon": "fa fa-plane",
                                //     "GParentRef": "approvemanifest"
                                // },
                                {
                                    "DisplayName": "Confirm Transport Booking",
                                    "Value": "ConfirmTransportBooking",
                                    "Icon": "fa fa-plane",
                                    "GParentRef": "confirmtransportbooking"
                                }, {
                                    "DisplayName": "Confirm Verify & Delivery",
                                    "Value": "CompleteManifest",
                                    "Icon": "fa fa-plane",
                                    "GParentRef": "completemanifest"
                                }],
                                "LoadMenu": [{
                                    "DisplayName": "Create Manifest",
                                    "Value": "CreateManifest",
                                    "Icon": "fa fa-truck",
                                    "GParentRef": "manifestgeneral"
                                }, {
                                    "DisplayName": "Attach Consignment",
                                    "Value": "AttachOrders",
                                    "Icon": "fa fa-plane",
                                    "GParentRef": "manifestorders"
                                },
                                // {
                                //     "DisplayName": "Add Items",
                                //     "Value": "AttachLines",
                                //     "Icon": "fa fa-plane",
                                //     "GParentRef": "manifestitem"
                                // },
                                {
                                    "DisplayName": "Confirm Manifest",
                                    "Value": "ConfirmManifest",
                                    "Icon": "fa fa-plane",
                                    "GParentRef": "approvemanifest"
                                },
                                // {
                                //     "DisplayName": "Approve Manifest",
                                //     "Value": "ApproveManifest",
                                //     "Icon": "fa fa-plane",
                                //     "GParentRef": "approvemanifest"
                                // },
                                {
                                    "DisplayName": "Confirm Transport Booking",
                                    "Value": "ConfirmTransportBooking",
                                    "Icon": "fa fa-plane",
                                    "GParentRef": "confirmtransportbooking"
                                },
                                {
                                    "DisplayName": "Confirm Verify & Delivery",
                                    "Value": "CompleteManifest",
                                    "Icon": "fa fa-plane",
                                    "GParentRef": "completemanifest"
                                }],
                                "SubMenu": [{
                                    "DisplayName": "Confirm Vehicle Arrival",
                                    "Value": "ConfirmVehicleArrival",
                                    "Icon": "fa fa-plane",
                                    "GParentRef": "confirmvehiclearrival"
                                }, {
                                    "DisplayName": "Dock in Vehicle",
                                    "Value": "DockinVehicle",
                                    "Icon": "fa fa-plane",
                                    "GParentRef": "dockinvehicle"
                                }, {
                                    "DisplayName": "Start Load",
                                    "Value": "StartLoad",
                                    "Icon": "fa fa-plane",
                                    "GParentRef": "startload"
                                }, {
                                    "DisplayName": "Complete Load",
                                    "Value": "LoadItems",
                                    "Icon": "fa fa-plane",
                                    "GParentRef": "loaditems"
                                }, {
                                    "DisplayName": "Dock out Vehicle",
                                    "Value": "DockoutVehicle",
                                    "Icon": "fa fa-plane",
                                    "GParentRef": "dockoutvehicle"
                                }, {
                                    "DisplayName": "Gate Out",
                                    "Value": "Issueexitgatepass",
                                    "Icon": "fa fa-plane",
                                    "GParentRef": "issueexitgatepass"
                                },
                                {
                                    "DisplayName": "Generate DRS",
                                    "Value": "deliveryrunsheet",
                                    "Icon": "fa fa-plane",
                                    "GParentRef": "deliveryrunsheet"
                                }]
                            },
                            "SenderCode": helperService.metaBase(),
                            "ReceiverCode": helperService.metaBase(),
                            "ManifestType": helperService.metaBase(),
                            "TransporterCode": helperService.metaBase(),
                            "EstimatedDispatchDate": helperService.metaBase(),
                            "EstimatedDeliveryDate": helperService.metaBase(),
                            "DockNo": helperService.metaBase(),
                            // "ErrorWarning": {
                            // "GlobalErrorWarningList": [],
                            "Address1": helperService.metaBase(),
                            "City": helperService.metaBase(),
                            "CountryCode": helperService.metaBase(),
                            "State": helperService.metaBase(),
                            "PostCode": helperService.metaBase(),
                            "Language": helperService.metaBase(),
                            "Mobile": helperService.metaBase(),
                            "Email": helperService.metaBase(),
                            "RelatedPortCode": helperService.metaBase(),

                            // },
                        },
                        "CheckPoints": {
                            "IsConsignmentAttach": false,
                            "ActiveMenu": 0,
                            "ActiveSubMenu": -1,
                            "IsCallMenuFunction": false,
                            "IsCallSubMenuFunction": false,
                            "WarehouseClient": undefined,
                            "IsWarehouseClient": false,
                            "IsPickupDeliveryList": false,
                            "IsToggleFilter": false,
                            "isShowFooter": false,
                            "ReceiverClient": undefined,
                            "IsDisableBtn": false,
                            "IsLoadingToSave": false,
                            "Loading": false,
                        },
                    },
                }
            }


            if (isNew) {
                _exports.Entities.Header.Data = currentManifest.data;
                _exports.Entities.Header.GetById = currentManifest.data;
                _exports.Entities.Header.Validations = currentManifest.Validations;

                var obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentManifest.entity.ManifestNumber,
                    isNew: isNew
                };
                exports.TabList.push(obj);
                deferred.resolve(exports.TabList);
            }
            else {
                // Get Consolidation details and set to configuration list
                apiService.get("eAxisAPI", exports.Entities.Header.API.GetByID.Url + currentManifest.PK).then(function (response) {

                    _exports.Entities.Header.Data = response.data.Response;
                    _exports.Entities.Header.Validations = response.data.Validations;

                    var obj = {
                        [currentManifest.ManifestNumber]: {
                            ePage: _exports
                        },
                        label: currentManifest.ManifestNumber,
                        code: currentManifest.ManifestNumber,
                        isNew: isNew
                    };
                    exports.TabList.push(obj);
                    deferred.resolve(exports.TabList);
                });
            }
            return deferred.promise;
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject.code).toggleClass("open");
            if (errorWarningService.Modules.Manifest.Entity[EntityObject.code].GlobalErrorWarningList.length == 0) {
                $("#errorWarningContainer" + EntityObject.code).removeClass("open");
            }
        }
    }
})();


