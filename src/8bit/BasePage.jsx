import React from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";

import NotificationAlert from "react-notification-alert";

import Sidebar from "../components/Sidebar/Sidebar.jsx";
import BaseNavbar from "./BaseNavbar.jsx";

// Keep a reference to the notification object; used to expose methods for notification system
const notificationRef = React.createRef();

// Keep a reference to the perfect scroll bar
let ps;

/**
 * This component represents a base page containing the black dashboard react theme created
 * by Creative Tim. The idea behind this component is to create the template for my personal
 * projects.
 */
class BasePageHOC extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			opacity: 0,
			sidebarOpened: false,
		};
    }

	componentDidMount() {
		const { themeMode, sidebarCollapsed } = this.props;
		if ( themeMode === "light" ) {
			// Eventually, keep track of this on the state
			document.body.classList.add("white-content");
		} else {
			// It may not always be present but remove it to be sure
			document.body.classList.remove("white-content");
		}

		// TODO: just like the theme this needs to also happen when new props are received
		if ( sidebarCollapsed ) {
			document.body.classList.add("sidebar-mini");
		} else {
			document.body.classList.remove("sidebar-mini");
		}

		// sidebar-mini
		if (navigator.platform.indexOf("Win") > -1) {
			document.documentElement.className += " perfect-scrollbar-on";
			document.documentElement.classList.remove("perfect-scrollbar-off");
			ps = new PerfectScrollbar(this.refs.mainPanel);
			let tables = document.querySelectorAll(".table-responsive");
			for (let i = 0; i < tables.length; i++) {
				ps = new PerfectScrollbar(tables[i]);
			}
		}
		window.addEventListener("scroll", () => this.showNavbarButton());
	}

	componentWillUnmount() {
		if (navigator.platform.indexOf("Win") > -1) {
			ps.destroy();
			document.documentElement.className += " perfect-scrollbar-off";
			document.documentElement.classList.remove("perfect-scrollbar-on");
		}
		window.removeEventListener("scroll", () => this.showNavbarButton());
    }

	componentDidUpdate(e) {
		if (e.location.pathname !== e.history.location.pathname) {
			if (navigator.platform.indexOf("Win") > -1) {
				let tables = document.querySelectorAll(".table-responsive");
				for (let i = 0; i < tables.length; i++) {
					ps = new PerfectScrollbar(tables[i]);
				}
			}
			document.documentElement.scrollTop = 0;
			document.scrollingElement.scrollTop = 0;
			this.refs.mainPanel.scrollTop = 0;
		}
    }

	/**
	 * Responsible for showing the navbar button when the user is all the way at the top
	 * or showing the opaque version of it when the are scrolled down
	 */
	showNavbarButton() {
		if (
			document.documentElement.scrollTop > 50 ||
			document.scrollingElement.scrollTop > 50 ||
			this.refs.mainPanel.scrollTop > 50
		) {
			this.setState({ opacity: 1 });
		} else if (
			document.documentElement.scrollTop <= 50 ||
			document.scrollingElement.scrollTop <= 50 ||
			this.refs.mainPanel.scrollTop <= 50
		) {
			this.setState({ opacity: 0 });
		}
	}

	/**
	 * This method is responsible for getting the route the user is on and getting the route's
	 * name to display on the navbar. If the route is incorrectly configured it will default
	 * to the one that's been configured (defaults to "/")
	 * @param {*} routes 
	 */
	getActiveRoute(routes) {
		const pathname = window.location.pathname;
		const hash = window.location.hash;
		const activeRoute = activeRoute ? activeRoute : this.props.defaultActiveRoute;
		for (let i = 0; i < routes.length; i++) {
			if (routes[i].collapse) {
				let collapseActiveRoute = this.getActiveRoute(routes[i].views);
				if (collapseActiveRoute !== activeRoute) {
					return collapseActiveRoute;
				}
			} else {
				const currRoutePath = routes[i].layout + routes[i].path;
				// This checks the path taking into account both BrowserRouter (/route)
				// and HashRouter (#/route)
				if ( pathname.indexOf(currRoutePath) !== -1 || hash.indexOf(currRoutePath) !== -1 ) {
					// return routes[i].name;
					return routes[i];
				}
			}
		}
		return null;
	}

	toggleThemeMode() {
		// Look at FixedPlugin.jsx to implement this but this should set "white-content" if "light" is passed in
		document.body.classList.toggle("white-content");
	}

	/**
	 * This method is responsible for toggling the sidebar between mini and expanded.
	 * NOTE: This is how the example code came, I know its odd that there's a handleMiniClick
	 * and a toggleSideBar
	 */
    handleMiniClick() {
        document.body.classList.toggle("sidebar-mini");
	}

	/**
	 * Responsible for toggling the sidebar from open to close
	 */
	toggleSidebar() {
		this.setState({
			sidebarOpened: !this.state.sidebarOpened
		});
		document.documentElement.classList.toggle("nav-open");
	}

	/**
	 * Responsible for closing the sidebar
	 * NOTE: This function is passed into the sidebar component, and directly from
	 * the docs >> this is used on responsive to close the sidebar on route
	 * navigation
	 */
    closeSidebar() {
        this.setState({
            sidebarOpened: false,
		});
		document.documentElement.classList.remove("nav-open");
    };

    render() {
		const activeRoute = this.getActiveRoute(this.props.routes);
		const brandText = activeRoute ? activeRoute.name : this.props.defaultActiveRoute;
		const brandUrl = activeRoute ? activeRoute.path : "/";
		const {
			activeColor,
			location,
			renderNavbar,
			renderFooter,
			routes,
			sidebarLogo,
			sidebarOpened,
		} = this.props;
        return (
            <div className="wrapper">
				<div className="rna-container">
					{/* <NotificationAlert ref="notificationAlert" /> */}
					<NotificationAlert ref={ notificationRef } />
				</div>
				<div
					className="navbar-minimize-fixed"
					style={{ opacity: this.state.opacity }}>
					<button
						className="minimize-sidebar btn btn-link btn-just-icon"
						onClick={ () => this.handleMiniClick() }>
						<i className="tim-icons icon-align-center visible-on-sidebar-regular text-muted" />
						<i className="tim-icons icon-bullet-list-67 visible-on-sidebar-mini text-muted" />
					</button>
				</div>
                <Sidebar
                    { ...this.props }
                    routes={ routes }
                    activeColor={ activeColor }
                    logo={ sidebarLogo }
                    closeSidebar={ () => this.closeSidebar() } />
                <div className="main-panel" ref="mainPanel" data={ activeColor }>
                    <BaseNavbar
						location={ location }
                        handleMiniClick={ () => this.handleMiniClick() }
						brandText={ brandText }
						brandUrl={ brandUrl }
                        sidebarOpened={ sidebarOpened }
						toggleSidebar={ this.toggleSidebar }
						render={ renderNavbar }
                    />
					<div className="content">
						{ this.props.children }
					</div>
					{ renderFooter && renderFooter() }
                </div>
            </div>
        );
    }
}

BasePageHOC.propTypes = {
	// Main color used by the sidebar
	activeColor: PropTypes.oneOf(["primary", "blue", "green", "orange", "red"]),

	// Determines if main theme is dark or light, defaults to dark
	themeMode: PropTypes.oneOf(["dark", "light"]),

	// The content to be displayed
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),

	// The default text to display on the navbar if a name is unable to be extracted
	// from the route
	defaultActiveRoute: PropTypes.string,

	// This location object is passed in from withRouter
	location: PropTypes.object.isRequired,

	// Both these render functions are responsible for the content displayed in the
	// navbar and footer (optional)
	renderFooter: PropTypes.func,
	renderNavbar: PropTypes.func.isRequired,

	// This is an array of objects containing all your web app's top level routes, found in
	// both the sidebar and navbar
	routes: PropTypes.arrayOf(
		PropTypes.shape({
			component: PropTypes.func.isRequired,
			icon: PropTypes.string,
			layout: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
			path: PropTypes.string.isRequired,
		})
	).isRequired,

	// This is the logo that appears at the top of the side bar
	sidebarLogo: PropTypes.shape({
		innerLink: PropTypes.string, // URL when clicking on this logo
		text: PropTypes.string,
		imgSrc: PropTypes.any,
		logoType: PropTypes.oneOf(["image", "icon"]),
	}).isRequired,

	// Option to whether display the sidebar collapsed or expanded, defaults to collapsed
	sidebarCollapsed: PropTypes.bool.isRequired,
};

BasePageHOC.defaultProps = {
	activeColor: "blue",
	themeMode: "dark",
	defaultActiveRoute: "/",
	sidebarLogo: {
		innerLink: "/",
		text: "8Bit Ghost",
		imgSrc: "fas fa-futbol fa-2x",
		logoType: "icon",
	},
	sidebarCollapsed: true,
};

const showPrimaryNotice = (message, autoDismiss, place="tr") => {
	showNotificationAlert(message, autoDismiss, place, "primary");
};

const showSecondaryNotice = (message, autoDismiss, place="tr") => {
	showNotificationAlert(message, autoDismiss, place, "secondary");
};

const showSuccessNotice = (message, autoDismiss, place="tr") => {
	showNotificationAlert(message, autoDismiss, place, "success");
};

const showInfoNotice = (message, autoDismiss, place="tr") => {
	showNotificationAlert(message, autoDismiss, place, "info");
};

const showWarningNotice = (message, autoDismiss, place="tr") => {
	showNotificationAlert(message, autoDismiss, place, "warning");
};

const showErrorNotice = (message, autoDismiss, place="tr") => {
	// const err = getErrorMessage(error);
	showNotificationAlert(message, autoDismiss, place, "danger");
};

const showLightNotice = (message, autoDismiss, place="tr") => {
	showNotificationAlert(message, autoDismiss, place, "light");
};

const showDarkNotice = (message, place="tr", autoDismiss) => {
	showNotificationAlert(message, autoDismiss, place,"dark");
};

// NOTE: This function is not exported on purpose, it serves as the base method for the others
const showNotificationAlert = (message, autoDismiss, place="tr", type="default") => {
	let notifyOptions = {
		place: place,
		type: type,
		icon: "tim-icons icon-alert-circle-exc",
		message: (
			<div>{message}</div>
		)
	};

	if ( autoDismiss ) {
		notifyOptions.autoDismiss = autoDismiss;
	}
	notificationRef.current.notificationAlert(notifyOptions);
};

const BasePage = withRouter(BasePageHOC);

export {
	BasePage,
	showPrimaryNotice,
	showSecondaryNotice,
	showSuccessNotice,
	showInfoNotice,
	showWarningNotice,
	showErrorNotice,
	showLightNotice,
	showDarkNotice,
};
