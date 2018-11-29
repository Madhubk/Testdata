(function () {
    "use strict";

    angular
        .module("Application")
        .factory('consolidationConfig', ConsolidationConfig);

    ConsolidationConfig.$inject = ["$location", "$q", "apiService", "toastr", "helperService", "errorWarningService"];

    function ConsolidationConfig($location, $q, apiService, toastr, helperService, errorWarningService) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "RowIndex": -1,
                    "API": {

                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "ConsolList/GetById/",
                            "FilterID": "CONSHEAD"
                        },
                        "ConsolActivityClose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "ConsolList/ConsolActivityClose/",
                            "FilterID": ""
                        }
                    },
                    "Meta": {}
                }
            },
            "TabList": [],
            "GetTabDetails": GetTabDetails,
            "GeneralValidation": GeneralValidation,
            "ShowErrorWarningModal": ShowErrorWarningModal,
            "PortsComparison": PortsComparison
        };
        return exports;

        function GetTabDetails(currentConsol, isNew) {
            // Set configuration object to individual Consolidation
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {
                            "UIDynamicData": {}
                        },
                        "RowIndex": -1,
                        "API": {
                            "GetByID": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "ConsolList/GetById/",
                                "FilterID": "CONSHEAD"
                            },
                            "InsertConsol": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "ConsolList/Insert"
                            },
                            "UpdateConsol": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "ConsolList/Update"
                            }
                        },
                        "Meta": {
                            "MenuList": [{
                                "DisplayName": "My Task",
                                "Value": "MyTask",
                                "Icon": "menu-icon icomoon icon-my-task",
                                "IsDisabled": false
                            },
                            {
                                "DisplayName": "Consol Details",
                                "Value": "General",
                                "Icon": "fa-tags",
                                "GParentRef": "General",
                                "IsDisabled": false
                            },
                            {
                                "DisplayName": "Arrival & Departure",
                                "Value": "ArrivalDeparture",
                                "Icon": "fa-train",
                                "IsDisabled": false
                            },
                            {
                                "DisplayName": "Linked Shipments",
                                "Value": "Shipments",
                                "Icon": "fa-plane",
                                "IsDisabled": false
                            },
                            {
                                "DisplayName": "Routing",
                                "Value": "Routing",
                                "Icon": "fa-ship",
                                "IsDisabled": false
                            },
                            {
                                "DisplayName": "Containers",
                                "Value": "Containers",
                                "Icon": "fa-truck",
                                "IsDisabled": false
                            },
                            {
                                "DisplayName": "Packlines Allocation",
                                "Value": "Packing",
                                "Icon": "fa-suitcase",
                                "IsDisabled": false
                            },
                            {
                                "DisplayName": "Address",
                                "Value": "Address",
                                "Icon": "fa-address-card-o",
                                "IsDisabled": false
                            }
                            ]
                        }
                    },
                    "GlobalVariables": {
                        "Loading": false,
                        "NonEditable": false,
                    },
                    "ConsolShipment": {
                        "ListSource": [],
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "ConShpMapping/FindAll",
                                "FilterID": "CONSHPMAP"
                            },
                            "GetShipment": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "ShipmentHeader/FindAll",
                                "FilterID": "SHIPHEAD"
                            }
                        },
                        "Meta": {}
                    },
                    "Container": {
                        "Data": {},
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CntContainer/FindAll",
                                "FilterID": "CONTHEAD"
                            },
                            "GetById": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "CntContainer/GetById/"
                            },
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CntContainer/Insert2"
                            },
                            "Update": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CntContainer/Update"
                            },
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CntContainer/Delete/"
                            }
                        },
                        "Meta": {},
                        "Grid": {
                            "ColumnDef": [{
                                "field": "ContainerNo",
                                "displayName": "Container No",
                            }, {
                                "field": "ContainerMode",
                                "displayName": "Container Mode"
                            }, {
                                "field": "ContainerStatus",
                                "displayName": "Container Status"
                            }, {
                                "field": "DeliveryMode",
                                "displayName": "Delivery Mode",
                            }, {
                                "field": "IsEmptyContainer",
                                "displayName": "Is Empty Container"
                            }],
                            "GridConfig": {
                                "isHeader": false,
                                "isSearch": false,
                                "title": "User Details",
                                "isSorting": false,
                                "isColumnHeader": true,
                                "isEdit": true,
                                "isDelete": true,
                                "isPagination": false,
                                "itemsPerPage": 10,
                                "isRowTemplate": false
                            }
                        }
                    },
                    "Reference": {
                        "Data": {},
                        "ListSource": [],
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "JobEntryNum/FindAll",
                                "FilterID": "JENTNUM"
                            }
                        },
                        "Meta": {
                            "ReferenceType": helperService.metaBase()
                        },
                        "Grid": {
                            "ColumnDef": [{
                                "field": "EntryNum",
                                "displayName": "Number",
                            }, {
                                "field": "EntryType",
                                "displayName": "Number Type",
                            }],

                            "GridConfig": {
                                "isHeader": false,
                                "isSearch": false,
                                "title": "User Details",
                                "isSorting": false,
                                "isColumnHeader": true,
                                "isEdit": true,
                                "isDelete": true,
                                "isPagination": false,
                                "itemsPerPage": 10,
                                "isRowTemplate": false
                            }
                        }
                    },
                    "Routing": {
                        "Data": {},
                        "ListSource": [],
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "JobRoutes/FindAll",
                                "FilterID": "JOBROUT"
                            }
                        },
                        "Meta": {
                            "Mode": helperService.metaBase(),
                            "Type": helperService.metaBase(),
                            "Status": helperService.metaBase(),
                            "LegOrder": helperService.metaBase()
                        },
                        "Grid": {
                            "ColumnDef": [{
                                "field": "LegOrder",
                                "displayName": "LegOrder",
                            }, {
                                "field": "TransportMode",
                                "displayName": "Mode",
                            }, {
                                "field": "TransportType",
                                "displayName": "Type",
                            }, {
                                "field": "Status",
                                "displayName": "Status",
                            }, {
                                "field": "Vessel",
                                "displayName": "Vessel",
                            }, {
                                "field": "VoyageFlight",
                                "displayName": "Voyage/Flight",
                            }, {
                                "field": "LoadPort",
                                "displayName": "Load",
                            }, {
                                "field": "DischargePort",
                                "displayName": "Discharge",
                            }, {
                                "field": "IsDomestic",
                                "displayName": "Is Domestic",
                            }, {
                                "field": "ETD",
                                "displayName": "ETD",
                                "cellTemplate": "<div class='padding-5 text-single-line'>{{row.entity.ETD | date:'dd-MMM-yyyy  hh:mm a'}}</div>",
                                "isDateField": true
                            }, {
                                "field": "ETA",
                                "displayName": "ETA",
                                "cellTemplate": "<div class='padding-5 text-single-line'>{{row.entity.ETA | date:'dd-MMM-yyyy  hh:mm a'}}</div>",
                                "isDateField": true
                            }, {
                                "field": "ATD",
                                "displayName": "ATD",
                                "cellTemplate": "<div class='padding-5 text-single-line'>{{row.entity.ATD | date:'dd-MMM-yyyy  hh:mm a'}}</div>",
                                "isDateField": true
                            }, {
                                "field": "ATA",
                                "displayName": "ATA",
                                "cellTemplate": "<div class='padding-5 text-single-line'>{{row.entity.ATA | date:'dd-MMM-yyyy  hh:mm a'}}</div>",
                                "isDateField": true
                            }, {
                                "field": "Edit",
                                "displayName": "Edit",
                                "width": 60,
                                "cellTemplate": "<div  class='padding-5 text-single-line text-center'><span class='fa fa-pencil-square-o cursor-pointer' data-ng-click='grid.appScope.GridCtrl.ePage.Masters.OnEditSelectedRow(row)'></span></div>",
                            }, {
                                "field": "Delete",
                                "displayName": "Delete",
                                "width": 60,
                                "cellTemplate": "<div  class='padding-5 text-single-line text-center'><span class='fa fa-trash-o cursor-pointer danger' data-ng-click='grid.appScope.GridCtrl.ePage.Masters.OnDeleteSelectedRow(row)'></span></div>",
                            }],
                            "GridConfig": {
                                "_gridHeight": 230,
                                "_enableRowSelection": false,
                                "_enableRowHeaderSelection": false,
                                "_multiSelect": false,
                                "_exporterCsvFilename": "data",
                                '_exporterPdfFilename': "data",
                                "_enablePaginationControls": false,
                                "_enableGridMenu": false,
                                "_enableColumnMenus": false,
                                "_enableCellSelection": false,
                                "_enableCellEdit": false,
                                "_enableSorting": true,
                                "_useExternalSorting": false,
                                "_useExternalPagination": false,
                                "_isAPI": false,
                                "_rowTemplate": "<div ng-dblclick='grid.appScope.GridCtrl.ePage.Masters.OnRowDoubleClick(grid, row)' ng-repeat='(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name' class='ui-grid-cell' ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>",
                                "_columnPrefix": "RUT_",
                                "_sortColumn": "ATA",
                                "_sortType": "ASC",
                                "_pageNumber": 1,
                                "_paginationPageSize": 5000,
                                "_paginationPageSizes": [25, 50, 100]
                            }
                        }
                    },
                    "PkgCntMapping": {
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PkgCntMapping/FindAll",
                                "FilterID": "PKGCNTMA"
                            },
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PkgCntMapping/Insert"
                            },
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PkgCntMapping/UnAllocatePackLines/"
                            },
                            "ShpPackagesFindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "JobPackLines/FindAll",
                                "FilterID": "JOBPACK"
                            },
                            "FindAllUnAllocatedPacks": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "JobPackLines/FindAllUnAllocatedPacks",
                                "FilterID": "JOBPACK"
                            }
                        }
                    }
                }
            };

            if (isNew) {
                _exports.Entities.Header.Data = currentConsol.data;
                var obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentConsol.entity.ConsolNo,
                    isNew: isNew
                };
                exports.TabList.push(obj);
                deferred.resolve(exports.TabList);
            } else {
                // Get Consolidation details and set to configuration list
                apiService.get("eAxisAPI", exports.Entities.Header.API.GetByID.Url + currentConsol.PK).then(function (response) {
                    if (response.data.Messages) {
                        response.data.Messages.map(function (value, key) {
                            if (value.Type === "Warning" && value.MessageDesc !== "") {
                                toastr.info(value.MessageDesc);
                            }
                        });
                    }

                    _exports.Entities.Header.Data = response.data.Response;

                    var obj = {
                        [currentConsol.ConsolNo]: {
                            ePage: _exports
                        },
                        label: currentConsol.ConsolNo,
                        code: currentConsol.ConsolNo,
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
        }

        function GeneralValidation($item) {
            //General Page Validation
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;
            var _deferred = $q.defer();
            errorWarningService.OnFieldValueChange("Consol", $item.code, _input.UIConConsolHeader.AgentType, 'E0001', false);
            errorWarningService.OnFieldValueChange("Consol", $item.code, _input.UIConConsolHeader.FirstLoadPort, 'E0003', false);
            errorWarningService.OnFieldValueChange("Consol", $item.code, _input.UIConConsolHeader.LastDischargePort, 'E0004', false);
            errorWarningService.OnFieldValueChange("Consol", $item.code, _input.UIConConsolHeader.ContainerMode, 'E0005', false);
            if (_input.UIConConsolHeader.FirstLoadPort && _input.UIConConsolHeader.LastDischargePort) {
                var port = PortsComparison(_input.UIConConsolHeader.FirstLoadPort, _input.UIConConsolHeader.LastDischargePort)
                if (port) {
                    if (_input.UIConConsolHeader.IsDomestic) {
                        errorWarningService.OnFieldValueChange("Consol", $item.code, true, 'E0002', false);
                    } else {
                        errorWarningService.OnFieldValueChange("Consol", $item.code, false, 'E0002', false);
                    }
                } else {
                    if (!_input.UIConConsolHeader.IsDomestic) {
                        errorWarningService.OnFieldValueChange("Consol", $item.code, true, 'E0002', false);
                    } else {
                        errorWarningService.OnFieldValueChange("Consol", $item.code, false, 'E0002', false);
                    }
                }
            }


            _deferred.resolve(errorWarningService);


            return _deferred.promise;

        }

        function PortsComparison(Str1, Str2) {
            if (Str1 && Str2) {
                if (Str1.slice(0, 2) == Str2.slice(0, 2)) {
                    return true
                } else {
                    return false
                }
            }
        }
    }
})();