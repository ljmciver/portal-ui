module ngApp.components.quickSearch.directives {

  function QuickSearch($modal: any, $window: ng.IWindowService, $modalStack): ng.IDirective {
    return {
      restrict: "A",
      controller: function($scope) {
        var modalInstance;

        $scope.$on("$stateChangeStart", () => {
          if (modalInstance) {
            modalInstance.close();
          }
        });

        this.openModal = () => {
          // Modal stack is a helper service. Used to figure out if one is currently
          // open already.
          if ($modalStack.getTop()) {
            return;
          }

          modalInstance = $modal.open({
            templateUrl: "components/quick-search/templates/quick-search-modal.html",
            controller: "QuickSearchModalController",
            controllerAs: "qsmc",
            backdrop: true,
            size: "lg",
            keyboard: true,
            animation: false
          });
        };
      },
      link: function($scope, $element, attrs, ctrl) {
        $element.on("click", function() {
          ctrl.openModal();
        });

        angular.element($window.document).on("keypress", (e) => {
          var validSpaceKeys = [
            0, // Webkit
            96 // Firefox
          ];

          if (e.ctrlKey && validSpaceKeys.indexOf(e.which) !== -1) {
            e.preventDefault();
            ctrl.openModal();
          }
        });
      }
    };
  }

  function MatchedTerms($sce): ng.IDirective {
    return {
      restrict: "E",
      templateUrl: "components/quick-search/templates/matched-terms.html",
      scope: {
        terms: "=",
        query: "="
      },
      link: function($scope) {
        $scope.$watch("terms", (newVal) => {
          if (newVal) {
            var boldedQuery = "<span class='bolded'>" + $scope.query + "</span>";
            var boldedTerms = [];
            var regex = new RegExp("[" + $scope.query.replace(/\-/g, "\\-") + "]{" + $scope.query.length + "}", "gi");
            _.forEach(newVal, (item) => {
              boldedTerms.push(item.replace(regex, boldedQuery));
            });

            $scope.matchedTerms = _.assign([], boldedTerms);
          }
        });
      }
    };
  }

  angular
    .module("quickSearch.directives", [
      "ui.bootstrap.modal"
    ])
    .directive("matchedTerms", MatchedTerms)
    .directive("quickSearch", QuickSearch);
}
