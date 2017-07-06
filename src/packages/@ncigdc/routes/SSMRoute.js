/* @flow */

import React from 'react';
import Route from 'react-router/Route';
import { compose, withPropsOnChange } from 'recompose';
import { Row, Column } from '@ncigdc/uikit/Flex';
import TableIcon from '@ncigdc/theme/icons/Table';
import ChartIcon from '@ncigdc/theme/icons/BarChart';
import GdcDataIcon from '@ncigdc/theme/icons/GdcData';
import { makeFilter } from '@ncigdc/utils/filters';
import FullWidthLayout from '@ncigdc/components/Layouts/FullWidthLayout';
import { SsmLolliplot } from '@ncigdc/modern_components/Lolliplot';
import SsmSummary from '@ncigdc/containers/SsmSummary';
import SsmExternalReferences from '@ncigdc/containers/SsmExternalReferences';
import ConsequencesTable from '@ncigdc/containers/ConsequencesTable';
import CancerDistributionBarChart from '@ncigdc/modern_components/CancerDistributionBarChart';
import CancerDistributionTable from '@ncigdc/modern_components/CancerDistributionTable';

import type { TChartTitleProps } from '@ncigdc/containers/CancerDistributionBarChart';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import ProjectsLink from '@ncigdc/components/Links/ProjectsLink';

const CancerDistributionTitle = ({
  cases = 0,
  projects = [],
  filters,
}: TChartTitleProps) =>
  <h5 style={{ textTransform: 'uppercase', padding: '0 2rem' }}>
    THIS MUTATION AFFECTS&nbsp;
    <ExploreLink query={{ searchTableTab: 'cases', filters }}>
      {cases.toLocaleString()}
    </ExploreLink>&nbsp;
    CASES ACROSS&nbsp;
    <ProjectsLink
      query={{
        filters: {
          op: 'and',
          content: [
            {
              op: 'in',
              content: {
                field: 'projects.project_id',
                value: projects.map(p => p.project_id),
              },
            },
          ],
        },
      }}
    >
      {projects.length.toLocaleString()}
    </ProjectsLink>&nbsp;
    PROJECTS
  </h5>;

const styles = {
  heading: {
    flexGrow: 1,
    fontSize: '2rem',
    marginBottom: 7,
    marginTop: 7,
  },
  card: {
    backgroundColor: 'white',
  },
  lolliplotZeroStateWrapper: {
    padding: '24px 18px',
  },
};

export default (
  <Route
    path="/ssms/:id"
    component={({ match, ssmId = match.params.id, filters }) => {
      const cdFilters = makeFilter([
        { field: 'ssms.ssm_id', value: ssmId },
        { field: 'cases.available_variation_data', value: 'ssm' },
      ]);

      return (
        <FullWidthLayout title={ssmId} entityType="MU">
          <Row spacing="2rem" id="summary">
            <Row flex="1"><SsmSummary ssmId={ssmId} /></Row>
            <Row flex="1"><SsmExternalReferences ssmId={ssmId} /></Row>
          </Row>
          {/* <Column style={styles.card}>
            <h1
              id="consequences"
              style={{ ...styles.heading, padding: '1rem' }}
            >
              <TableIcon style={{ marginRight: '1rem' }} />
              Consequences
            </h1>
            <Row>
              <ConsequencesTable />
            </Row>
          </Column>
          <Column
            style={{ ...styles.card, marginTop: '2rem' }}
            id="cancer-distribution"
          >
            <Row style={{ padding: '1rem 1rem 2rem', alignItems: 'center' }}>
              <h1 style={{ ...styles.heading }}>
                <ChartIcon style={{ marginRight: '1rem' }} />
                Cancer Distribution
              </h1>
              <ExploreLink
                query={{ searchTableTab: 'cases', filters: cdFilters }}
              >
                <GdcDataIcon /> Open in Exploration
              </ExploreLink>
            </Row>
            <Column>
              <CancerDistributionBarChart
                filters={cdFilters}
                ChartTitle={CancerDistributionTitle}
                style={{ width: '50%' }}
              />
              <CancerDistributionTable filters={cdFilters} entityName={ssmId} />
            </Column>
          </Column>
          <Column style={{ ...styles.card, marginTop: '2rem' }}>
            <SsmLolliplot mutationId={ssmId} ssmId={ssmId} />
          </Column> */}
        </FullWidthLayout>
      );
    }}
  />
);
