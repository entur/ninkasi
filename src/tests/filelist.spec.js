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

import { assert } from "chai";
import { addFileExtensions } from "../actions/SuppliersActions";

describe("Array", () => {
  it("should add file extensions", () => {
    const zipFile =
      "akt-20170215150837-1216_NRI_20160426.rar_part_0017_of_21.zip";
    const rarFile = "akt-20170215150910-1442_Båtruter_sommeren_2016.rar";
    const files = [{ name: zipFile }, { name: rarFile }];
    const filesWithExt = addFileExtensions(files);

    assert.equal(filesWithExt[0].ext, "zip");
    assert.equal(filesWithExt[1].ext, "rar");
  });
});
