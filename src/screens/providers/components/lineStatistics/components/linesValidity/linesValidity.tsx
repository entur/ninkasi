/*
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *   https://joinup.ec.europa.eu/software/page/eupl
 *
 */

import { Box } from '@mui/material';
import { useLocale } from '../../appContext';
import { Validity } from '../../lineStatistics.types';
import type { LineStatistics } from '../../lineStatistics.types';
import { titleText } from '../../lineStatistics.constants';
import { LinesValidityList } from './linesValidityList';

interface Props {
  providerId: string;
  defaultSelectedValidity: Validity;
  lineStatistics: LineStatistics | undefined;
}

export const LinesValidity = ({ providerId, lineStatistics, defaultSelectedValidity }: Props) => {
  const locale = useLocale();
  const hasLines = (ls: LineStatistics) =>
    (ls.validityCategories.get(Validity.ALL)?.length ?? 0) > 0;

  return (
    <Box
      sx={{
        height: 'calc(100vh - 120px)',
        overflowY: 'auto',
        overflowX: 'hidden',
        m: 'auto',
        width: '100%',
      }}
    >
      {lineStatistics && hasLines(lineStatistics) && (
        <LinesValidityList
          providerId={providerId}
          listTitle={titleText(locale).lineStatisticsFromChouette}
          lineStatistics={lineStatistics}
          defaultSelectedValidity={defaultSelectedValidity}
        />
      )}
    </Box>
  );
};
