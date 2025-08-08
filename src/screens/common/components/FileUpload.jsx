import React, { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import { Button } from '@mui/material';
import { Line as Progress } from 'rc-progress';

export const FileUpload = ({ fileUploadProgress, handleFileUpload }) => {
  const [files, setFiles] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (fileUploadProgress === 100) {
      setFiles([]);
      setShowSuccess(true);
    }
  }, [fileUploadProgress]);

  useEffect(() => {
    let showSuccessTimer = setTimeout(() => resetProgress(), 3000);
    return () => {
      clearTimeout(showSuccessTimer);
    };
  }, [showSuccess]);

  useEffect(() => {
    if (!showSuccess) {
      setUploadProgress(fileUploadProgress);
    }
  }, [fileUploadProgress]);

  const resetProgress = () => {
    setShowSuccess(false);
    setUploadProgress(0);
  };

  const handleOnDrop = (files) => {
    if (files.length) {
      setFiles(files);
    }
  };

  const dropStyle = {
    height: '150px',
    borderWidth: 1,
    borderColor: '#666',
    borderStyle: 'dashed',
    borderRadius: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  };

  const filesStyle = {
    marginTop: '5%',
    minHeight: '300px',
    maxHeight: '300px',
  };

  const uploadButtonStyle = {
    width: 100,
    fontSize: '0.8em',
    textAlign: 'center',
    marginLeft: 'auto',
    marginTop: 10,
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Dropzone
        style={dropStyle}
        accept="application/zip,
                  application/octet-stream,
                  application/x-zip,
                  application/x-rar,
                  application/x-zip-compressed,
                  application/x-rar-compressed,
                  compressed/rar,
                  application/rar,
                  application/xml,
                  text/xml"
        onDrop={(files, rejected) => {
          handleOnDrop(files);
          console.warn('rejected', rejected);
        }}
      >
        <div style={{ textAlign: 'center' }}>
          Try dropping some files here, or click to select files to upload.
        </div>
      </Dropzone>
      {files.length ? (
        <select style={filesStyle} multiple>
          {files.map((file, index) => {
            return <option key={'file-' + index}>{file.name}</option>;
          })}
        </select>
      ) : (
        <div style={{ marginTop: '5%' }}>No files added</div>
      )}
      <Progress strokeColor="#8dcc91" percent={uploadProgress} />
      <Button
        disabled={!files.length}
        sx={{
          width: 100,
          fontSize: '0.8em',
          textAlign: 'center',
          marginLeft: 'auto',
          marginTop: 1.25,
        }}
        color="primary"
        variant="contained"
        onClick={() => files.length && handleFileUpload(files)}
      >
        Upload
      </Button>
      {showSuccess && (
        <div style={{ color: 'green' }}>Files successfully uploaded</div>
      )}
    </div>
  );
};
