import { assert } from 'chai';
import { buildRowKeys } from 'screens/providers/components/events/components/EventDetails';

describe('buildRowKeys', () => {
  it('gives rows without job id or filename distinct keys', () => {
    const rows = [
      { providerId: 1, firstEvent: 1787349300447 },
      { providerId: 1, firstEvent: 1787349300447 },
    ];
    const keys = buildRowKeys(rows);

    assert.notEqual(keys[0], keys[1]);
  });

  it('keys on identity, not position', () => {
    const avinor = { chouetteJobId: '1', providerId: 1, fileName: 'a.zip', firstEvent: 1 };
    const skyss = { chouetteJobId: '2', providerId: 2, fileName: 'b.zip', firstEvent: 2 };

    assert.deepEqual(buildRowKeys([avinor, skyss]), buildRowKeys([avinor, skyss]));
    assert.equal(buildRowKeys([avinor, skyss])[0], buildRowKeys([skyss, avinor])[1]);
  });
});
