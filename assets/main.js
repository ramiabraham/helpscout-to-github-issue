window.HelpscoutToGithubIssue = window.HelpscoutToGithubIssue || {};

( function HelpscoutToGithubIssueMain( window, document, app, undefined ) {
    "use strict";

    var module = app.main = {},
        subModule = null,
        subModuleInstance = null;

    // Step 1: Change this to the url of your repo
    var repolink = 'https://github.com/AffiliateWP/AffiliateWP';


    /**
     * C.R.E.A.M.
     */
    module.cache = function cache() {
        app.c = {};
        app.c.wrapper = document.querySelector( '#js-wrap' );
        app.c.ticketWrapper = app.c.wrapper.querySelector( '#ticket' );
        app.c.listWrapper = app.c.wrapper.querySelector( '#folder' );
    };

    /**
     * checks necessary requirements to run application
     *
     * @returns {boolean}app.c.listWrapper
     */
    module.meetRequirements = function meetRequirements() {
        if ( app.c.wrapper === null ) {
            return false;
        }

        if ( app.c.ticketWrapper === null && app.c.listWrapper === null ) {
            return false;
        }

        return true;
    };

    /**
     * Defines which submodule we need to run
     */
    module.setSubmodule = function() {
        if ( app.c.ticketWrapper !== null ) {
            subModule = 'single';
        } else if ( app.c.listWrapper !== null ) {
            subModule = 'list';
        }
    };

    /**
     * init submodule
     */
    module.initSubmodule = function initSubmodule() {
        subModuleInstance = app[ subModule ];

        return new Promise( subModuleInstance.init ).then( function submoduleResolvedInit() {
            var tickets = subModuleInstance.getTickets();

            module.insertGithubIssueButton( tickets );
        } );
    };

    module.insertGithubIssueButton = function insertGithubIssueButton( tickets ) {
        tickets.forEach( function insertHVButton( ticket ) {
            var ghButtonEl = module.buildGithubButton( ticket );

            ticket.nodeParent.insertBefore( ghButtonEl, ticket.nodeBefore );
        } );
    };

    module.buildGithubButton = function buildGithubButton( ticket ) {

        var ghButton = document.createElement( 'a' );

        /**
         * Github sanitizes strings - you may wish to include a more stringent filter.
         * In our case, a '#' character is the only thing that needs to be stripped.
         */
        var ts = ticket.ticketSubject.toString();
        var tid = ticket.ticketId.toString();
        var tsClean = ts.replace( "#", "" );
        var tidClean = tid.replace( "#", "" );

        // Step 2: Change this to any issue string you'd like
        var newIssueString = '/issues/new?title=' + tsClean + tidClean + '&body=Related ticket ID: ' + tidClean;

        ghButton.classList.add( 'github-issue-button' );
        ghButton.setAttribute( 'target', '_blank' );
        ghButton.setAttribute( 'href', repolink + newIssueString );
        ghButton.dataset.item = JSON.stringify( {
            "id": "hs_" + ticket.ticketId,
            "name": ticket.ticketId + " " + ticket.ticketSubject
        } );
        ghButton.dataset.group = JSON.stringify( {
            "id": "hs",
            "name": "AffiliateWP"
        } );

        return ghButton;
    };


    /**
     * Init application
     */
    module.init = function init() {
        module.cache();

        if ( module.meetRequirements() ) {
            module.setSubmodule();
            module.initSubmodule();
        } else {
            window.requestAnimationFrame( module.init );
        }
    };

    document.addEventListener( 'DOMContentLoaded', module.init );
}( window, document, window.HelpscoutToGithubIssue ) );
