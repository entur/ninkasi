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

import { connect } from "react-redux";
import React, { Component, PropTypes } from "react";

class Modal extends React.Component {
  render() {
    if (this.props.isOpen === false) return null;

    const { minWidth, minHeight } = this.props;

    let modalStyle = {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: "11",
      minWidth: minWidth || "50%",
      height: minHeight,
      minHeight: minHeight || "60%",
      background: "#fff"
    };

    if (this.props.width && this.props.height) {
      modalStyle.width = this.props.width;
      modalStyle.height = this.props.height;
      (modalStyle.marginLeft = (this.props.width / 2) * -1),
        (modalStyle.marginTop = (this.props.height / 2) * -1),
        (modalStyle.transform = null);
    }

    if (this.props.style) {
      for (let key in this.props.style) {
        modalStyle[key] = this.props.style[key];
      }
    }

    let backdropStyle = {
      position: "fixed",
      width: "100%",
      height: "100%",
      top: 0,
      left: 0,
      zIndex: "10",
      background: "rgba(0, 0, 0, 0.3)"
    };

    if (this.props.backdropStyle) {
      for (let key in this.props.backdropStyle) {
        backdropStyle[key] = this.props.backdropStyle[key];
      }
    }

    return (
      <div className={this.props.containerClassName}>
        <div className={this.props.className} style={modalStyle}>
          {this.props.children}
        </div>
        {!this.props.noBackdrop && (
          <div
            className={this.props.backdropClassName}
            style={backdropStyle}
            onClick={e => this.close(e)}
          />
        )}
      </div>
    );
  }

  close(e) {
    e.preventDefault();

    if (this.props.onClose) {
      this.props.onClose();
    }
  }
}

const mapStateToProps = state => {
  return {
    loggedEvents: state.UtilsReducer.loggedEvents
  };
};

export default connect(mapStateToProps)(Modal);
