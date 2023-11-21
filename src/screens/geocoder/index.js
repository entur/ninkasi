import React, { useEffect } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Pelias from './components/Pelias';
import OSMPOIFilter from './components/OSMPOIFilter';
import { TariffZonesImport } from './components/tariffZonesImport/TariffZonesImport';
import { getQueryVariable } from '../../utils';
import SuppliersActions from '../../actions/SuppliersActions';
import { useDispatch } from 'react-redux';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

export default () => {
  const [value, setValue] = React.useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(SuppliersActions.getAllProviders());
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="simple tabs example"
        style={{ background: 'lightgray' }}
      >
        <Tab label="Geocoder pipeline" {...a11yProps(0)} />
        <Tab label="OSM POI filter" {...a11yProps(1)} />
        <Tab label="TariffZone/FareZone Import" {...a11yProps(2)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Pelias />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <OSMPOIFilter />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <TariffZonesImport />
      </TabPanel>
    </div>
  );
};
