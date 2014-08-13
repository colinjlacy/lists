angular.module("boomLists")
    .controller("viewCtrl", function($scope, $http, $routeParams, $rootScope, $location, messages) {

        var getList = function(id) {
            $http({
	            url: 'server/retrieve_list_items.php',
	            method: "GET",
	            params: {
		            list_id: id
	            }
            })
                .success(function(data) {
		            console.log(data);
                    $rootScope.activeList = data[0];
                    $scope.items = JSON.parse(data[1]);
                })
                .error(function(error) {
                    $scope.viewError = error;
                })
        };
        getList($routeParams.id);

        $scope.doneToggle = function(item) {
            if (item.done == 1) {
                item.done = 0;
            } else {
                item.done = 1;
            }
        };

        $scope.hideDoneToggle = function() {
            if ($scope.hideDone) {
                $scope.hideDone = false;
                document.getElementById('hide-toggle').innerHTML="Hide Checked";
            } else {
                $scope.hideDone = true;
                document.getElementById('hide-toggle').innerHTML="Show Checked";
            }
        };

        $scope.shouldBeHidden = function(item) {
            if ($scope.hideDone && item.done == 1) {
                return true;
            }
        };

        $scope.updateList = function() {
            var doneArray = [];

            console.log($scope.items);

            for(var i = 0; i < $scope.items.length; i++) {
                console.log($scope.items[i].id + " = " + $scope.items[i].done);
                if ($scope.items[i].done == true) {
                    doneArray.push($scope.items[i].id);
                    $scope.items.splice(i, 1);
                    i = i - 1;
                }
            }

            console.log(doneArray);

            $http({
                url: 'delete_items.php',
                method: "POST",
                data: doneArray
            })
                .success(function(data) {
                    console.log(data);
                    $location.path('/');
                });
        };


		// TODO: Pull this out into a service, and revise so that a message is displayed on the $rootScope
        $scope.deleteList = function(id, title) {
            var url = 'server/delete_list.php';

            $http({
                url: url,
                method: "POST",
                data: {
	                list_id: id,
	                google_id: $rootScope.google_id
                }
            })
                .success(function(data) {
                    for (var i = 0; i < $rootScope.lists.owned.length; i++) {
                        if (id == $rootScope.lists.owned[i].id) {
                            $rootScope.lists.owned.splice(i, 1);
                            break;
                        }
                    }
                    if ($rootScope.lists.owned.length == 0) {
                        $rootScope.hasLists = false;
                    }
                    messages.display("Your list <strong>" + title + "</strong> has been deleted.", "info");
                    $location.path('/');
                });
        };

		$scope.editList = function(id) {
			$location.path('/edit/' + id);
		};

		$scope.addItem = function(item) {

			$scope.items.push(item);
			$scope.itemToAdd = "";
			var input = document.getElementById('addInput');
			input.focus();
		};

		$scope.remove = function(index) {
			$scope.items.splice(index, 1);
		};

		$scope.saveEditedList = function() {
			var url = 'server/edit_list.php';
			var data = {
				google_id: $rootScope.google_id,
				list_id: $rootScope.activeList.id,
				items: $scope.items
			};

			$http({
				url: url,
				method: "POST",
				data: data
			})
				.success(function(returnedID) {
					$location.path('/' + returnedID);
					messages.display("This list has been updated!  Nicely done!", "success");
				});
		};


		// TODO: Figure out if this is better with ng-include
		$scope.showCalendarForm = function() {
			// set the calendarForm property to true so that the form will display and the list will be hidden
			$scope.calendarForm = true;
		};
		$scope.showEmailForm = function() {
			// set the calendarForm property to true so that the form will display and the list will be hidden
			$scope.emailForm = true;
		};

		$scope.showShareForm = function() {
			// set the calendarForm property to true so that the form will display and the list will be hidden
			$scope.shareForm = true;
		};

		$scope.addToCalAttendees = function() {
			if (!($scope.listAttendees && $scope.listAttendees.length > 0)) {
				$scope.listAttendees = [];
			}
			$scope.listAttendees.push($scope.attendee);
			$scope.attendee = undefined;
		};

		$scope.addToRecipients = function() {
			if (!($scope.listRecipients && $scope.listRecipients.length > 0)) {
				$scope.listRecipients = [];
			}
			$scope.listRecipients.push($scope.emailRecipient);
			$scope.recipient = undefined;
		};

		$scope.addToShare = function() {
			if (!($scope.listShare && $scope.listShare.length > 0)) {
				$scope.listShare = [];
			}
			$scope.listShare.push($scope.shareRecipient);
			$scope.recipient = undefined;
		};

		$scope.shareList = function() {
			var postData = {
				list_id: $routeParams.id,
				message: $scope.shareMessage,
				listShare: $scope.listShare,
				creator_id: $rootScope.google_id,
				creator_display: $rootScope.displayName
			};

			$http({
				url: "server/share_list.php",
				method: "POST",
				data: postData
			})
				.success(function(data) {
					console.log("it worked: " + data);
                    $location.path('/');
				})
		};

		$scope.sendEmail = function() {


			$http({
				url: "server/send_mail.php",
				method: "POST",
				data: {
					recipients: $scope.listRecipients,
					message: $scope.listMessage,
					items: $scope.items,
					subject: $rootScope.activeList.title
				}
			})
				.success(function(data) {
					console.log(data);
					$scope.emailForm = false;
					$scope.listRecipients = null;
					$rootScope.activeList.alert = {
						type: "alert-success",
						message: "This list has been emailed!  Nicely done!"
					}
                    $location.path('/');
				});
		};

		$scope.viewReset = function() {
			$scope.calendarForm = false;
			$scope.emailForm = false;
			$scope.shareForm = false;
		};

    });
