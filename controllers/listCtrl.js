angular.module("boomLists")
    .controller("listCtrl", function($scope, $rootScope, $http, $location, messages) {

        // Here's an overview of the loginButton functionality:
        // 0 = initial state, testing to see if we can get in
        // 1 = can't get in, need loginButton
        // 2 = got in, no loginButton needed
        $scope.loginButton;

		// on sucessful login
		$scope.$on('event:google-plus-signin-success', function (event, authResult) {

			// get the access token
			$scope.token = (authResult.access_token);

            // Next option means that there's no need for a loginButton to show, since we were granted access and life is good.
			$scope.loginButton = 2;
            console.log($scope.loginButton);

			// make the initial AJAX call to retrieve the user account information
			$http.get('https://www.googleapis.com/plus/v1/people/me?access_token=' + $scope.token).success(function(data) {

				var email = data.emails[0].value,
					id = data.id,
					displayName = data.displayName;


				$rootScope.google_id = id;
				$rootScope.email = email;
				$rootScope.displayName = displayName;

				$http({
					url: "server/set_user.php",
					method: "POST",
					data: {
						email: email,
						google_id: id,
						displayName: displayName
					}
				}).success(function(userData) {
                    console.log(userData);
						$http({
							url: "server/retrieve_lists.php",
							method: "GET",
							params: {
								google_id: id
							}
						})
							.success(function(response) {
								$rootScope.lists = response;
								console.log(response);

								if((response.owned && response.owned.length > 0) || (response.shared && response.shared.length > 0)) {
                                    // Here's an overview of the hasLists functionality:
                                    // 1 = hasLists, no need to show the holding message
                                    // 2 = no lists found, show the holding message
                                    // Note that there's no intial state, just specific values.  I only need two options;
                                    // however I can't have true or false, since undefined can be interpreted as false.
                                    $rootScope.hasLists = 1;
								}

							})
							.error(function(error) {
								$scope.status = error || "Request Failed";
							});

					});

				// now use the user data to get their contacts
				$http.get('server/contacts.php?token=' + $scope.token +'&email=' + email).success(function(contacts) {

					// create an array in which I'll store the values I need from the returned contacts
					$scope.contacts = [];

					// simplify this convoluted object into an easy-to-write variable
					var rawContactsArray = contacts.feed.entry;

//						console.log(rawContactsArray);

					// loop through the contacts...
					for (var i = 0; i < rawContactsArray.length; i++) {

						// if there is an email address set (Droid creates Google contacts without email addresses)
						if (rawContactsArray[i].gd$email && rawContactsArray[i].gd$email[0].address) {
							var contact = { // create a simple object on the local scope

								// set the email address to the email property
								email: rawContactsArray[i].gd$email[0].address,

								// if there is a title for this person, set that to the title property, otherwise use their email address
								// TODO: figure out why I can't use this.email in the line below to define the email fallback for the title property
								title: rawContactsArray[i].title.$t != "" ? rawContactsArray[i].title.$t : rawContactsArray[i].gd$email[0].address
							};

							// push the new contact into the session.contacts array
							$scope.contacts.push(contact);
						}
					}
				});

			});

		});

		// on failed login
		$scope.$on('event:google-plus-signin-failure', function (event, authResult) {
			// User has not authorized the G+ App!
			console.log('Not signed into Google Plus.');

            // Third option means that we were not granted access, and need to get in!
            $scope.$apply(function(){
                $scope.loginButton = 1;
            });
			console.log($scope.loginButton);
		});

		$scope.viewList = function(list) {
			$location.path('/' + list.id);
		};

        $scope.deleteList = function(id, index, title) {
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
                    $rootScope.lists.owned.splice(index, 1);
                    messages.display("The list <strong>" + title + "</strong> has been deleted", "info");
                    if ($rootScope.lists.owned.length == 0) {
                        $rootScope.hasLists = 2;
                    }
                });
        };

        $scope.add = {};

        $scope.addItem = function(item) {

            if(!($scope.add.items)) {
                $scope.add.items = [];
            }

            $scope.add.items.push(item);
            $scope.add.itemToAdd = "";
            var input = document.getElementById('addInput');
            input.focus();
        };

        $scope.remove = function(index) {
            $scope.add.items.splice(index, 1);
        };

        $scope.save = function() {
            $scope.add.google_id = $rootScope.google_id;
            var add = $scope.add;
            var url = 'server/create_list.php';

            $http({
                url: url,
                method: "POST",
                data: add
            })
                .success(function(data) {
//                    console.log(data);
                    if(!isNaN(data)) {
                        $scope.add.error = null;
                        add.id = data;
                        $rootScope.lists.owned.push(add);
                        $rootScope.hasLists = 1;
                        $scope.add = {};
                        $location.path('/');
                        messages.display("Your list <strong>" + add.title + "</strong> has been added!", "success");
                    } else {
                        $scope.add.error = data;
                    }
                })
                .error(function(error) {
                    console.log(error);
                    $scope.add.error = error;
                });
        };

    });
