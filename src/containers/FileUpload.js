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

import React from "react";
import Dropzone from "react-dropzone";
import Button from "muicss/lib/react/button";
import { Line as Progress } from "rc-progress";

class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: []
    };
  }

  handleOnDrop(files) {
    if (files.length) {
      this.setState({
        files: files
      });
      return false;
    }
  }

  render() {
    const dropStyle = {
      height: "150px",
      borderWidth: 1,
      borderColor: "#666",
      borderStyle: "dashed",
      borderRadius: 2,
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    };

    const filesStyle = {
      marginTop: "5%",
      minHeight: "300px",
      maxHeight: "300px"
    };

    const uploadButtonStyle = {
      width: 100,
      fontSize: "0.8em",
      textAlign: "center",
      marginLeft: "auto",
      marginTop: 10
    };

    const { files } = this.state;
    const { fileUploadProgress, handleFileUpload } = this.props;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "80%",
          margin: "auto",
          marginTop: "5%"
        }}
      >
        <Dropzone
          style={dropStyle}
          accept="application/zip,application/octet-stream,application/x-zip,application/x-rar,application/x-zip-compressed,application/x-rar-compressed,compressed/rar,application/rar"
          onDrop={(files, rejected) => {
            this.handleOnDrop(files);
            console.warn("rejected", rejected);
          }}
        >
          <div style={{ textAlign: "center" }}>
            Try dropping some files here, or click to select files to upload.
          </div>
        </Dropzone>
        {files.length ? (
          <select style={filesStyle} multiple>
            {files.map((file, index) => {
              return <option key={"file-" + index}>{file.name}</option>;
            })}
          </select>
        ) : (
          <div style={{ marginTop: "5%" }}>No files added</div>
        )}
        <Progress strokeColor="#8dcc91" percent={fileUploadProgress} />
        <Button
          disabled={!files.length}
          style={uploadButtonStyle}
          color="primary"
          onClick={() => files.length && handleFileUpload(files)}
        >
          Upload
        </Button>
      </div>
    );
  }
}

export default FileUpload;
