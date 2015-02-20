module ngApp.participants {
  "use strict";

  import IParticipantsService = ngApp.participants.services.IParticipantsService;
  import IParticipant = ngApp.participants.models.IParticipant;

  /* @ngInject */
  function participantsConfig($stateProvider: ng.ui.IStateProvider) {
    $stateProvider.state("participant", {
      url: "/participants/:participantId",
      controller: "ParticipantController as pc",
      templateUrl: "participant/templates/participant.html",
      resolve: {
        participant: ($stateParams: ng.ui.IStateParamsService, ParticipantsService: IParticipantsService): ng.IPromise<IParticipant> => {
          return ParticipantsService.getParticipant($stateParams["participantId"], {
            fields: [
              "participant_id",
              "clinical.vital_status",
              "clinical.ethnicity",
              "clinical.gender",
              "clinical.race",
              "clinical.icd_10",
              "files.file_id",
              "project.name",
              "project.code",
              "project.primary_site",
              "annotations.annotation_id",
              "summary.experimental_strategies.experimental_strategy",
              "summary.experimental_strategies.file_count",
              "samples.sample_id",
              "samples.portions.portion_id",
              "samples.portions.slides.slide_id",
              "samples.portions.analytes.analyte_id",
              "samples.portions.analytes.amount",
              "samples.portions.analytes.analyte_type",
              "samples.portions.analytes.aliquots.aliquot_id"
           ]
          });
        }
      }
    });
  }

  angular
      .module("ngApp.participants", [
        "participants.controller",
        "ui.router.state"
      ])
      .config(participantsConfig);
}
