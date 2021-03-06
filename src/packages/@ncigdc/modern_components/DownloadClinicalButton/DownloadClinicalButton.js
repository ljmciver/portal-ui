/* @flow */

import React from 'react';
import { compose, withState } from 'recompose';
import DownloadButton from '@ncigdc/components/DownloadButton';
import { makeFilter } from '@ncigdc/utils/filters';
import Dropdown from '@ncigdc/uikit/Dropdown';
import DownloadIcon from '@ncigdc/theme/icons/Download';
import Spinner from '@ncigdc/theme/icons/Spinner';
import Button from '@ncigdc/uikit/Button';
import timestamp from '@ncigdc/utils/timestamp';
import { withTheme, theme } from '@ncigdc/theme';

const styles = {
  dropdownContainer: {
    top: '100%',
    whiteSpace: 'nowrap',
    marginTop: '2px',
    minWidth: '90px',
    left: '0',
  },
  common: theme => ({
    backgroundColor: 'transparent',
    color: theme.greyScale2,
    justifyContent: 'flex-start',
    ':hover': {
      backgroundColor: theme.greyScale6,
    },
  }),
  button: theme => ({
    borderRadius: '0px',
    marginLeft: '0px',
    ...styles.common(theme),
    '[disabled]': styles.common(theme),
  }),
};

export default compose(
  withState('state', 'setState', {
    tsvDownloading: false,
    jsonDownloading: false,
  }),
  withTheme,
)(
  ({
    isLoading,
    dropdownStyle,
    active,
    state,
    setState,
    projectId,
    viewer,
    button,
  }) => {
    const projectFilter = [
      {
        field: 'cases.project.project_id',
        value: projectId,
      },
    ];
    const dataExportFilters = makeFilter(projectFilter);
    const clinicalCount = viewer.repository.cases.hits.total;
    return (
      <Dropdown
        button={
          <Button leftIcon={isLoading ? <Spinner /> : <DownloadIcon />}>
            {state.jsonDownloading || state.tsvDownloading
              ? 'Processing'
              : 'Clinical'}
          </Button>
        }
        dropdownStyle={styles.dropdownContainer}
      >
        <DownloadButton
          className="data-download-clinical-tsv"
          disabled={!clinicalCount}
          size={clinicalCount}
          style={styles.button(theme)}
          endpoint="/clinical_tar"
          format={'TSV'}
          activeText="Processing"
          inactiveText="TSV"
          altMessage={false}
          setParentState={currentState =>
            setState(s => ({
              ...s,
              tsvDownloading: currentState,
            }))}
          active={state.tsvDownloading}
          filters={dataExportFilters}
          filename={`clinical.project-${projectId}.${timestamp()}.tar.gz`}
        />
        <DownloadButton
          className="data-download-clinical"
          disabled={!clinicalCount}
          size={clinicalCount}
          style={styles.button(theme)}
          endpoint="/cases"
          activeText="Processing"
          inactiveText="JSON"
          altMessage={false}
          setParentState={currentState =>
            setState(s => ({
              ...s,
              jsonDownloading: currentState,
            }))}
          active={state.jsonDownloading}
          filters={dataExportFilters}
          fields={['case_id']}
          dataExportExpands={[
            'demographic',
            'diagnoses',
            'diagnoses.treatments',
            'family_histories',
            'exposures',
          ]}
          filename={`clinical.project-${projectId}.${timestamp()}.json`}
        />
      </Dropdown>
    );
  },
);
