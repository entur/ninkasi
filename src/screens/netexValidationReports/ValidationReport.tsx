import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import { groupReportEntries } from './util/groupReportEntries';
import { sortBySeverity } from './util/sortBySeverity';
import { useReport } from './hooks/useReport';
import { ExpandableReportRow } from './components/ExpandableReportRow';
import { GroupedReportEntriesTable } from './components/GroupedReportEntriesTable';
import { NoValidationIssues } from './components/NoValidationIssues';
import { Preamble } from './components/Preamble';
import { ReportEntryTable } from './components/ReportEntryTable';
import { ReportFetchError } from './components/ReportFetchError';
import { ReportHeading } from './components/ReportHeading';
import { ReportLoadingIndicator } from './components/ReportLoadingIndicator';
import { ReportTable } from './components/ReportTable';

const ValidationReport = () => {
  const { codespace, id } = useParams();
  const { report, error } = useReport(codespace ?? '', id ?? '');

  const groupedEntries = useMemo(() => {
    return groupReportEntries(report?.validationReportEntries || [], 'name', 'fileName');
  }, [report?.validationReportEntries]);

  const sorted = useMemo(() => {
    return Array.from(groupedEntries?.entries() || []).sort((a, b) =>
      sortBySeverity(a[1].severity, b[1].severity)
    );
  }, [groupedEntries]);

  return (
    <Box sx={{ p: 3 }}>
      <ReportHeading />
      <ReportFetchError error={error} />
      <ReportLoadingIndicator loading={!report && !error} />
      {report && (
        <>
          <Preamble report={report} />
          {sorted.length === 0 && <NoValidationIssues />}
          {sorted.length > 0 && (
            <ReportTable>
              {sorted.map(entry => (
                <ExpandableReportRow
                  severity={entry[1].severity}
                  values={[String(entry[0]), entry[1].severity, entry[1].count.toString()]}
                  key={`row-${String(entry[0])}`}
                >
                  <GroupedReportEntriesTable>
                    {Array.from(entry[1]?.groupedEntries || []).map(subEntry => (
                      <ExpandableReportRow
                        values={[String(subEntry[0]), subEntry[1].count.toString()]}
                        key={`row-${String(entry[0])}-${String(subEntry[0])}`}
                      >
                        <ReportEntryTable subEntry={subEntry} />
                      </ExpandableReportRow>
                    ))}
                  </GroupedReportEntriesTable>
                </ExpandableReportRow>
              ))}
            </ReportTable>
          )}
        </>
      )}
    </Box>
  );
};

export default ValidationReport;
