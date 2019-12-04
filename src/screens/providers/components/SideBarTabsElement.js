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

import React from 'react';

class SideBarTabsElement extends React.Component {
  render() {
    const { label, active, onClick } = this.props;
    const style = {
      border: '1px solid 1px solid rgb(229, 229, 229)',
      cursor: 'pointer',
      padding: 10,
      borderRadius: 5,
      background: 'rgba(128, 128, 128, 0.17)',
      marginBottom: 10,
      color: '#454545'
    };

    const activeStyle = {
      background: '#39a1f4',
      color: '#fff'
    };

    const appliedStyle = active ? { ...style, ...activeStyle } : style;

    return (
      <div onClick={onClick} style={appliedStyle}>
        {label}
      </div>
    );
  }
}

export default SideBarTabsElement;
