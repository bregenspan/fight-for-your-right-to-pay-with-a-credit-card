/*  Fight For Your Right To Pay With A Credit Card
 *  ================================================
 *
 *  Few things are valued more highly in modern society than the ability
 *  to pay with a credit card. While this fact unsurprisingly suits most
 *  businesses perfectly well, it runs contrary to the interests of the
 *  web's largest payment provider, which seeks to minimize the
 *  transaction costs it pays to the card networks.
 *
 *  In the quest for increased profits, the leadership of said company,
 *  (which rhymes with "papal" if you are given to slight mispronunciation
 *  and are fine with heavily redundant rhymes) tried every method of
 *  persuasion it could, pitting mildly misleading charts and
 *  calls-to-action against eachother in an attempt to convince the
 *  consumer to put down the plastic and pick up a checkbook.
 *
 *  But when A/B tests didn't work, they turned to wanton trickery and
 *  other crude tactics, like 3-click payment method selection, making it
 *  virtually impossible to pay the God-given way. As things stand today,
 *  if you want to pay with a credit card, you prettymuch have to fight
 *  for it.
 *
 *  You can either wait until President Ron Paul is in office and
 *  everything can be paid for with Bitcoin, OR you can install this
 *  Chrome extension, which will fight for you.
 *
 *  But don't take my word for it, listen to Bob the Center-Left Cow:
 *    ______________________________________
 *   < Moderately decent UX before profits! >
 *    --------------------------------------
 *           \   ^__^
 *            \  (oo)\_______
 *               (__)\       )\/\
 *                   ||----w |
 *                   ||     ||
 *
 *
 *  Comments/lawsuits: @BenRegenspan
 *
 */

/*  TODO: il8n on various detection strings, like "Bill Me Later",
 *  this assumes English-only Paypal interface for now.
 *
 *  Also, ensure that this actually works when the user has a bank account
 *  set up (only tested with Bill Me Later).
 */

$(function () {
    'use strict';

    function detectInitialPaymentForm(callback) {
        /*  Detect whether the user is on the first step
         *  of the payment process and annoying defaults
         *  are showing.  Call callback if so.
         */

        callback = callback || function () {};

        function checkForAnnoyingDefaults() {
            var fundingSelector = $('#funding-mix');

            // Make sure there is some reference to the annoying
            // default payment methods we're trying to avoid
            var badOptions = [
                'Bill Me Later',
                'Instant Transfer',
                'Bank Account',  // TODO: verify this is correct string
                'Checking Account' // TODO: verify this is correct string
            ];
            var html = fundingSelector.html();
            for (var i = 0, ilen = badOptions.length; i < ilen; i++) {
                if (html.indexOf(badOptions[i]) > -1) {
                    return true;
                }
            }
            return false;
        }

        // Ensure we're on the initial "express checkout" step
        if (window.location.href.indexOf('cmd=_express-checkout') === 0) {
            return false;
        }

        // We need to wait for the funding selector to show,
        // so poll for it.
        var interval = window.setInterval(function () {

            if ($('#funding-mix').length) {
                // We found the funding selector!
                window.clearInterval(interval);
                if (checkForAnnoyingDefaults()) {
                    callback();
                }
            }
        }, 50);

    }

    function detectPaymentSelectionForm(callback) {
        /* Detect whether user is on the form that
         * actually permits selecting a payment method, execute
         * callback if so */
        if ($('#fieldRow_1').length &&
                $('#fieldRow_2').length) {
            callback();
        }
        return false;
    }

    detectInitialPaymentForm(function () {
        // The user is on the stupid first payment form page
        // where the preferred payment method should be,
        // but isn't.

        // Trigger Paypal taking user to a whole new
        // page just to switch the funding option.
        // (This is the kind of thing that happens when you
        //      optimize for revenue at the expense of UX):
        $('#funding_select').click();
    });

    detectPaymentSelectionForm(function () {
        // The user is on the payment step where, after waiting
        // for the page to load (possibly with intentionally slow
        // pageload time, because I wouldn't put it past these
        // people) he or she is actually permitted to choose how
        // to pay.

        // Select the first card on the form:
        $('.Card:first input').attr('checked', 'checked');
        if ($('.Card').length == 1)
            $('#continue').click();

        // For safety's sake, don't do anything else for now.
        // It's up to user to submit.
    });

});
