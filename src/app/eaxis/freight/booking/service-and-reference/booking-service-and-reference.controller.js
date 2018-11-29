(function () {
  "use strict";

  angular
    .module("Application")
    .controller("BookingServiceAndReferenceController", BookingServiceAndReferenceController);

  BookingServiceAndReferenceController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "BookingConfig", "helperService", "toastr", "confirmation"];

  function BookingServiceAndReferenceController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, BookingConfig, helperService, toastr, confirmation) {
    /* jshint validthis: true */
    var BookingServiceAndReferenceCtrl = this;

    function Init() {
      var currentBooking = BookingServiceAndReferenceCtrl.currentBooking[BookingServiceAndReferenceCtrl.currentBooking.label].ePage.Entities;
      BookingServiceAndReferenceCtrl.ePage = {
        "Title": "",
        "Prefix": "Booking_ServiceAndReference",
        "Masters": {
          "Service": {},
          "Reference": {}
        },
        "Meta": helperService.metaBase(),
        "Entities": currentBooking
      };

      BookingServiceAndReferenceCtrl.ePage.Masters.DropDownMasterList = BookingConfig.Entities.Header.Meta;

      // Date Picker
      BookingServiceAndReferenceCtrl.ePage.Masters.DatePicker = {};
      BookingServiceAndReferenceCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
      BookingServiceAndReferenceCtrl.ePage.Masters.DatePicker.isOpen = [];
      BookingServiceAndReferenceCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

      ServiceInit();
      ReferenceInit();
    }

    // Date Picker for Service and Reference
    function OpenDatePicker($event, opened) {
      $event.preventDefault();
      $event.stopPropagation();
      BookingServiceAndReferenceCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
    }

    // ===================== Service Begin =====================

    function ServiceInit() {
      // Service Form View
      BookingServiceAndReferenceCtrl.ePage.Masters.Service.FormView = {};
      BookingServiceAndReferenceCtrl.ePage.Masters.LocationAddress = helperService.metaBase();
      BookingServiceAndReferenceCtrl.ePage.Masters.Service.IsClicked = false;
      // Service Grid
      // BookingServiceAndReferenceCtrl.ePage.Masters.Service.gridConfig = BookingServiceAndReferenceCtrl.ePage.Entities.Service.gridConfig;
      BookingServiceAndReferenceCtrl.ePage.Masters.Service.EditService = EditService;
      BookingServiceAndReferenceCtrl.ePage.Masters.Service.DeleteService = DeleteService;
      BookingServiceAndReferenceCtrl.ePage.Masters.Service.DeleteConfirmation = DeleteConfirmationService;
      BookingServiceAndReferenceCtrl.ePage.Masters.Service.AddToGridService = AddToGridService;
      BookingServiceAndReferenceCtrl.ePage.Masters.Service.AddToService = AddToService;
      BookingServiceAndReferenceCtrl.ePage.Masters.Service.AddNewAndUpdate = 'Add New';
      BookingServiceAndReferenceCtrl.ePage.Masters.SelectedData = SelectedData;
      BookingServiceAndReferenceCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
      BookingServiceAndReferenceCtrl.ePage.Masters.GetAddressBasedOnLocation = GetAddressBasedOnLocation;
      BookingServiceAndReferenceCtrl.ePage.Masters.Service.SelectedGridRow = SelectedGridRowService

      if (!BookingServiceAndReferenceCtrl.currentBooking.isNew) {
        GetServiceList();
      } else {
        BookingServiceAndReferenceCtrl.ePage.Masters.Service.GridData = [];
      }
    }

    function GetServiceList() {
      // Service grid list
      var _filter = {
        SortColumn: "JOS_ServiceCode",
        SortType: "asc",
        EntityRefKey: BookingServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PK
      };
      var _input = {
        "searchInput": helperService.createToArrayOfObject(_filter),
        "FilterID": appConfig.Entities.JobService.API.FindAll.FilterID
      };

      apiService.post("eAxisAPI", appConfig.Entities.JobService.API.FindAll.Url, _input).then(function (response) {
        if (response.data.Response) {
          BookingServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobServices = response.data.Response;
          GetServiceDetails();
        }
      });
    }

    //GridDetails For Service
    function GetServiceDetails() {
      var _gridData = [];
      BookingServiceAndReferenceCtrl.ePage.Masters.Service.GridData = undefined;
      $timeout(function () {
        if (BookingServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobServices.length > 0) {
          BookingServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobServices.map(function (value, key) {
            _gridData.push(value);
          });
        } else {
          console.log("Service List is Empty");
        }

        BookingServiceAndReferenceCtrl.ePage.Masters.Service.GridData = _gridData;
        BookingServiceAndReferenceCtrl.ePage.Masters.Service.FormView = {};
        BookingServiceAndReferenceCtrl.ePage.Masters.LocationAddress.ListSource = [];
      });
    }

    function AddToService() {
      // body...
      BookingServiceAndReferenceCtrl.ePage.Masters.Service.FormView = {};
      BookingServiceAndReferenceCtrl.ePage.Masters.LocationAddress.ListSource = [];
      BookingServiceAndReferenceCtrl.ePage.Masters.Service.IsFormView = true;
      BookingServiceAndReferenceCtrl.ePage.Masters.Service.AddNewAndUpdate = 'Add New';
    }

    function SelectedGridRowService($item,type) {
      if (type == 'edit')
        EditService($item)
      else
        DeleteConfirmationService($item)
    }

    //Edit For Service
    function EditService($item) {
      BookingServiceAndReferenceCtrl.ePage.Masters.Service.IsFormView = true;
      BookingServiceAndReferenceCtrl.ePage.Masters.Service.AddNewAndUpdate = 'Update';
      BookingServiceAndReferenceCtrl.ePage.Masters.Service.FormView = $item;

      // BookingServiceAndReferenceCtrl.ePage.Masters.Service.FormView.Booked = new Date(BookingServiceAndReferenceCtrl.ePage.Masters.Service.FormView.Booked);
      // BookingServiceAndReferenceCtrl.ePage.Masters.Service.FormView.Completed = new Date(BookingServiceAndReferenceCtrl.ePage.Masters.Service.FormView.Completed);

      // BookingServiceAndReferenceCtrl.ePage.Masters.Service.FormView.Duration = new Date(BookingServiceAndReferenceCtrl.ePage.Masters.Service.FormView.Duration);
      BookingServiceAndReferenceCtrl.ePage.Masters.LocationAddress.ListSource = [];
      BookingServiceAndReferenceCtrl.ePage.Masters.GetAddressBasedOnLocation(BookingServiceAndReferenceCtrl.ePage.Masters.Service.FormView.ORG_Location_FK);
    }

    function DeleteConfirmationService($item) {
      var modalOptions = {
        closeButtonText: 'Cancel',
        actionButtonText: 'Ok',
        headerText: 'Delete?',
        bodyText: 'Are you sure?'
      };

      confirmation.showModal({}, modalOptions)
        .then(function (result) {
          DeleteService($item);
        }, function () {
          console.log("Cancelled");
        });
    }
    //Delete For Service
    function DeleteService($item) {
      console.log($item)
      var _index = BookingServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobServices.indexOf($item.data);
      if (_index !== -1) {
        $item.data.IsDeleted = true
        apiService.post("eAxisAPI", appConfig.Entities.JobService.API.Upsert.Url, [$item.data]).then(function (response) {
          if (response.data.Response) {
            BookingServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobServices.splice(_index, 1);
            GetServiceDetails();
            toastr.success("Record Deleted Successfully...!");
          }
        });
      }
    }

    // AddToGrid For Service
    function AddToGridService(btn) {
      var _isEmpty = angular.equals({}, BookingServiceAndReferenceCtrl.ePage.Masters.Service.FormView);

      if (!_isEmpty) {
        var _index = BookingServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobServices.map(function (value, key) {
          return value.PK;
        }).indexOf(BookingServiceAndReferenceCtrl.ePage.Masters.Service.FormView.PK);

        if (_index === -1) {
          BookingServiceAndReferenceCtrl.ePage.Masters.Service.FormView.EntityRefKey = BookingServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PK;
          // BookingServiceAndReferenceCtrl.ePage.Masters.Service.FormView.ParentTableCode = "JP";
          if (_durationFormView != undefined) {
            var _durationFormView = BookingServiceAndReferenceCtrl.ePage.Masters.Service.FormView.Duration;
            var _duration = _durationFormView.getHours() + ":" + _durationFormView.getMinutes() + ":" + _durationFormView.getSeconds();
            var _durationWithDate = "1900-01-01 " + _duration;
            BookingServiceAndReferenceCtrl.ePage.Masters.Service.FormView.Duration = _durationWithDate;
          }
          apiService.post("eAxisAPI", appConfig.Entities.JobService.API.Upsert.Url, [BookingServiceAndReferenceCtrl.ePage.Masters.Service.FormView]).then(function (response) {
            if (response.data.Response) {
              BookingServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobServices.push(response.data.Response[0]);
              GetServiceDetails();
              BookingServiceAndReferenceCtrl.ePage.Masters.Service.IsFormView = false;
            }
          });
        } else {
          BookingServiceAndReferenceCtrl.ePage.Masters.Service.FormView.IsModified = true
          apiService.post("eAxisAPI", appConfig.Entities.JobService.API.Upsert.Url, [BookingServiceAndReferenceCtrl.ePage.Masters.Service.FormView]).then(function (response) {
            if (response.data.Response) {
              BookingServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobServices[_index] = response.data.Response[0]
              BookingServiceAndReferenceCtrl.ePage.Masters.Service.FormView = {}
              BookingServiceAndReferenceCtrl.ePage.Masters.Service.AddNewAndUpdate = 'Add New';
              GetServiceDetails();
              BookingServiceAndReferenceCtrl.ePage.Masters.Service.IsFormView = false;
            }
          });
        }
      } else {
        toastr.success("DataShould not be Empty...!");
      }
    }

    function SelectedData($item) {
      // Selected Grid Data
      if (BookingServiceAndReferenceCtrl.ePage.Masters.Service.IsClicked) {
        BookingServiceAndReferenceCtrl.ePage.Masters.LocationAddress.ListSource = undefined;
        BookingServiceAndReferenceCtrl.ePage.Masters.GetAddressBasedOnLocation($item.entity.PK);
      }
    }

    function AutoCompleteOnSelect($item, type, addressType) {
      if (type === "Location") {
        BookingServiceAndReferenceCtrl.ePage.Masters.LocationAddress.ListSource = undefined;
        BookingServiceAndReferenceCtrl.ePage.Masters.GetAddressBasedOnLocation($item.PK);
        // GetAddressContactList($item, "OrgAddress", "AddressList", "PK", addressType, GeneralCtrl.ePage.Entities.Header.Meta.AddressContactObject);
      }
    }

    function GetAddressBasedOnLocation(selectedRowPK) {
      BookingServiceAndReferenceCtrl.ePage.Masters.Service.IsClicked = false;
      var _filter = {
        ORG_FK: selectedRowPK
      };
      var _input = {
        "searchInput": helperService.createToArrayOfObject(_filter),
        "FilterID": appConfig.Entities.OrgAddress.API.FindAll.FilterID
      };

      apiService.post("eAxisAPI", appConfig.Entities.OrgAddress.API.FindAll.Url, _input).then(function (response) {
        if (response.data.Response) {
          BookingServiceAndReferenceCtrl.ePage.Masters.LocationAddress.ListSource = response.data.Response;
        } else {
          console.log("Empty Response");
        }
      });
    }

    // ===================== Service End =====================

    // ===================== Reference Begin =====================

    function ReferenceInit() {
      // Reference Form View
      BookingServiceAndReferenceCtrl.ePage.Masters.Reference.FormView = {};
      // Reference Grid
      // BookingServiceAndReferenceCtrl.ePage.Masters.Reference.gridConfig = BookingServiceAndReferenceCtrl.ePage.Entities.Reference.gridConfig;
      BookingServiceAndReferenceCtrl.ePage.Masters.Reference.EditReference = EditReference;
      BookingServiceAndReferenceCtrl.ePage.Masters.Reference.DeleteReference = DeleteReference;
      BookingServiceAndReferenceCtrl.ePage.Masters.Reference.DeleteConfirmation = DeleteConfirmation;
      BookingServiceAndReferenceCtrl.ePage.Masters.Reference.AddToGridReference = AddToGridReference;
      BookingServiceAndReferenceCtrl.ePage.Masters.Reference.AddToReference = AddToReference;
      BookingServiceAndReferenceCtrl.ePage.Masters.Reference.SelectedGridRow = SelectedGridRowReference
      BookingServiceAndReferenceCtrl.ePage.Masters.Reference.AddNewAndUpdate = 'Add New'

      if (!BookingServiceAndReferenceCtrl.currentBooking.isNew) {
        GetReferenceList();
      } else {
        BookingServiceAndReferenceCtrl.ePage.Masters.Reference.GridData = [];
      }
    }

    function AddToReference() {
      // body...
      BookingServiceAndReferenceCtrl.ePage.Masters.Reference.FormView = {};
      BookingServiceAndReferenceCtrl.ePage.Masters.Reference.IsFormView = true;
      BookingServiceAndReferenceCtrl.ePage.Masters.Reference.AddNewAndUpdate = 'Add New';
    }
    // APICall For Service and Reference
    function GetReferenceList() {
      // Reference grid list
      // var _filter = {
      //   SortColumn: "CEN_EntryNum",
      //   SortType: "asc",
      //   EntityRefKey: BookingServiceAndReferenceCtrl.ePage.Entities.Header.Data.PK
      // };
      // var _input = {
      //   "searchInput": helperService.createToArrayOfObject(_filter),
      //   "FilterID": appConfig.Entities.JobEntryNum.API.FindAll.FilterID
      // };

      // apiService.post("eAxisAPI", appConfig.Entities.JobEntryNum.API.FindAll.Url, _input).then(function (response) {
      //   if (response.data.Response) {
      //     BookingServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobEntryNums = response.data.Response;
      //     // if (BookingServiceAndReferenceCtrl.ePage.Entities.Reference.ListSource.length > 0) {
      //     //   BookingServiceAndReferenceCtrl.ePage.Entities.Reference.ListSource.map(function (value, key) {
      //     //     BookingServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobEntryNums.push(value);
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
      BookingServiceAndReferenceCtrl.ePage.Masters.Reference.GridData = undefined;
      $timeout(function () {
        if (BookingServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobEntryNums.length > 0) {
          BookingServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobEntryNums.map(function (value, key) {
            if (value.Category !== "CUS") {
              _gridData.push(value);
            }
          });
        } else {
          console.log("Reference List is Empty");
        }

        BookingServiceAndReferenceCtrl.ePage.Masters.Reference.GridData = _gridData;
        BookingServiceAndReferenceCtrl.ePage.Masters.Reference.FormView = {};
      }, 1000);
    }

    function SelectedGridRowReference($item,type) {
      if (type == 'edit')
        EditReference($item)
      else
        DeleteConfirmation($item)
    }
    //Edit For Reference
    function EditReference($item) {
      BookingServiceAndReferenceCtrl.ePage.Masters.Reference.AddNewAndUpdate = 'Update'
      BookingServiceAndReferenceCtrl.ePage.Masters.Reference.IsFormView = true;
      BookingServiceAndReferenceCtrl.ePage.Masters.Reference.FormView = $item
      // BookingServiceAndReferenceCtrl.ePage.Masters.Reference.FormView.IssueDate = new Date(BookingServiceAndReferenceCtrl.ePage.Masters.Reference.FormView.IssueDate);
    }

    function DeleteConfirmation($item) {
      var modalOptions = {
        closeButtonText: 'Cancel',
        actionButtonText: 'Ok',
        headerText: 'Delete?',
        bodyText: 'Are you sure?'
      };

      confirmation.showModal({}, modalOptions)
        .then(function (result) {
          DeleteReference($item);
        }, function () {
          console.log("Cancelled");
        });
    }
    //Delete For Reference
    function DeleteReference($item) {
      var _index = BookingServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobEntryNums.indexOf($item.data);
      if (_index != -1) {
        apiService.get("eAxisAPI", appConfig.Entities.JobEntryNum.API.Delete.Url + $item.data.PK).then(function (response) {
          if (response.data.Response) {
            BookingServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobEntryNums.splice(_index, 1);
            toastr.success("Record Deleted Successfully...!");
            GetReferenceDetails();
          }
        });
      }
    }

    // AddToGrid For Reference
    function AddToGridReference() {
      var _isEmpty = angular.equals({}, BookingServiceAndReferenceCtrl.ePage.Masters.Reference.FormView);

      if (!_isEmpty) {
        var _index = BookingServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobEntryNums.map(function (value, key) {
          return value.PK;
        }).indexOf(BookingServiceAndReferenceCtrl.ePage.Masters.Reference.FormView.PK);

        if (_index === -1) {
          BookingServiceAndReferenceCtrl.ePage.Masters.Reference.FormView.EntityRefKey = BookingServiceAndReferenceCtrl.ePage.Entities.Header.Data.PK;
          BookingServiceAndReferenceCtrl.ePage.Masters.Reference.FormView.EntitySource = "SHP";
          BookingServiceAndReferenceCtrl.ePage.Masters.Reference.FormView.Category = "OTH";
          BookingServiceAndReferenceCtrl.ePage.Masters.Reference.FormView.RN_NKCountryCode = authService.getUserInfo().CountryCode;
          BookingServiceAndReferenceCtrl.ePage.Masters.Reference.FormView.EntryIsSystemGenerated = false;
          apiService.post("eAxisAPI", appConfig.Entities.JobEntryNum.API.Insert.Url, [BookingServiceAndReferenceCtrl.ePage.Masters.Reference.FormView]).then(function (response) {
            if (response.data.Response) {
              BookingServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobEntryNums.push(response.data.Response[0]);
              GetReferenceDetails();
            }
          });

        } else {
          BookingServiceAndReferenceCtrl.ePage.Masters.Reference.FormView.IsModified = true;
          apiService.post("eAxisAPI", appConfig.Entities.JobEntryNum.API.Update.Url, BookingServiceAndReferenceCtrl.ePage.Masters.Reference.FormView).then(function (response) {
            if (response.data.Response) {
              BookingServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobEntryNums[_index] = response.data.Response;
              BookingServiceAndReferenceCtrl.ePage.Masters.Reference.AddNewAndUpdate = 'Add New'
              GetReferenceDetails();
            }
          });
        }
        BookingServiceAndReferenceCtrl.ePage.Masters.Reference.IsFormView = false;
      } else {
        toastr.warning("Data Should not be Empty...!");
      }
    }

    // ===================== Reference End =====================

    Init();
  }
})();