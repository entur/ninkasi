import { assert } from 'chai'
import { addFileExtensions } from '../actions/SuppliersActions'

describe('Array', ()  => {

  it('should add file extensions', () => {

    const zipFile = 'akt-20170215150837-1216_NRI_20160426.rar_part_0017_of_21.zip'
    const rarFile = 'akt-20170215150910-1442_Båtruter_sommeren_2016.rar'
    const files = [ { name: zipFile }, { name: rarFile } ]
    const filesWithExt = addFileExtensions(files)

    assert.equal(filesWithExt[0].ext, 'zip')
    assert.equal(filesWithExt[1].ext, 'rar')
  })

})

