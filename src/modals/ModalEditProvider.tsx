/*
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *   https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence.
 *
 */

import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import TextField from '@mui/material/TextField';
import {
  Checkbox,
  FormControlLabel,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import Button from '@mui/material/Button';
import { Tooltip, styled } from '@mui/material';
import HelpOutlinedIcon from '@mui/icons-material/HelpOutlined';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { useAccessToken } from '@/utils/useAccessToken';
import * as SuppliersReducer from 'reducers/SuppliersReducer';
const { fetchTransportModes } = SuppliersReducer as any;
import TransportModesPopover from './TransportModesPopover';

const LightTooltip = styled(Tooltip)(() => ({
  '& .MuiTooltip-tooltip': {
    fontSize: 12,
  },
}));

interface ProviderForm {
  _providerId: string | number | null;
  _name: string;
  _chouetteInfoId: string | number | null;
  _xmlns: string;
  _xmlnsurl: string;
  _referential: string;
  _organisation: string;
  _user: string;
  _allowCreateMissingStopPlace: boolean;
  _generateDatedServiceJourneyIds: boolean;
  _generateMissingServiceLinksForModes: string[];
  _migrateDataToProvider: string | number | null;
  _enableAutoImport: boolean;
  _enableAutoValidation: boolean;
  _enableBlocksExport: boolean;
  _enableExperimentalImport: boolean;
}

interface ModalEditProviderProps {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (form: ProviderForm) => void;
  providers: any[];
  provider: any;
  shouldUpdate: boolean;
}

const getEmptyForm = (): ProviderForm => ({
  _providerId: null,
  _name: '',
  _chouetteInfoId: null,
  _xmlns: '',
  _xmlnsurl: '',
  _referential: '',
  _organisation: '',
  _user: '',
  _allowCreateMissingStopPlace: false,
  _generateDatedServiceJourneyIds: false,
  _generateMissingServiceLinksForModes: [],
  _migrateDataToProvider: null,
  _enableAutoImport: false,
  _enableAutoValidation: false,
  _enableBlocksExport: false,
  _enableExperimentalImport: false,
});

const validate = (values: ProviderForm): Record<string, string> => {
  const errors: Record<string, string> = {};
  if (!values._name.length) {
    errors._name = 'Required';
  } else if (!values._referential.length) {
    errors._referential = 'Required';
  } else if (!/^(rb_)?[a-z]{3}$/.test(values._referential)) {
    errors._referential = 'Invalid format';
  } else if (!values._organisation.length) {
    errors._organisation = 'Required';
  } else if (!values._user.length) {
    errors._user = 'Required';
  } else if (values._referential.indexOf('rb_') !== 0 && !values._migrateDataToProvider) {
    errors._migrateDataToProvider = 'Required';
  }
  return errors;
};

const ModalEditProvider = ({
  open,
  handleClose,
  handleSubmit,
  providers,
  provider,
  shouldUpdate,
}: ModalEditProviderProps) => {
  const dispatch = useAppDispatch();
  const { getToken } = useAccessToken();
  const allTransportModes = useAppSelector(
    (state: any) => state.SuppliersReducer.allTransportModes
  );

  const [form, setForm] = useState<ProviderForm>(getEmptyForm());
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    dispatch(fetchTransportModes(getToken));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (provider !== null && shouldUpdate) {
      const { name } = provider;
      const {
        xmlns,
        xmlnsurl,
        referential,
        organisation,
        user,
        allowCreateMissingStopPlace,
        generateDatedServiceJourneyIds,
        generateMissingServiceLinksForModes,
        migrateDataToProvider,
        enableAutoImport,
        enableAutoValidation,
        enableBlocksExport,
        enableExperimentalImport,
      } = provider.chouetteInfo;
      const nextForm: ProviderForm = {
        _providerId: provider.id,
        _name: name,
        _chouetteInfoId: provider.chouetteInfo.id,
        _xmlns: xmlns,
        _xmlnsurl: xmlnsurl,
        _referential: referential,
        _organisation: organisation,
        _user: user,
        _allowCreateMissingStopPlace: allowCreateMissingStopPlace,
        _generateDatedServiceJourneyIds: generateDatedServiceJourneyIds,
        _generateMissingServiceLinksForModes: generateMissingServiceLinksForModes,
        _migrateDataToProvider: migrateDataToProvider,
        _enableAutoImport: enableAutoImport,
        _enableAutoValidation: enableAutoValidation,
        _enableBlocksExport: enableBlocksExport,
        _enableExperimentalImport: enableExperimentalImport,
      };
      setForm(nextForm);
      setErrors({});
    } else {
      setForm(getEmptyForm());
      setErrors({});
    }
  }, [provider, shouldUpdate]);

  const getTitle = () => {
    if (provider && provider.id && shouldUpdate) {
      return `Edit ${provider.name} (${provider.id})`;
    }
    return 'Create new provider';
  };

  const isEdit = () => provider && provider.id && shouldUpdate;

  const handleCheckTransportMode = (transportMode: string, isChecked: boolean) => {
    let transportModes = form._generateMissingServiceLinksForModes;
    const idx = transportModes.indexOf(transportMode);
    if (isChecked && idx === -1) {
      transportModes = transportModes.concat(transportMode);
    } else if (!isChecked && idx >= 0) {
      transportModes = [...transportModes.slice(0, idx), ...transportModes.slice(idx + 1)];
    }
    setForm(prev => ({
      ...prev,
      _generateMissingServiceLinksForModes: transportModes,
    }));
  };

  const handleChange = (field: keyof ProviderForm, value: any) => {
    setForm(prev => {
      const updated: ProviderForm = { ...prev, [field]: value };
      let nextErrors: Record<string, string> = {};
      if (!isEdit()) {
        nextErrors = validate(updated);
        if (field === '_referential') {
          updated._xmlns = String(value).toUpperCase().replace('RB_', '');
          updated._xmlnsurl = `http://www.rutebanken.org/ns/${String(value)
            .toLowerCase()
            .replace('rb_', '')}`;
        }
      }
      setErrors(nextErrors);
      return updated;
    });
  };

  const submit = () => {
    const validationErrors = validate(form);
    if (!Object.keys(validationErrors).length) {
      handleSubmit(form);
    } else {
      console.error(validationErrors);
    }
  };

  const toolTip = (title: string) => (
    <LightTooltip arrow placement="right" title={title}>
      <span className="question-icon">
        <HelpOutlinedIcon style={{ paddingTop: '5px' }} />
      </span>
    </LightTooltip>
  );

  const title = getTitle();
  const editing = isEdit();

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const formElement: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
  };

  const actions = [
    <Button
      key="cancel"
      variant="text"
      onClick={() => {
        handleClose();
      }}
    >
      Cancel
    </Button>,
    <Button key="update" variant="text" color="primary" onClick={submit}>
      Update
    </Button>,
  ];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <div style={rowStyle}>
          <TextField
            label="Name"
            value={form._name}
            style={{ flex: 1 }}
            onChange={e => handleChange('_name', e.target.value)}
            error={!!errors._name}
            helperText={errors._name || ''}
          />
          <TextField
            disabled={editing}
            label="Chouette referential name"
            value={form._referential}
            style={{ flex: 1, padding: '0 15px' }}
            onChange={e => handleChange('_referential', e.target.value)}
            error={!!errors._referential}
            helperText={errors._referential || ''}
          />
        </div>
        <div style={rowStyle}>
          <TextField
            disabled={editing}
            label="Organisation"
            value={form._organisation}
            style={{ flex: 1 }}
            onChange={e => handleChange('_organisation', e.target.value)}
            error={!!errors._organisation}
            helperText={errors._organisation || ''}
          />
          <TextField
            disabled={editing}
            label="User"
            value={form._user}
            style={{ flex: 1, padding: '0 15px' }}
            onChange={e => handleChange('_user', e.target.value)}
            error={!!errors._user}
            helperText={errors._user || ''}
          />
        </div>
        <div style={rowStyle}>
          <TextField
            disabled={editing}
            label="xmlns"
            value={form._xmlns}
            style={{ flex: 1 }}
            onChange={e => handleChange('_xmlns', e.target.value)}
          />
          <TextField
            disabled={editing}
            label="xmlns URL"
            value={form._xmlnsurl}
            style={{ flex: 1, padding: '0 15px' }}
            onChange={e => handleChange('_xmlnsurl', e.target.value)}
          />
        </div>
        <div style={rowStyle}>
          <FormControl style={{ flex: 1 }}>
            <InputLabel id="level2-provider-label">Level-2 provider</InputLabel>
            <Select
              labelId="level2-provider-label"
              label="Level-2 provider"
              value={form._migrateDataToProvider || ''}
              onChange={e => handleChange('_migrateDataToProvider', e.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {providers
                .filter(p => !p.chouetteInfo.migrateDataToProvider)
                .map(p => (
                  <MenuItem key={'provider-' + p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>

        {(window.config?.defaultAuthMethod === 'local' ||
          form._referential.indexOf('rb_') !== 0) && (
          <>
            <div style={{ ...rowStyle, marginTop: 10 }}>
              <TransportModesPopover
                allTransportModes={allTransportModes}
                transportModes={form._generateMissingServiceLinksForModes}
                handleCheckTransportMode={handleCheckTransportMode}
              />
            </div>
            <div style={{ ...rowStyle, marginTop: 10 }}>
              <div style={{ ...formElement }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form._allowCreateMissingStopPlace}
                      onChange={e => handleChange('_allowCreateMissingStopPlace', e.target.checked)}
                    />
                  }
                  label="Allow create missing stop place"
                  style={{
                    flex: 1,
                    maxWidth: 360,
                    whiteSpace: 'nowrap',
                    fontSize: '0.9em',
                  }}
                />
                {toolTip(
                  'Allow Chouette to create new stop places in its database. ' +
                    'Since stop places should be already present in the Chouette database (imported from NSR) the default setting is "off". ' +
                    'Used only when testing non-Norwegian datasets'
                )}
              </div>
            </div>
            <div style={{ ...rowStyle, marginTop: 10 }}>
              <div style={{ ...formElement }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form._enableAutoImport}
                      onChange={e => handleChange('_enableAutoImport', e.target.checked)}
                    />
                  }
                  label="Enable auto import"
                  style={{
                    flex: 1,
                    maxWidth: 360,
                    whiteSpace: 'nowrap',
                    fontSize: '0.9em',
                  }}
                />
                {toolTip(
                  'Automatically trigger the import pipeline after a file delivery, ' +
                    'either through the operator portal or the HTTP endpoint. ' +
                    'If disabled the received file is saved in the file storage but not imported'
                )}
              </div>
            </div>
            <div style={{ ...rowStyle, marginTop: 10 }}>
              <div style={{ ...formElement }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form._generateDatedServiceJourneyIds}
                      onChange={e =>
                        handleChange('_generateDatedServiceJourneyIds', e.target.checked)
                      }
                    />
                  }
                  label="Generate DatedServiceJourneyIds"
                  style={{
                    flex: 1,
                    maxWidth: 360,
                    whiteSpace: 'nowrap',
                    fontSize: '0.9em',
                  }}
                />
                {toolTip('Deprecated. Generates a dated NeTEx export to be processed by Namtar')}
              </div>
            </div>
            <div style={{ ...rowStyle, marginTop: 10 }}>
              <div style={{ ...formElement }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form._enableExperimentalImport}
                      onChange={e => handleChange('_enableExperimentalImport', e.target.checked)}
                    />
                  }
                  label="Enable experimental import"
                  style={{
                    flex: 1,
                    maxWidth: 360,
                    whiteSpace: 'nowrap',
                    fontSize: '0.9em',
                  }}
                />
                {toolTip('Enable the experimental import pipeline for this provider')}
              </div>
            </div>
          </>
        )}
        <div style={{ ...rowStyle, marginTop: 10 }}>
          <div style={{ ...formElement }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={form._enableAutoValidation}
                  onChange={e => handleChange('_enableAutoValidation', e.target.checked)}
                />
              }
              label="Enable auto validation"
              style={{
                flex: 1,
                maxWidth: 360,
                whiteSpace: 'nowrap',
                fontSize: '0.9em',
              }}
            />
            {toolTip(
              form._referential.indexOf('rb_') !== 0
                ? 'Enable the nightly validation for this provider'
                : 'Enable nightly automatic triggering of "validation Level 2" steps. ' +
                    'This option does not affect the execution of the "validation Level 2" step triggered by a file delivery.'
            )}
          </div>
        </div>
        {form._referential.indexOf('rb_') === 0 && (
          <div style={{ ...rowStyle, marginTop: 10 }}>
            <div style={{ ...formElement }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form._enableBlocksExport}
                    onChange={e => handleChange('_enableBlocksExport', e.target.checked)}
                  />
                }
                label="Enable private export (blocks and restricted publication)"
                style={{
                  flex: 1,
                  maxWidth: 360,
                  whiteSpace: 'nowrap',
                  fontSize: '0.9em',
                }}
              />
              {toolTip(
                'When activated, a second NeTEx export is generated, ' +
                  'that will include private/sensitive data ' +
                  '(Blocks, DeadRuns, ServiceJourneys marked with publication=restricted). ' +
                  'This export is accessible only through a private, authorized API.'
              )}
            </div>
          </div>
        )}
      </DialogContent>
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
};

export default ModalEditProvider;
