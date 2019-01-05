(function () {
  "use strict";

  angular
    .module("Application")
    .controller("ShipmentServiceAndReferenceController", ShipmentServiceAndReferenceController);

  ShipmentServiceAndReferenceController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "shipmentConfig", "helperService", "toastr", "confirmation"];

  function ShipmentServiceAndReferenceController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, shipmentConfig, helperService, toastr, confirmation) {
    /* jshint validthis: true */
    var ShipmentServiceAndReferenceCtrl = this;

    function Init() {
      var currentShipment = ShipmentServiceAndReferenceCtrl.currentShipment[ShipmentServiceAndReferenceCtrl.currentShipment.label].ePage.Entities;
      ShipmentServiceAndReferenceCtrl.ePage = {
        "Title": "",
        "Prefix": "Shipment_ServiceAndReference",
        "Masters": {
          "Service": {},
          "Reference": {}
        },
        "Meta": helperService.metaBase(),
        "Entities": currentShipment
      };

      ShipmentServiceAndReferenceCtrl.ePage.Masters.DropDownMasterList = shipmentConfig.Entities.Header.Meta;

      // Date Picker
      ShipmentServiceAndReferenceCtrl.ePage.Masters.DatePicker = {};
      ShipmentServiceAndReferenceCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
      ShipmentServiceAndReferenceCtrl.ePage.Masters.DatePicker.isOpen = [];
      ShipmentServiceAndReferenceCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

      ServiceInit();
      ReferenceInit();
    }

    // Date Picker for Service and Reference
    function OpenDatePicker($event, opened) {
      $event.preventDefault();
      $event.stopPropagation();
      ShipmentServiceAndReferenceCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
    }

    // ===================== Service Begin =====================

    function ServiceInit() {
      // Service Form View
      ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView = {};
      ShipmentServiceAndReferenceCtrl.ePage.Masters.LocationAddress = helperService.metaBase();
      ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.IsClicked = false;
      // Service Grid
      ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.gridConfig = ShipmentServiceAndReferenceCtrl.ePage.Entities.Service.gridConfig;
      ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.EditService = EditService;
      ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.DeleteService = DeleteService;
      ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.DeleteConfirmation = DeleteConfirmationService;
      ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.AddToGridService = AddToGridService;
      ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.AddToService = AddToService;
      ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.AddNewAndUpdate = 'Add New';
      ShipmentServiceAndReferenceCtrl.ePage.Masters.SelectedData = SelectedData;
      ShipmentServiceAndReferenceCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
      ShipmentServiceAndReferenceCtrl.ePage.Masters.GetAddressBasedOnLocation = GetAddressBasedOnLocation;
      ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.SelectedGridRow = SelectedGridRowService

      if (!ShipmentServiceAndReferenceCtrl.currentShipment.isNew) {
        GetServiceList();
      } else {
        ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.GridData = [];
      }
    }

    function GetServiceList() {
      // Service grid list
      var _filter = {
        SortColumn: "JOS_ServiceCode",
        SortType: "asc",
        ParentID: ShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PK
      };
      var _input = {
        "searchInput": helperService.createToArrayOfObject(_filter),
        "FilterID": appConfig.Entities.JobService.API.FindAll.FilterID
      };

      apiService.post("eAxisAPI", appConfig.Entities.JobService.API.FindAll.Url, _input).then(function (response) {
        if (response.data.Response) {
          ShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobServices = response.data.Response;
          GetServiceDetails();
        }
      });
    }

    //GridDetails For Service
    function GetServiceDetails() {
      var _gridData = [];
      ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.GridData = undefined;
      $timeout(function () {
        if (ShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobServices.length > 0) {
          ShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobServices.map(function (value, key) {
            _gridData.push(value);
          });
        } else {
          console.log("Service List is Empty");
        }

        ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.GridData = _gridData;
        ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView = {};
        ShipmentServiceAndReferenceCtrl.ePage.Masters.LocationAddress.ListSource = [];
      });
    }

    function AddToService() {
      // body...
      ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView = {};
      ShipmentServiceAndReferenceCtrl.ePage.Masters.LocationAddress.ListSource = [];
      ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.IsFormView = true;
      ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.AddNewAndUpdate = 'Add New';
    }

    function SelectedGridRowService(item, type) {
      if (type == 'edit')
        EditService(item)
      else
        DeleteConfirmationService(item)
    }

    //Edit For Service
    function EditService(item) {
      ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.IsFormView = true;
      ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.AddNewAndUpdate = 'Update';
      ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView = item;

      // ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView.Booked = new Date(ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView.Booked);
      // ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView.Completed = new Date(ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView.Completed);

      // ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView.Duration = new Date(ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView.Duration);
      ShipmentServiceAndReferenceCtrl.ePage.Masters.LocationAddress.ListSource = [];
      ShipmentServiceAndReferenceCtrl.ePage.Masters.GetAddressBasedOnLocation(item.ORG_Location_FK);
    }

    function DeleteConfirmationService(item) {
      var modalOptions = {
        closeButtonText: 'Cancel',
        actionButtonText: 'Ok',
        headerText: 'Delete?',
        bodyText: 'Are you sure?'
      };

      confirmation.showModal({}, modalOptions)
        .then(function (result) {
          DeleteService(item);
        }, function () {
          console.log("Cancelled");
        });
    }
    //Delete For Service
    function DeleteService(item) {
      var _index = ShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobServices.indexOf(item);
      if (_index !== -1) {
        item.IsDeleted = true
        apiService.post("eAxisAPI", appConfig.Entities.JobService.API.Upsert.Url, [item]).then(function (response) {
          if (response.data.Response) {
            ShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobServices.splice(_index, 1);
            GetServiceDetails();
            toastr.success("Record Deleted Successfully...!");
          }
        });
      }
    }

    // AddToGrid For Service
    function AddToGridService(btn) {
      debugger

      var _isEmpty = angular.equals({}, ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView);

      if (!_isEmpty) {
        var _index = ShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobServices.map(function (value, key) {
          return value.PK;
        }).indexOf(ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView.PK);

        if (_index === -1) {
          ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView.ParentID = ShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PK;
          ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView.EntityRefKey = ShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.PK;
          // ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView.ParentTableCode = "JP";
          if (_durationFormView != undefined) {
            var _durationFormView = ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView.Duration;
            var _duration = _durationFormView.getHours() + ":" + _durationFormView.getMinutes() + ":" + _durationFormView.getSeconds();
            var _durationWithDate = "1900-01-01 " + _duration;
            ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView.Duration = _durationWithDate;
          }
          apiService.post("eAxisAPI", appConfig.Entities.JobService.API.Upsert.Url, [ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView]).then(function (response) {
            if (response.data.Response) {
              ShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobServices.push(response.data.Response[0]);
              GetServiceDetails();
              ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.IsFormView = false;
            }
          });
        } else {
          ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView.IsModified = true
          apiService.post("eAxisAPI", appConfig.Entities.JobService.API.Upsert.Url, [ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView]).then(function (response) {
            if (response.data.Response) {
              ShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobServices[_index] = response.data.Response[0]
              ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView = {}
              ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.AddNewAndUpdate = 'Add New';
              GetServiceDetails();
              ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.IsFormView = false;
            }
          });
        }
      } else {
        toastr.success("DataShould not be Empty...!");
      }
    }

    function SelectedData($item) {
      // Selected Grid Data
      if (ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.IsClicked) {
        ShipmentServiceAndReferenceCtrl.ePage.Masters.LocationAddress.ListSource = undefined;
        ShipmentServiceAndReferenceCtrl.ePage.Masters.GetAddressBasedOnLocation($item.PK);
      }
    }

    function AutoCompleteOnSelect($item, type, addressType) {
      if (type === "Location") {
        ShipmentServiceAndReferenceCtrl.ePage.Masters.LocationAddress.ListSource = undefined;
        ShipmentServiceAndReferenceCtrl.ePage.Masters.GetAddressBasedOnLocation($item.PK);
        // GetAddressContactList($item, "OrgAddress", "AddressList", "PK", addressType, GeneralCtrl.ePage.Entities.Header.Meta.AddressContactObject);
      }
    }

    function GetAddressBasedOnLocation(selectedRowPK) {
      ShipmentServiceAndReferenceCtrl.ePage.Masters.Service.IsClicked = false;
      var _filter = {
        ORG_FK: selectedRowPK
      };
      var _input = {
        "searchInput": helperService.createToArrayOfObject(_filter),
        "FilterID": appConfig.Entities.OrgAddress.API.FindAll.FilterID
      };

      apiService.post("eAxisAPI", appConfig.Entities.OrgAddress.API.FindAll.Url, _input).then(function (response) {
        if (response.data.Response) {
          ShipmentServiceAndReferenceCtrl.ePage.Masters.LocationAddress.ListSource = response.data.Response;
        } else {
          console.log("Empty Response");
        }
      });
    }

    // ===================== Service End =====================

    // ===================== Reference Begin =====================

    function ReferenceInit() {
      // Reference Form View
      ShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.FormView = {};
      // Reference Grid
      ShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.gridConfig = ShipmentServiceAndReferenceCtrl.ePage.Entities.Reference.gridConfig;
      ShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.EditReference = EditReference;
      ShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.DeleteReference = DeleteReference;
      ShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.DeleteConfirmation = DeleteConfirmation;
      ShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.AddToGridReference = AddToGridReference;
      ShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.AddToReference = AddToReference;
      ShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.SelectedGridRow = SelectedGridRowReference
      ShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.AddNewAndUpdate = 'Add New'

      if (!ShipmentServiceAndReferenceCtrl.currentShipment.isNew) {
        GetReferenceList();
      } else {
        ShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.GridData = [];
      }
    }

    function AddToReference() {
      // body...
      ShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.FormView = {};
      ShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.IsFormView = true;
      ShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.AddNewAndUpdate = 'Add New';
    }
    // APICall For Service and Reference
    function GetReferenceList() {
      // Reference grid list
      // var _filter = {
      //   SortColumn: "CEN_EntryNum",
      //   SortType: "asc",
      //   EntityRefKey: ShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.PK
      // };
      // var _input = {
      //   "searchInput": helperService.createToArrayOfObject(_filter),
      //   "FilterID": appConfig.Entities.JobEntryNum.API.FindAll.FilterID
      // };

      // apiService.post("eAxisAPI", appConfig.Entities.JobEntryNum.API.FindAll.Url, _input).then(function (response) {
      //   if (response.data.Response) {
      //     ShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobEntryNums = response.data.Response;
      //     // if (ShipmentServiceAndReferenceCtrl.ePage.Entities.Reference.ListSource.length > 0) {
      //     //   ShipmentServiceAndReferenceCtrl.ePage.Entities.Reference.ListSource.map(function (value, key) {
      //     //     ShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobEntryNums.push(value);
      //     //   })
      //     // }
      //     GetReferenceDetails();
      //   }
      // });

      GetReferenceDetails();
    }

    //GridDetails For Reference
    function GetReferenceDetails() {
      var _gridData = [];
      ShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.GridData = undefined;
      $timeout(function () {
        if (ShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobEntryNums.length > 0) {
          ShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobEntryNums.map(function (value, key) {
            if (value.Category !== "CUS") {
              _gridData.push(value);
            }
          });
        } else {
          console.log("Reference List is Empty");
        }

        ShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.GridData = _gridData;
        ShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.FormView = {};
      }, 1000);
    }

    function SelectedGridRowReference(item, type) {
      if (type == 'edit')
        EditReference(item);
      else
        DeleteConfirmation(item);
    }
    //Edit For Reference
    function EditReference(item) {
      ShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.AddNewAndUpdate = 'Update'
      ShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.IsFormView = true;
      ShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.FormView = item;
      // ShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.FormView.IssueDate = new Date(ShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.FormView.IssueDate);
    }

    function DeleteConfirmation(item) {
      var modalOptions = {
        closeButtonText: 'Cancel',
        actionButtonText: 'Ok',
        headerText: 'Delete?',
        bodyText: 'Are you sure?'
      };

      confirmation.showModal({}, modalOptions)
        .then(function (result) {
          DeleteReference(item);
        }, function () {
          console.log("Cancelled");
        });
    }
    //Delete For Reference
    function DeleteReference(item) {
      var _index = ShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobEntryNums.indexOf(item);
      if (_index != -1) {
        apiService.get("eAxisAPI", appConfig.Entities.JobEntryNum.API.Delete.Url + item.PK).then(function (response) {
          if (response.data.Response) {
            ShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobEntryNums.splice(_index, 1);
            toastr.success("Record Deleted Successfully...!");
            GetReferenceDetails();
          }
        });
      }
    }

    // AddToGrid For Reference
    function AddToGridReference() {
      var _isEmpty = angular.equals({}, ShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.FormView);
      if (!_isEmpty) {
        var _index = ShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobEntryNums.map(function (value, key) {
          return value.PK;
        }).indexOf(ShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.FormView.PK);

        if (_index === -1) {
          ShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.FormView.EntityRefKey = ShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.PK;
          ShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.FormView.EntitySource = "SHP";
          ShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.FormView.Category = "OTH";
          ShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.FormView.RN_NKCountryCode = authService.getUserInfo().CountryCode;
          ShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.FormView.EntryIsSystemGenerated = false;
          ShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.FormView.EntityRefKey = ShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.PK;
          apiService.post("eAxisAPI", appConfig.Entities.JobEntryNum.API.Insert.Url, [ShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.FormView]).then(function (response) {
            if (response.data.Response) {
              ShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobEntryNums.push(response.data.Response[0]);
              GetReferenceDetails();
            }
          });

        } else {
          ShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.FormView.IsModified = true;
          apiService.post("eAxisAPI", appConfig.Entities.JobEntryNum.API.Update.Url, ShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.FormView).then(function (response) {
            if (response.data.Response) {
              ShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobEntryNums[_index] = response.data.Response;
              ShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.AddNewAndUpdate = 'Add New'
              GetReferenceDetails();
            }
          });
        }
        ShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.IsFormView = false;
      } else {
        toastr.warning("Data Should not be Empty...!");
      }
    }

    // ===================== Reference End =====================

    Init();
  }
})();