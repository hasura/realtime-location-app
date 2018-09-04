import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './UserInfo.css';

class UserInfo extends Component {
  render() {
    return (
      <div className="user_info">
        <div className="detail">
          <div className="onboarding">
            In order to simulate live location tracking, we have created a commuter <code>{ this.props.userId }</code> for you. Click on track location button to start tracking.
          </div>
          <div className="btn_wrapper">
            <button disabled={ this.props.isLoading ? true: false } onClick={ !this.props.isLoading ? this.props.handleTrackLocationClick : () => {}}>
              TRACK LOCATION
            </button>
          </div>
        </div>
      </div>
    )
  }
}

UserInfo.propTypes = {
  userId: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  handleTrackLocationClick: PropTypes.func.isRequired,
};

export default UserInfo;
