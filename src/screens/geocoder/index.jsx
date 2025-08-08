import React, { useEffect } from 'react';
import withAuth from 'utils/withAuth';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Pelias from './components/Pelias';
import OSMPOIFilter from './components/OSMPOIFilter';
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
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const GeocoderComponent = ({ getToken }) => {
  const [value, setValue] = React.useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(SuppliersActions.getAllProviders(getToken));
  }, [dispatch, getToken]);

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
      </Tabs>
      <TabPanel value={value} index={0}>
        <Pelias />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <OSMPOIFilter />
      </TabPanel>
    </div>
  );
};

export default withAuth(GeocoderComponent);
