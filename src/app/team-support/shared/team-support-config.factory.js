(function () {
    "use strict";

    angular
        .module("Application")
        .factory('supportConfig', TeamSupportConfig);

    TeamSupportConfig.$inject = ["helperService"];

    function TeamSupportConfig(helperService) {
        var exports = {
            "Entities": {
                "PageList": [{
                    "Name": "Task",
                    "Url": "#/TS/task"
                }, {
                    "Name": "Time Sheet",
                    "Url": "#/TS/time-sheet"
                }, {
                    "Name": "Sprint",
                    "Url": "#/TS/sprint"
                }, {
                    "Name": "Backlog",
                    "Url": "#/TS/backlog"
                }],
                "SupportHeader": {
                    "Data": {},
                    "RowIndex": -1,
                    "Meta": {
                        "Project": helperService.metaBase(),
                        "Sprint": helperService.metaBase(),
                        "User": helperService.metaBase(),
                        "TeamTypeMaster": helperService.metaBase(),
                        "Task": helperService.metaBase(),
                        "Priority": helperService.metaBase(),
                        "Module": helperService.metaBase(),
                        "MainModule": helperService.metaBase(),
                        "Chat": helperService.metaBase(),
                        "TimeSheet": helperService.metaBase(),
                        "Exception": helperService.metaBase()
                    },
                    "Grid": {
                        "ColumnDef": [{
                            "field": "UserId",
                            "displayName": "User",
                        }, {
                            "field": "TSK_Module",
                            "displayName": "Module",
                        }, {
                            "field": "TSK_Title",
                            "displayName": "Task",
                        }, {
                            "field": "Description",
                            "displayName": "Description",
                        }, {
                            "field": "EffortDate",
                            "displayName": "Effort Date",
                            "cellTemplate": "<div class='padding-5 text-single-line'>{{row.entity.EffortDate | date:'dd-MMM-yyyy  hh:mm a'}}</div>"
                        }, {
                            "field": "Effort",
                            "displayName": "Effort",
                        }],
                        "GridOptions": {
                            "enableColumnResizing": true,
                            "enableRowSelection": false,
                            "enableRowHeaderSelection": false,
                            "multiSelect": false,
                            "enableGridMenu": true,
                            "enableColumnMenus": false,
                            "cellTooltip": true,
                            "enableCellSelection": false,
                            "enableCellEdit": false,
                            "enableCellEditOnFocus": false,
                            "enablePinning": false,
                            "enableSorting": true,
                            "useExternalSorting": false,
                            "useExternalPagination": false,
                            "enablePaginationControls": true,
                            "headerRowHeight": 30,
                            "rowHeight": 30,
                            "exporterMenuCsv": true,
                            "exporterCsvFilename": "data.csv",
                            "exporterMenuPdf": true,
                            'exporterPdfFilename': "data.pdf",
                            "paginationPageSize": 25,
                            "paginationPageSizes": [25, 50, 100],
                            "rowTemplate": "<div ng-dblclick='grid.appScope.GridCtrl.ePage.Masters.SelectedGridRow(row,  \"dblClick\")' ng-repeat='(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name' class='ui-grid-cell'  ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>",
                            "gridMenuShowHideColumns": true
                        }
                    }
                },
                "TeamTargetRelease": {
                    "Grid": {
                        "ColumnDef": [{
                            "field": "Date",
                            "displayName": "Date",
                            "cellTemplate": "<div class='text-single-line' >{{x[y.field] | date: 'dd-MMM-yyyy'}}</div>",
                            "width": 150
                        }, {
                            "field": "StartDate",
                            "displayName": "Start Date",
                            "cellTemplate": "<div class='text-single-line' >{{x[y.field] | date: 'dd-MMM-yyyy'}}</div>",
                            "width": 150
                        }, {
                            "field": "Planned",
                            "displayName": "Planned",
                            "width": 150

                        }, {
                            "field": "Remaining",
                            "displayName": "Remaining",
                            "width": 150
                        }, {
                            "field": "Available",
                            "displayName": "Available",
                            "width": 150
                        }, {
                            "field": "IsWorkingDay",
                            "displayName": "IsWorkingDay",
                            "width": 150
                        }],
                        "GridConfig": {
                            "isHeader": false,
                            "isSearch": false,
                            "title": "TeamTarget List",
                            "isSorting": false,
                            "isColumnHeader": true,
                            "isEdit": false,
                            "isDelete": false,
                            "isPagination": false,
                            "itemsPerPage": 10,
                            "isRowTemplate": false,
                            "rowTemplate": `<div data-ng-repeat='y in DynamicTableCtrl.ePage.Masters.GridConfig.columnDef' class='padding-5 clearfix'>
                            <div class='col-sm-1'>{{x.Id}}</div>
                            <div class='col-sm-2'>{{x.FName}}</div>
                            <div class='col-sm-2'>{{x.LName}}</div>
                            </div>`
                        }
                    }
                }
            }
        };

        return exports;
    }
})();
