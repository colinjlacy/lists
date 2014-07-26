angular.module("boomLists")
    .controller("viewCtrl", function($scope, $http, $routeParams, $rootScope, $location) {

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
                    $scope.items = data;
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
        $scope.deleteList = function(id) {
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
			}

			$http({
				url: url,
				method: "POST",
				data: data
			})
				.success(function(returnedID) {
					$location.path('/' + returnedID);
					$rootScope.activeList.alert = {
						type: "alert-success",
						message: "This list has been updated!  Nicely done!"
					}
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
			$scope.listRecipients.push($scope.recipient);
			$scope.recipient = undefined;
		};

		$scope.addToShare = function() {
			if (!($scope.listShare && $scope.listShare.length > 0)) {
				$scope.listShare = [];
			}
			$scope.listShare.push($scope.recipient.email);
			$scope.recipient = undefined;
		};

		$scope.shareList = function() {
			var postData = {
				list_id: $routeParams.id,
				message: $scope.shareMessage,
				listShare: $scope.listShare,
				creator_id: $rootScope.data.user.id,
				creator_display: $rootScope.data.user.displayName
			};

			$http({
				url: "server/share_list.php",
				method: "POST",
				data: postData
			})
				.success(function(data) {
					console.log("it worked: " + data);
				})
		};

		$scope.addToCalendar = function() {

			var token = $scope.token;

			var messageList;

			for (var i = 0; i < $scope.items.length; i++) {
				messageList += "<li>" + $scope.items[i].name + "</li>";
			}

			var message = $scope.listMessage + " <ul>" + messageList + "</ul><a href='" + $location.absUrl() + "'>View it online!</a>";

			var attendees = [];

			if ($scope.listAttendees) {
				for (var i = 0; i < $scope.listAttendees.length; i++) {
					attendees.push({email: $scope.listAttendees[i].email});
				}
			}

			var calID = encodeURIComponent($scope.listCalendar.id);


			// TODO: Add the link back to this list to the listMessage, so that people can access it from their calendars
			var calendarInput = {
				start: {
					date: $scope.listDate.toISOString().slice(0,10)
				},
				end: {
					date: $scope.listDate.toISOString().slice(0,10)
				},
				summary: $rootScope.activeList.title,
				description: message,
				attendees: attendees
			};

			$http({
				url: "https://www.googleapis.com/calendar/v3/calendars/" + calID + "/events?sendNotifications=true&key=185024779579-go9t2i4b44oaffv6as49ijotubekkcql.apps.googleusercontent.com&access_token=" + token,
				method: "POST",
				data: calendarInput
			})
				.success(function() {
					$scope.calendarForm = false;
					$rootScope.activeList.alert = {
						type: "alert-success",
						message: "This list has been added to your calendar!  Nicely done!"
					}
				})
				.error(function(error) {
					$rootScope.activeList.alert = {
						type: "alert-danger",
						message: "There was an error: " + error
					}
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
				});
		};

		$scope.viewReset = function() {
			$scope.calendarForm = false;
			$scope.emailForm = false;
			$scope.shareForm = false;
		}


    });
