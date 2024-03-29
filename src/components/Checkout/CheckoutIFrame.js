import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { scrollToElement } from '../../utils/helpers';
import './CheckoutIFrame.css';
/*function iframeURLChange(iframe, callback) {
  var lastDispatched = null;

  var dispatchChange = function () {
    var newHref = iframe.contentWindow.location.href;

    if (newHref !== lastDispatched) {
      callback(newHref);
      lastDispatched = newHref;
    }
  };

  var unloadHandler = function () {
    // Timeout needed because the URL changes immediately after
    // the `unload` event is dispatched.
    setTimeout(dispatchChange, 0);
  };

  function attachUnload() {
    // Remove the unloadHandler in case it was already attached.
    // Otherwise, there will be two handlers, which is unnecessary.
    iframe.contentWindow.removeEventListener("unload", unloadHandler);
    iframe.contentWindow.addEventListener("unload", unloadHandler);
  }

  iframe.addEventListener("load", function () {
    attachUnload();

    // Just in case the change wasn't dispatched during the unload event...
    dispatchChange();
  });

  attachUnload();
}*/



export const CheckoutIFrame = ({ transactionSetupUrl }) => {
  useEffect(() => {
    scrollToElement(document.getElementById('vantiv-iframe'), 0);
   /* iframeURLChange(document.getElementById("vantiv-iframe"), function (newURL) {
      console.log("URL changed:", newURL);
    });*/
  }, []);

  return (
    <div>
      {transactionSetupUrl && (
        <iframe
          className="card bg-secondary"
          id="vantiv-iframe"
          src={transactionSetupUrl}
          frameBorder="0"
        />
      )}
    </div>
  );
};
CheckoutIFrame.propTypes = {
  transactionSetupUrl: PropTypes.string
};
